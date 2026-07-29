"use client";

import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/store/cart-store";
import { useCartHydrated } from "@/hooks/use-cart-hydrated";
import CheckoutForm from "./checkout-form";
import OrderSummary, { PaymentAndLinks } from "./order-summary";

// Owns the empty-cart decision because it covers both the form and the summary —
// a guard inside CheckoutForm cannot hide its sibling OrderSummary.
const CheckoutContent = ({ shippingMethods = [], accountDefaults = null }) => {
  const cartHydrated = useCartHydrated();
  const cartItems = useCartStore((state) => state.cartItems);

  // Reachable by browser-back after a paid order (the cart is cleared on success),
  // by deep link, or by emptying the cart in another tab. Without this the form
  // submits an empty cart and the API rejects it as an invalid checkout request.
  if (cartHydrated && cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24">
        <h1 className="font-aeonik text-[28px] xl:text-[35px] text-black-custom text-center">
          Your bag is empty
        </h1>
        <p className="font-aeonik text-[14px] text-gray-text text-center max-w-sm">
          Add something to your bag to continue to checkout.
        </p>
        <Link
          href="/"
          className="h-14 px-12 bg-black-custom font-aeonik text-[15px] uppercase text-white-custom rounded-xl hover:bg-gray-text transition-colors duration-300 flex items-center"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 xl:gap-8 lg:grid lg:grid-cols-[1fr_700px] lg:items-start">
      {/* Order Summary — mobile only, collapsible, above the form */}
      <div className="order-1 lg:hidden mt-8">
        <OrderSummary shippingMethods={shippingMethods} collapsible showFooterLinks={false} />
      </div>

      {/* Checkout Form — left on desktop */}
      <div className="order-2 lg:order-1 flex flex-col">
        <h1 className="hidden xl:block font-aeonik text-[28px] xl:text-[35px] text-black-custom mb-2">Checkout</h1>
        <CheckoutForm
          shippingMethods={shippingMethods}
          accountDefaults={accountDefaults}
        />
      </div>

      {/* Order Summary — desktop only, right, sticky */}
      <div className="hidden lg:block lg:order-2">
        <div className="sticky top-28">
          <OrderSummary shippingMethods={shippingMethods} />
        </div>
      </div>

      {/* Payment icons + footer links — mobile only, at the bottom */}
      <div className="order-3 lg:hidden">
        <PaymentAndLinks />
      </div>
    </div>
  );
};

export default CheckoutContent;
