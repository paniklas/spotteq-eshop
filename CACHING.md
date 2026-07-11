# Caching & Sanity Revalidation

How catalog content (products, categories, bundles, navigation) is cached, and
how a change in Sanity Studio reaches the live storefront. Read this before
deploying or when debugging "my change isn't showing up".

---

## 1. How it works

Catalog data is read through a single helper, [`sanity/lib/catalogFetch.js`](sanity/lib/catalogFetch.js),
which has two paths:

| Situation | Path | Behaviour |
| --- | --- | --- |
| **Editor in Presentation tool** (draft mode on) | Sanity Live Content API (`sanityFetch`) | Real-time. Unpublished draft edits show instantly. Never cached. |
| **Normal visitor** (draft mode off) | Tagged, time-cached `client.fetch` (via the live API, `useCdn:false`) | Served from Next.js's Data Cache. No Sanity round-trip per view. |

**Publishing a change → customer sees it:**

```
Publish in Sanity Studio
        │
        ▼
Sanity fires webhook  ──►  POST /api/webhook/sanity-revalidate
        │                         │
        │                  verify signature (SANITY_REVALIDATE_WEBHOOK_SECRET)
        │                         │
        │                  revalidateTag(tag, { expire: 0 })   ← immediate expiry
        ▼                         │
   (~1–3 seconds)                 ▼
Next page load for that tag  ──►  re-fetches fresh data, re-caches it
```

- Updates are **near-instant** (one page load after publishing), **not** a live
  push to already-open browser tabs. That auto-refresh only exists in the
  Presentation tool for editors — customers see fresh data on their next page
  load, which is standard e-commerce behaviour.
- If the webhook ever fails to arrive, each cached entry still self-refreshes
  after its **fallback window** (`revalidate: 3600` — 1 hour — in `catalogFetch`).

