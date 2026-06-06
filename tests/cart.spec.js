// @ts-check
import { test, expect } from "@playwright/test";

// Cart tests. These require at least one active product to exist in Sanity.
// The selectors below use data-testid attributes — add them to your components
// as you build out the tests. See the comment on each selector.

test.describe("Cart drawer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/el/shop/shop-all");
    await page.waitForLoadState("networkidle");
  });

  test("opens when cart icon is clicked", async ({ page }) => {
    // Add data-testid="cart-trigger" to the cart icon button in navbar.jsx
    await page.getByTestId("cart-trigger").click();
    // Add data-testid="cart-drawer" to the cart drawer root element
    await expect(page.getByTestId("cart-drawer")).toBeVisible();
  });

  test("cart is empty on first visit", async ({ page }) => {
    // Clear localStorage to ensure clean state
    await page.evaluate(() => localStorage.removeItem("spotteq-cart-v2"));
    await page.reload();

    await page.getByTestId("cart-trigger").click();
    // Add data-testid="cart-empty-message" to the empty cart message
    await expect(page.getByTestId("cart-empty-message")).toBeVisible();
  });

  test("adds a product to cart", async ({ page }) => {
    // Add data-testid="add-to-cart-btn" to the add-to-cart button in product-card or product-interactive
    const firstCard = page.getByTestId("product-card").first();
    await firstCard.getByTestId("add-to-cart-btn").click();

    await page.getByTestId("cart-trigger").click();
    // Add data-testid="cart-item" to each cart line item
    await expect(page.getByTestId("cart-item")).toHaveCount(1);
  });

  test("increases item quantity", async ({ page }) => {
    const firstCard = page.getByTestId("product-card").first();
    await firstCard.getByTestId("add-to-cart-btn").click();

    await page.getByTestId("cart-trigger").click();
    // Add data-testid="qty-increase" to the + button in cart-drawer.jsx
    await page.getByTestId("qty-increase").click();
    // Add data-testid="cart-item-qty" to the quantity display
    await expect(page.getByTestId("cart-item-qty")).toHaveText("2");
  });

  test("removes an item from cart", async ({ page }) => {
    const firstCard = page.getByTestId("product-card").first();
    await firstCard.getByTestId("add-to-cart-btn").click();

    await page.getByTestId("cart-trigger").click();
    // Add data-testid="remove-item" to the remove button in cart-drawer.jsx
    await page.getByTestId("remove-item").click();
    await expect(page.getByTestId("cart-empty-message")).toBeVisible();
  });

  test("cart persists across page navigation", async ({ page }) => {
    const firstCard = page.getByTestId("product-card").first();
    await firstCard.getByTestId("add-to-cart-btn").click();

    // Navigate away and back
    await page.goto("/el");
    await page.goto("/el/shop/shop-all");

    await page.getByTestId("cart-trigger").click();
    await expect(page.getByTestId("cart-item")).toHaveCount(1);
  });
});

test.describe("Coupon validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/el/shop/shop-all");
    // Add a product so coupon input appears
    await page.getByTestId("product-card").first().getByTestId("add-to-cart-btn").click();
    await page.getByTestId("cart-trigger").click();
  });

  test("shows error for invalid coupon code", async ({ page }) => {
    // Add data-testid="coupon-input" to the coupon input in cart-drawer.jsx
    await page.getByTestId("coupon-input").fill("INVALIDCODE999");
    // Add data-testid="coupon-submit" to the apply coupon button
    await page.getByTestId("coupon-submit").click();
    // Add data-testid="coupon-error" to the error message
    await expect(page.getByTestId("coupon-error")).toBeVisible();
  });

  test("shows error for expired coupon", async ({ page }) => {
    // Use a known expired coupon code from your Sanity data
    await page.getByTestId("coupon-input").fill("EXPIREDCODE");
    await page.getByTestId("coupon-submit").click();
    await expect(page.getByTestId("coupon-error")).toBeVisible();
  });
});
