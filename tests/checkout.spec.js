// @ts-check
import { test, expect } from "@playwright/test";

// Checkout form validation tests.
// These only test the form UI — NOT actual payment processing.
// Real payment tests require Stripe test mode and are excluded from CI by default.

test.describe("Checkout form validation", () => {
  test.beforeEach(async ({ page }) => {
    // Seed cart with one item via localStorage before navigating to checkout
    await page.goto("/el");
    await page.evaluate(() => {
      // Adjust this object shape to match your Zustand store's cart item structure
      const cartState = {
        state: {
          cartItems: [
            {
              id: "test-product-id",
              type: "product",
              cartId: "test-cart-id",
              qty: 1,
              price: 29.99,
              inventory: 10,
              title: "Test Product",
            },
          ],
        },
        version: 0,
      };
      localStorage.setItem("spotteq-cart-v2", JSON.stringify(cartState));
    });
    await page.goto("/el/checkout");
  });

  test("checkout page loads with cart item", async ({ page }) => {
    await expect(page).toHaveURL(/checkout/);
    await expect(page.locator("main")).not.toBeEmpty();
  });

  test("shows validation errors when submitting empty form", async ({ page }) => {
    // Add data-testid="checkout-submit" to the submit button in checkout-form.jsx
    await page.getByTestId("checkout-submit").click();
    // Expect at least one validation error to appear
    // React Hook Form adds aria-invalid to invalid fields
    await expect(page.locator("[aria-invalid='true']").first()).toBeVisible();
  });

  test("email field rejects invalid format", async ({ page }) => {
    // Add data-testid="email-input" to the email field in checkout-form.jsx
    await page.getByTestId("email-input").fill("notanemail");
    await page.getByTestId("checkout-submit").click();
    await expect(page.getByTestId("email-input")).toHaveAttribute("aria-invalid", "true");
  });

  test("shows order summary with correct item count", async ({ page }) => {
    // Add data-testid="order-summary-items" to the items section in order-summary.jsx
    await expect(page.getByTestId("order-summary-items")).toBeVisible();
  });

  test("redirects to shop when cart is empty", async ({ page }) => {
    // Clear cart and reload checkout
    await page.evaluate(() => localStorage.removeItem("spotteq-cart-v2"));
    await page.goto("/el/checkout");
    // Should redirect away from checkout since cart is empty
    await expect(page).not.toHaveURL(/checkout/);
  });
});