> **Why `useCdn:false` on the cached path:** Next.js is already the caching
> layer. Routing the refetch through Sanity's CDN edge double-caches, and the
> CDN lags the live API by more than the webhook's ~3s consistency wait — so a
> refetch right after a tag purge could re-cache a **stale** value and get stuck
> on it until the next publish. Querying the live API keeps refetches
> consistent. (This bit us during development; don't flip it back to `true`.)

---

## 2. What is cached vs always-live

| Function | Cached? | Tags |
| --- | --- | --- |
| `getProductBySlug` | ✅ | `product:<slug>` |
| `getAllProducts` | ✅ | `products` |
| `getRelatedProducts` | ✅ | `products` |
| `getFeaturedProducts` | ✅ | `products`, `homePage` |
| `getAllCategories` / `getCategoriesByGroup` | ✅ | `categories` |
| `getCategoryBySlug` | ✅ | `category:<slug>`, `categories` |
| `getShopBundles` | ✅ | `bundles` |
| `getBundleBySlug` | ✅ | `bundle:<slug>`, `bundles` |
| `getBundlesContainingProduct` | ✅ | `bundles` |
| `getAllBundlesForCart` | ✅ | `bundles` |
| `getNavData` | ✅ | `nav`, `categories`, `bundles` |
| `getAllBundles` (home bundle section) | ✅ | `bundles` |
| `getShippingMethods` (checkout) | ❌ always live | — |

`getShippingMethods` is intentionally live so checkout never shows a stale
shipping price. `getAllBundles` (home) is cached via `catalogFetch` with the
`bundles` tag — a bundle or product publish refreshes it through the existing
webhook. (It previously used the live API, which the home page's `force-static`
render silently froze to the 24h fallback; routing it through `catalogFetch`
fixed that and preserves the Presentation-tool live preview.)

### How the cart & checkout get data (not through this cache)

The cart is **client-side state** (Zustand + localStorage) — each item stores
its price at add-to-cart time. At checkout, `create-payment-intent` re-fetches
prices **fresh and uncached** via `backendClient`, so the amount charged is
never based on a cache. This is deliberate: a payment flow should always price
against current data. There is nothing to "cache" here.

> (Three unused helper files — `getCartProducts`, `getCartBundles`,
> `getAllGoals` — were removed as dead code; they were never part of the caching
> system.)

---

## 3. Webhook tag mapping

[`app/api/webhook/sanity-revalidate/route.js`](app/api/webhook/sanity-revalidate/route.js)
maps the published document type to the tags it purges:

| Published `_type` | Tags purged |
| --- | --- |
| `product` | `products`, `bundles`, `product:<slugEn>`, `product:<slugEl>` |
| `category` | `categories`, `nav`, `category:<slugEn>`, `category:<slugEl>` |
| `categoryGroup` | `nav` |
| `bundle` | `bundles`, `nav`, `bundle:<slugEn>`, `bundle:<slugEl>` |
| `homePage` | `homePage`, `products` |

**Why `product` also purges `bundles`:** bundle listings and bundle detail pages
embed constituent product data (price, title, inventory). Purging `bundles` on a
product change keeps that embedded data fresh. (`getBundleBySlug` is tagged with
both `bundle:<slug>` and `bundles` so detail pages are covered too.) The cost is
that every product publish also refetches bundle caches on next request — cheap,
since there are only a handful of bundles.

---

## 4. Deploy checklist

### 4a. Environment variables (per environment)

Set these in **each** environment (`.env.local` for dev, Vercel project env vars
for production):

| Variable | Purpose |
| --- | --- |
| `SANITY_REVALIDATE_WEBHOOK_SECRET` | Verifies incoming Sanity webhook signatures. Must match the Secret set on the Sanity webhook that targets this environment. |
| `REVALIDATE_SECRET` | Guards the manual `revalidateSyncTags` server action. Any random string. |

(These are in addition to the existing `NEXT_PUBLIC_SANITY_*`, `SANITY_API_TOKEN`,
`SANITY_API_READ_TOKEN`, Stripe, Clerk, and BoxNow vars.)

Generate secrets with:

```bash
openssl rand -hex 32
```

### 4b. Sanity webhook (sanity.io/manage → project → API → Webhooks → Create)

| Field | Value |
| --- | --- |
| **Name** | e.g. `Next.js revalidate (production)` |
| **URL** | `https://<your-domain>/api/webhook/sanity-revalidate` |
| **Dataset** | `production` |
| **Trigger on** | Create, Update, Delete |
| **Filter** | `_type in ["product", "category", "categoryGroup", "bundle", "homePage"]` |
| **Projection** | `{"type": _type, "slugEn": slugs.en.current, "slugEl": slugs.el.current}` |
| **HTTP method** | POST |
| **API version** | latest (default) |
| **Secret** | the `SANITY_REVALIDATE_WEBHOOK_SECRET` value for the target environment |

The **Filter** and **Projection** are not optional — without them the route
receives the wrong payload and silently no-ops.

**Extra toggles on the webhook form:**

| Toggle | Set to | Why |
| --- | --- | --- |
| **Drafts** ("trigger when drafts are modified") | **OFF** | Drafts are for the Presentation tool (live API, bypasses this cache). Enabling fires on every autosave and needlessly purges the published cache — the "huge traffic" warning is real. |
| **Versions** ("trigger when versions are modified") | **OFF** | For Sanity's scheduled-releases feature. A normal Publish already fires via Create/Update/Delete. Only enable if you adopt content releases. |
| **Secret** | **SET IT** | Required — the route verifies the HMAC signature against it. Must equal `SANITY_REVALIDATE_WEBHOOK_SECRET` for the target environment, or the route returns `401`. |

---

## 5. Multiple webhooks (local, production)

You can create as many webhooks as you like; each is independent (own URL, own
secret). **One webhook per Next.js deployment / cache**, not per domain:

- **Local dev** — point at your tunnel (e.g. ngrok) URL. Free ngrok URLs change
  on every restart, so update the webhook URL each time you tunnel. Its Secret
  must match `SANITY_REVALIDATE_WEBHOOK_SECRET` in `.env.local`.
- **Production** — point at your real domain. Its Secret must match the
  `SANITY_REVALIDATE_WEBHOOK_SECRET` set in Vercel's production env.

> A custom domain and the `*.vercel.app` alias of the **same** Vercel project
> share the same serverless functions and the same Data Cache, so **one**
> production webhook (pointing at either URL) purges for both. You only need a
> separate webhook when there's a genuinely separate deployment/cache
> (e.g. a distinct staging Vercel project). Per-deployment Vercel *preview*
> URLs are ephemeral and not practical to wire a webhook to — previews rely on
> the fallback window.

---

## 6. Full test checklist

Run these after any deploy or change to the caching/webhook code. Tick each.

### A. Webhook plumbing
- [ ] Change a product price in Studio → **Publish**.
- [ ] sanity.io/manage → your webhook → **Attempt log** shows `200` within a few
      seconds, body like `{"revalidated":true,"tags":[...]}`.
- [ ] Reload the product page → new price shows.
- [ ] Reload `/shop/shop-all` (and its category page) → new price shows there too
      (covers the `products` tag on listings).

### B. Repeated updates (catches the `useCdn` race we fixed)
- [ ] Change the same product's price **again**, publish → propagates on reload.
- [ ] Do it a **third** time rapidly → still propagates. (If any get stuck,
      confirm `useCdn:false` in `catalogFetch.js`.)

### C. Product ↔ bundle cross-purge (the edge-case fix)
- [ ] Put a product into a bundle. Change that **product's** price + publish.
- [ ] Bundle listing (`/shop/bundles`) and the bundle **detail** page both show
      the product's new price/data on reload (not just the standalone product).

### D. Categories & nav
- [ ] Rename/toggle a category + publish → category page, shop nav, and any
      category filters reflect it on reload.
- [ ] Add/remove a bundle + publish → it appears/disappears in nav and
      `/shop/bundles`.

### E. Delete behaviour
- [ ] Unpublish/delete a product + publish → it disappears from listings on
      reload (and its detail page 404s / "not found").

### F. Fallback window (optional / spot-check)
- [ ] Temporarily disable the webhook in Sanity, change a price, publish, wait —
      it should still refresh within the `revalidate` window (1 hour). Re-enable
      the webhook afterward. (Usually skipped; the webhook is the primary path.)

### G. Presentation tool / draft mode (admin real-time)
- [ ] Open the Presentation tool, edit a product **without** publishing → the
      preview pane updates live.
- [ ] The public site (not in draft mode) still shows the **published** value.
- [ ] Click "Disable Draft Mode" (or hit `/api/draft-mode/disable`) → preview
      reverts to published content.

### H. Time-based caches (separate system, §2)
- [ ] Change a product used in the cart → the cart/checkout view reflects it
      within ~60s (not instant — expected).

### I. Auth & checkout smoke (root layout was restored — verify nothing broke)
- [ ] Signed out, visit `/el/account` → redirects to sign-in.
- [ ] Sign in → lands on account; sign up a fresh test account works.
- [ ] `<html lang>` is correct on both `/en/...` and `/el/...` pages.
- [ ] Complete a test checkout (Stripe test card) → order succeeds, correct
      amount charged.
- [ ] Shipping prices at checkout match Sanity (this query is always-live).

---

## 7. Troubleshooting

| Symptom | Likely cause / fix |
| --- | --- |
| Change doesn't appear after publish | Check the webhook **Attempt log** for a non-200 or missing delivery. Confirm the webhook Secret matches the env var in that environment. |
| Webhook returns `401 Invalid signature` | Secret mismatch between the Sanity webhook and `SANITY_REVALIDATE_WEBHOOK_SECRET`. |
| Webhook returns `200` but page still stale | Confirm `useCdn:false` is still set on the cached client in `catalogFetch.js`. |
| Stale content only in local dev after many rebuilds | On-disk cache cruft. `rm -rf .next && pnpm run build && pnpm run start`. |
| Editor sees stale content in Presentation tool | Draft mode not active — re-enter via the Studio Presentation tool (which hits `/api/draft-mode/enable`). |

---

## 8. Trade-offs (why it's built this way)

- **Kept:** low Sanity API cost, fast cached pages, near-instant updates on
  publish, real-time admin preview, 1-hour safety net.
- **Gave up:** live auto-refresh of already-open **customer** tabs (normal for
  e-commerce; not something customers rely on).
- **Rejected:** Next.js Cache Components (`cacheComponents: true`) — it can serve
  fully static pages but broke the Presentation tool and forced invasive root
  layout / Clerk changes. Not worth it for this store.
