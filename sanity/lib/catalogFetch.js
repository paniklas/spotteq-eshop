import "server-only";
import { draftMode } from "next/headers";
import { client } from "./client";
import { sanityFetch } from "./live";

/**
 * HOW SANITY DATA + NEXT.JS CACHING FIT TOGETHER IN THIS PROJECT
 * (see CACHING.md at the repo root for the full picture + deploy checklist)
 * ------------------------------------------------------------------------
 * Catalog data (products, categories, bundles, nav) is read through
 * `catalogFetch`, which takes one of two paths:
 *
 *   1. DRAFT MODE ON — Sanity Presentation tool / Visual Editing.
 *      Goes through the Live Content API (`sanityFetch`), so editors see
 *      unpublished draft changes update in real time. Never cached.
 *
 *   2. DRAFT MODE OFF — normal visitors.
 *      A tagged, time-cached `fetch`. The result lands in Next.js's Data
 *      Cache, keyed by query + params and labelled with cache TAGS
 *      (e.g. `products`, `product:<slug>`, `bundles`, `nav`). Later page
 *      views are served from that cache instead of re-querying Sanity —
 *      this is the main cost / performance win.
 *
 * HOW A PUBLISHED CHANGE REACHES CUSTOMERS
 * ----------------------------------------
 * On Publish, Sanity fires a webhook to `app/api/webhook/sanity-revalidate`,
 * which calls `revalidateTag(tag, { expire: 0 })` for the affected tags.
 * That immediately expires the matching cache entries, so the *next* page
 * request re-fetches fresh data (near-instant — one page load). The
 * `revalidate` below (1 hour) is only a fallback for the rare case the webhook
 * never arrives — it bounds worst-case staleness if the webhook silently
 * breaks. This affects *display* only; the amount charged at checkout is always
 * recomputed fresh server-side (uncached backendClient), never off this cache.
 */

// useCdn:false for the cached path. Next.js's Data Cache is already the caching
// layer here (tags + revalidate), so routing the underlying fetch through
// Sanity's CDN edge only double-caches — and the CDN lags the live API by more
// than the webhook's ~3s consistency wait, so a refetch triggered right after a
// tag purge can re-cache the OLD value from the CDN and get stuck on it until
// the next publish. Hitting the live API instead keeps refetches consistent.
const cachedClient = client.withConfig({ useCdn: false });

export async function catalogFetch({ query, params = {}, tags = [], revalidate = 3600 }) {
  const { isEnabled } = await draftMode();

  if (isEnabled) {
    const result = await sanityFetch({ query, params });
    return result.data;
  }

  return cachedClient.fetch(query, params, { next: { tags, revalidate } });
}
