// @ts-check
import { test, expect } from "@playwright/test";

// Core smoke tests — run against every deployment.
// These tests validate that key pages load and contain expected content.
// They do NOT test checkout/payment (those require Stripe test mode setup).

test.describe("Home page", () => {
  test("loads and redirects to default locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/el/);
  });

  test("has no broken images in viewport", async ({ page }) => {
    await page.goto("/el");
    // Use "load" not "networkidle" — SanityLive keeps an SSE connection open
    // permanently, so networkidle never fires on pages using it.
    await page.waitForLoadState("load");

    const brokenImages = await page.evaluate(() => {
      return Array.from(document.images)
        .filter((img) => !img.naturalWidth)
        .map((img) => img.src);
    });

    expect(brokenImages, `Broken images: ${brokenImages.join(", ")}`).toHaveLength(0);
  });
});

test.describe("Shop — all products", () => {
  test("loads product grid", async ({ page }) => {
    await page.goto("/el/shop/shop-all");
    await expect(page.locator("[data-testid='product-card']").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("loads product grid on English locale", async ({ page }) => {
    await page.goto("/en/shop/shop-all");
    await expect(page.locator("[data-testid='product-card']").first()).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("Shop — bundles", () => {
  test("bundles page loads", async ({ page }) => {
    await page.goto("/el/shop/bundles");
    await expect(page).toHaveURL(/bundles/);
    await expect(page.locator("main")).not.toBeEmpty();
  });
});

test.describe("Navigation", () => {
  // The locale switcher in the menu overlay uses <span> elements, not <a> links —
  // it is not yet wired up to navigate. Skip until it is implemented as real links.
  test.skip("locale switcher navigates between el and en", async ({ page }) => {
    await page.goto("/el");
    await page.getByRole("link", { name: /english/i }).click();
    await expect(page).toHaveURL(/\/en/);
  });
});

test.describe("404 handling", () => {
  test("shows not-found page for unknown product slug", async ({ page }) => {
    await page.goto("/el/shop/product/this-slug-does-not-exist-xyz");
    // notFound() is called inside a <Suspense> boundary — with Next.js streaming
    // the HTTP 200 header is sent before the inner component resolves, so we check
    // for the not-found UI rather than the HTTP status code.
    await expect(page.locator("h1").filter({ hasText: /Αυτή η σελίδα δεν υπάρχει/ })).toBeVisible({
      timeout: 10000,
    });
  });

  // An unknown path under a locale renders app/not-found.jsx, which reads the
  // locale from the request: text and home link must follow the URL's language.
  for (const { locale, heading, cta } of [
    { locale: "en", heading: "This page doesn't exist", cta: "Back to Home" },
    { locale: "el", heading: "Αυτή η σελίδα δεν υπάρχει", cta: "Επιστροφή στην αρχική" },
  ]) {
    test(`shows the ${locale} not-found page for an unknown ${locale} path`, async ({ page }) => {
      const response = await page.goto(`/${locale}/this-page-does-not-exist-xyz`);
      expect(response?.status()).toBe(404);
      await expect(page.locator("h1")).toHaveText(heading);
      await expect(page.getByRole("link", { name: cta, exact: true })).toHaveAttribute("href", `/${locale}`);
    });
  }
});

test.describe("Cookie banner", () => {
  const CONSENT_KEY = "spotteq_cookie_consent";

  test("shows translated copy on a first visit", async ({ page }) => {
    await page.goto("/en");
    const banner = page.getByTestId("cookie-banner");
    await expect(banner).toBeVisible();
    await expect(banner).toContainText("We use cookies");
  });

  for (const { button, stored } of [
    { button: "Accept All", stored: "accepted" },
    { button: "Decline", stored: "declined" },
  ]) {
    test(`"${button}" is remembered across reloads`, async ({ page }) => {
      await page.goto("/en");
      await page.getByTestId("cookie-banner").getByRole("button", { name: button }).click();
      await expect(page.getByTestId("cookie-banner")).toBeHidden();
      expect(await page.evaluate((key) => localStorage.getItem(key), CONSENT_KEY)).toBe(stored);

      await page.reload();
      await page.waitForLoadState("load");
      await expect(page.getByTestId("cookie-banner")).toBeHidden();
    });
  }

  test("closing hides it for the session only", async ({ page }) => {
    await page.goto("/en");
    await page.getByTestId("cookie-banner").getByRole("button", { name: "Close" }).click();
    await expect(page.getByTestId("cookie-banner")).toBeHidden();
    expect(await page.evaluate((key) => localStorage.getItem(key), CONSENT_KEY)).toBeNull();
    expect(await page.evaluate((key) => sessionStorage.getItem(key), CONSENT_KEY)).toBe("dismissed");
  });
});

test.describe("UserWay widget", () => {
  test("loads the widget script with the account id", async ({ page }) => {
    await page.goto("/el");
    await expect(page.locator('script[src="https://cdn.userway.org/widget.js"]')).toHaveAttribute(
      "data-account",
      "f8N3POMRAT",
      { timeout: 15000 },
    );
  });

  // UserWay picks its language once at startup, so an in-app locale switch has
  // to tell it. The real widget is blocked and stubbed so the test can see the call.
  // The stub is installed before any page script: in dev, hydration can finish
  // after "load", so a stub added later raced LocaleLanguageSetter's mount call.
  test("follows an in-app locale switch", async ({ page, isMobile }) => {
    test.skip(isMobile, "The navbar language toggle is desktop-only");
    await page.route("https://cdn.userway.org/**", (route) => route.abort());
    await page.addInitScript(() => {
      window.__userwayLangCalls = [];
      window.UserWay = { changeWidgetLanguage: (lang) => window.__userwayLangCalls.push(lang) };
    });
    await page.goto("/el");
    // LocaleLanguageSetter reports "el" on mount: the page has hydrated, so the
    // toggle's click handler is attached.
    await expect.poll(() => page.evaluate(() => window.__userwayLangCalls)).toContain("el");

    await page.getByRole("button", { name: "Switch to English" }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect.poll(() => page.evaluate(() => window.__userwayLangCalls.at(-1))).toBe("en");
  });
});

// Same force-static pitfall for links: a Server Component's i18n <Link> without
// an explicit `locale` falls back to el, sending /en visitors to Greek pages.
test.describe("Home page links keep the locale", () => {
  for (const { locale, other } of [
    { locale: "en", other: "el" },
    { locale: "el", other: "en" },
  ]) {
    test(`no /${other}/ links on /${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`);
      const hrefs = await page.locator("main a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
      expect(hrefs.filter((h) => h.startsWith(`/${other}/`) || h === `/${other}`)).toEqual([]);
    });
  }
});

// The footer is a Server Component in the (root) layout: on the force-static
// home page it needs the explicit locale too.
test.describe("Footer translations", () => {
  const en = ["Sign up for SPOTTEQ updates", "By subscribing you agree", "INFORMATION", "SHIPPING & PAYMENTS", "RETURNS POLICY", "TERMS OF USE"];
  const el = ["Μείνε ενημερωμένος για τη SPOTTEQ", "Με την εγγραφή σου συμφωνείς", "ΠΛΗΡΟΦΟΡΙΕΣ", "ΑΠΟΣΤΟΛΕΣ & ΠΛΗΡΩΜΕΣ", "ΠΟΛΙΤΙΚΗ ΕΠΙΣΤΡΟΦΩΝ", "ΟΡΟΙ ΧΡΗΣΗΣ",
    // All-Greek letters (the source text had a Latin E and H in it).
    "\u03a3\u03a5\u03a7\u039d\u0395\u03a3 \u0395\u03a1\u03a9\u03a4\u0397\u03a3\u0395\u0399\u03a3"];
  for (const { path, expected, absent } of [
    { path: "/en", expected: en, absent: el[0] },
    { path: "/el", expected: el, absent: en[0] },
    { path: "/en/about", expected: en, absent: el[0] },
  ]) {
    test(`footer on ${path}`, async ({ page }) => {
      await page.goto(path);
      const footer = page.locator("#footer-section");
      for (const text of expected) await expect(footer).toContainText(text);
      await expect(footer).not.toContainText(absent);
    });
  }
});

// The home page is force-static, so a section that forgets to pass `locale` to
// getTranslations silently falls back to the default (el) on /en. textContent
// covers both the mobile and desktop layouts (one of them is always hidden).
test.describe("Home page translations", () => {
  for (const { locale, expected, absent } of [
    { locale: "en", expected: ["Nassos Ghavelas", "Paralympic Champion, SPOTTEQ Ambassador", "Feb 6, 2026", "In elite sport"], absent: "Νάσος Γκαβέλας" },
    { locale: "el", expected: ["Νάσος Γκαβέλας", "Παραολυμπιονίκης, Brand Ambassador της SPOTTEQ", "6 Φεβ 2026", "Στον πρωταθλητισμό"], absent: "Nassos Ghavelas" },
  ]) {
    test(`Stories that move is in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`);
      const section = page.locator("#stories-that-move-section");
      for (const text of expected) await expect(section).toContainText(text);
      await expect(section).not.toContainText(absent);
      // The heading stays in English on both locales.
      await expect(section).toContainText("Stories that move");
    });
  }

  for (const { locale, expected, absent } of [
    { locale: "en", expected: "A focused line of science-driven formulas", absent: "Μια στοχευμένη σειρά προϊόντων" },
    { locale: "el", expected: "Μια στοχευμένη σειρά προϊόντων", absent: "A focused line of science-driven formulas" },
  ]) {
    test(`Featured Products description is in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`);
      const section = page.locator("#featured-products-section");
      await expect(section).toContainText(expected);
      await expect(section).not.toContainText(absent);
    });
  }

  for (const { locale, expected, absent } of [
    { locale: "en", expected: "Curated combinations of products that work together", absent: "Προσεκτικά επιλεγμένοι συνδυασμοί" },
    { locale: "el", expected: "Προσεκτικά επιλεγμένοι συνδυασμοί", absent: "Curated combinations of products that work together" },
  ]) {
    test(`Bundles description is in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`);
      const section = page.locator("#bundle-section");
      await expect(section).toContainText(expected);
      await expect(section).not.toContainText(absent);
    });
  }

  for (const { locale, expected, absent } of [
    { locale: "en", expected: "SPOTTEQ is a performance nutrition brand", absent: "Η SPOTTEQ είναι ένα brand αθλητικής διατροφής" },
    { locale: "el", expected: "Η SPOTTEQ είναι ένα brand αθλητικής διατροφής", absent: "SPOTTEQ is a performance nutrition brand" },
  ]) {
    test(`About description is in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`);
      const section = page.locator("#about-section");
      await expect(section).toContainText(expected);
      await expect(section).not.toContainText(absent);
    });
  }

  for (const { locale, expected, absent } of [
    { locale: "en", expected: "The core principle of SPOTTEQ is to offer premium products", absent: "Βασική αρχή της SPOTTEQ" },
    { locale: "el", expected: "Βασική αρχή της SPOTTEQ", absent: "The core principle of SPOTTEQ is to offer premium products" },
  ]) {
    test(`Quality description is in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`);
      const section = page.locator("#quality-section-section");
      await expect(section).toContainText(expected);
      await expect(section).not.toContainText(absent);
    });
  }

  // Shop All has no description of its own and falls back to the Featured Products text.
  for (const { locale, expected, absent } of [
    { locale: "en", expected: "A focused line of science-driven formulas", absent: "Μια στοχευμένη σειρά προϊόντων" },
    { locale: "el", expected: "Μια στοχευμένη σειρά προϊόντων", absent: "A focused line of science-driven formulas" },
  ]) {
    test(`Shop All description is in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/shop/shop-all`);
      const main = page.locator("main");
      await expect(main).toContainText(expected);
      await expect(main).not.toContainText(absent);
    });
  }
});
