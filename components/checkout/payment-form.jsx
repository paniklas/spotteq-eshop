"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";

const PaymentForm = ({ orderNumber, locale, customerInfo, onBack }) => {
  const stripe   = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [error, setError]           = useState("");

  const handlePay = async () => {
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setProcessing(false);
      return;
    }

    const baseUrl    = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const returnUrl  = `${baseUrl}/${locale}/checkout/success?order_number=${orderNumber}`;

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
        payment_method_data: {
          billing_details: {
            name:  `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: {
              country:     customerInfo.country,
              postal_code: customerInfo.postalCode,
              city:        customerInfo.city,
              line1:       customerInfo.address,
              line2:       customerInfo.apartment || "",
            },
          },
        },
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      window.location.href = `/${locale}/checkout/success?order_number=${orderNumber}&payment_confirmed=true`;
    }

    setProcessing(false);
  };

  return (
    <div className="bg-white-custom rounded-2xl p-6 flex flex-col gap-6">
      <h2 className="font-aeonik text-[16px] xl:text-[18px] uppercase text-black-custom">
        Payment Details
      </h2>

      <PaymentElement />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-aeonik text-[13px] text-red-700">{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handlePay}
        disabled={!stripe || processing}
        className="h-14 w-full bg-black-custom font-aeonik text-[16px] uppercase cursor-pointer text-white-custom rounded-xl hover:bg-gray-text transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {processing && <Loader2 className="w-4 h-4 animate-spin" />}
        {processing ? "Processing…" : "Pay Now"}
      </button>

      <button
        type="button"
        onClick={onBack}
        disabled={processing}
        className="font-aeonik text-[13px] text-gray-text underline text-center hover:text-black-custom transition-colors disabled:opacity-40"
      >
        Return to delivery details
      </button>
    </div>
  );
};

export default PaymentForm;
