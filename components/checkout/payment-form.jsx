"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement, ExpressCheckoutElement } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";

const PaymentForm = ({ orderNumber, locale, customerInfo, onBack }) => {
  const stripe   = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [error, setError]           = useState("");
  // Set once the Express Checkout Element reports a wallet this browser can use;
  // the "or pay with card" divider only shows then.
  const [hasWallet, setHasWallet]   = useState(false);

  // Shared by Pay Now (card) and the wallet buttons. Returns the Stripe error, if any.
  const confirm = async () => {
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

    if (confirmError) return confirmError;

    if (paymentIntent?.status === "succeeded") {
      // replace, not href: leaves no /checkout entry behind the success page, so
      // browser-back returns to where the customer was before checkout rather than
      // to a checkout form whose cart has just been cleared.
      window.location.replace(`/${locale}/checkout/success?order_number=${orderNumber}&payment_confirmed=true`);
    }
    return null;
  };

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

    const confirmError = await confirm();
    if (confirmError) setError(confirmError.message);
    setProcessing(false);
  };

  // Apple Pay / Google Pay button. The wallet sheet has already collected the
  // payment details, and the Payment Intent already exists (Elements was created
  // with its clientSecret), so this confirms directly, without elements.submit().
  // Wallet-provided billing details take precedence over the ones passed in
  // confirm(); ours only fill the fields the wallet leaves empty.
  const handleExpressConfirm = async (event) => {
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    const confirmError = await confirm();
    if (confirmError) {
      event.paymentFailed({ reason: "fail" });
      setError(confirmError.message);
    }
    setProcessing(false);
  };

  return (
    <div className="bg-white-custom rounded-2xl p-6 flex flex-col gap-6">
      <h2 className="font-aeonik text-[16px] xl:text-[18px] uppercase text-black-custom">
        Payment Details
      </h2>

      {/* Apple Pay / Google Pay as their own buttons above the card form, rather
          than as options inside the Payment Element: selecting Google Pay there
          could leave the card fields unresponsive (seen in Arc). Shows nothing
          when the browser has no wallet. */}
      <ExpressCheckoutElement
        onConfirm={handleExpressConfirm}
        onReady={({ availablePaymentMethods }) => setHasWallet(Boolean(availablePaymentMethods))}
        options={{
          buttonHeight: 48,
          buttonTheme: { applePay: "black", googlePay: "black" },
          buttonType:  { applePay: "plain", googlePay: "plain" },
          paymentMethods: { applePay: "auto", googlePay: "auto", link: "never", paypal: "never", amazonPay: "never", klarna: "never" },
        }}
      />

      {hasWallet && (
        <div className="flex items-center gap-3 font-aeonik text-[12px] uppercase text-gray-text">
          <span className="flex-1 border-t border-gray-mint" />
          or pay with card
          <span className="flex-1 border-t border-gray-mint" />
        </div>
      )}

      {/* Card only: Link hidden (and its "save my info" opt-in), wallets moved to
          the buttons above. */}
      <PaymentElement options={{ wallets: { link: "never", applePay: "never", googlePay: "never" } }} />

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
        className="font-aeonik text-[13px] text-gray-text underline text-center cursor-pointer hover:text-black-custom transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Return to delivery details
      </button>
    </div>
  );
};

export default PaymentForm;
