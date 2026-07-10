"use client";

import { useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/store/cart-store";
import CheckoutForm from "./checkout-form";
import OrderSummary from "./order-summary";

// The cart lives in localStorage, so it reads as empty during SSR and through the
// hydration render. Gating the empty-bag state on hydration keeps a customer with a
// full cart from seeing it flash on every checkout visit.
const subscribeHydration = (cb) => useCartStore.persist.onFinishHydration(cb);
const getCartHydrated = () => useCartStore.persist.hasHydrated();
const getCartHydratedOnServer = () => false;

// Owns the empty-cart decision because it covers both the form and the summary —
// a guard inside CheckoutForm cannot hide its sibling OrderSummary.
const CheckoutContent = ({ shippingMethods = [], accountDefaults = null }) => {
  const cartHydrated = useSyncExternalStore(
    subscribeHydration,
    getCartHydrated,
    getCartHydratedOnServer
  );
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
    <div className="grid lg:grid-cols-[1fr_700px] gap-8">
      {/* Checkout Form — left */}
      <div className="flex flex-col">
        <h1 className="font-aeonik text-[28px] xl:text-[35px] text-black-custom mb-2">Checkout</h1>
        <CheckoutForm shippingMethods={shippingMethods} accountDefaults={accountDefaults} />
      </div>

      {/* Order Summary — right, sticky */}
      <div>
        <div className="sticky top-28">
          <OrderSummary shippingMethods={shippingMethods} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;
