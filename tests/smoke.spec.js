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
    await expect(page.locator("h1, h2").filter({ hasText: /not found|404|δε βρέθηκε/i })).toBeVisible({
      timeout: 10000,
    });
  });
});
