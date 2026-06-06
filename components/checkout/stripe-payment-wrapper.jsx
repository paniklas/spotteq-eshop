"use client";

import { useState, useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import PaymentForm from "./payment-form";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StripePaymentWrapper = ({ customerInfo, items, shippingMethodId, coupon, locale, onBack }) => {
  const [clientSecret, setClientSecret]   = useState("");
  const [orderNumber, setOrderNumber]     = useState("");
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const intentCreated = useRef(false);

  useEffect(() => {
    if (intentCreated.current) return;
    intentCreated.current = true;

    const create = async () => {
      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              id:              i.id,
              type:            i.type,
              qty:             i.qty,
              selectedFlavour: i.selectedFlavour ?? "",
            })),
            shippingMethodId,
            couponId:   coupon?._id   ?? null,
            couponCode: coupon?.couponCode ?? null,
            customerInfo,
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to initialise payment.");

        setClientSecret(data.clientSecret);
        setOrderNumber(data.orderNumber);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    create();
  }, []);

  const appearance = {
    theme: "flat",
    variables: {
      colorPrimary:     "#000000",
      colorBackground:  "#ffffff",
      colorText:        "#1a1a1a",
      colorDanger:      "#ef4444",
      fontFamily:       "system-ui, sans-serif",
      borderRadius:     "12px",
      spacingUnit:      "4px",
    },
    rules: {
      ".Input": {
        border:     "1px solid #d9d9d9",
        boxShadow:  "none",
        padding:    "14px 16px",
      },
      ".Input:focus": {
        border:    "1px solid #000000",
        boxShadow: "none",
        outline:   "none",
      },
      ".Input--invalid": {
        border: "1px solid #ef4444",
      },
      ".Label": {
        fontSize:   "11px",
        fontWeight: "400",
        color:      "#1a1a1a",
      },
    },
  };

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="font-aeonik text-[14px] text-red-700 mb-4">{error}</p>
        <button
          onClick={onBack}
          className="font-aeonik text-[13px] underline text-black-custom"
        >
          Go back and try again
        </button>
      </div>
    );
  }

  if (loading || !clientSecret) {
    return (
      <div className="bg-white-custom rounded-2xl p-6 flex flex-col items-center justify-center gap-3 py-12">
        <Loader2 className="w-6 h-6 animate-spin text-black-custom" />
        <p className="font-aeonik text-[14px] text-gray-text">Preparing payment…</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <PaymentForm
        orderNumber={orderNumber}
        locale={locale}
        customerInfo={customerInfo}
        onBack={onBack}
      />
    </Elements>
  );
};

export default StripePaymentWrapper;
