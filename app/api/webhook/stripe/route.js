import "server-only";
import { createHash } from "crypto";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { recordCouponUsage } from "@/app/actions/coupon";
import { createDeliveryRequest } from "@/lib/boxnow";
import { submitInvoiceAndRecord, isGatewayConfigured } from "@/lib/compliance-gateway";

// Must be Node.js runtime — Edge runtime cannot read the raw request body
// required for Stripe signature verification.
export const runtime = "nodejs";

export async function POST(req) {
  const body = await req.text();
  const sig  = (await headers()).get("stripe-signature");

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;
      default:
        break;
    }
  } catch (err) {
    // Return 500 so Stripe retries the event — do not swallow errors here
    console.error(`[webhook] Handler error for ${event.type}:`, err);
    return new Response("Handler failed", { status: 500 });
  }

  return new Response(null, { status: 200 });
}

async function handlePaymentSucceeded(paymentIntent) {
  const { orderId, orderNumber, couponId, couponEmail, firstOrderUserInfoId, firstOrderClaimId } =
    paymentIntent.metadata ?? {};

  if (!orderId) {
    console.error("[webhook] payment_intent.succeeded: missing orderId in metadata — PI:", paymentIntent.id);
    return;
  }

  // Spend the customer's one-time first-order discount. Only set here, never at
  // intent creation: an abandoned checkout must not burn the discount.
  //
  // Deliberately ABOVE the already-paid guard. Setting a flag to the same value
  // is idempotent, so re-running it on a redelivery costs nothing — whereas the
  // guard exists for the steps below that are NOT idempotent (coupon usage
  // appends to a log and increments a counter, inventory decrements), which
  // would double-count. Keeping it here means a failure is recoverable: replay
  // the event in Stripe and the flag is re-applied, instead of being skipped
  // forever because the order is already marked paid.
  if (firstOrderUserInfoId) {
    try {
      const profile = await backendClient.fetch(
        `*[_id == $id][0]{ firstOrderDiscountClaim }`,
        { id: firstOrderUserInfoId }
      );

      // Clear the hold only when it is the one THIS intent was authorised with.
      // A redelivery of an old success event must not wipe a hold some later
      // checkout is relying on — which is reachable in practice, because support
      // is told they may switch the used flag back off to re-grant the discount.
      const holdIsOurs =
        Boolean(firstOrderClaimId) && profile?.firstOrderDiscountClaim?.id === firstOrderClaimId;

      const patch = backendClient.patch(firstOrderUserInfoId).set({
        // Always recorded: this intent really did spend the discount, whether or
        // not a hold is still sitting on the profile.
        firstOrderDiscountUsed: true,
        firstOrderDiscountUsedAt: new Date().toISOString(),
      });

      await (holdIsOurs ? patch.unset(["firstOrderDiscountClaim"]) : patch).commit();
    } catch (err) {
      console.error("[webhook] First-order discount flag failed for order", orderId, err);
    }
  }

  // Idempotency guard — Stripe can fire the same event more than once on retries
  const order = await backendClient.fetch(
    `*[_type == "order" && _id == $orderId][0]{ status }`,
    { orderId }
  );
  if (order?.status === "paid") return;

  // Mark order paid and record the Payment Intent ID
  await backendClient
    .patch(orderId)
    .set({
      status: "paid",
      stripePaymentIntentId: paymentIntent.id,
    })
    .commit();

  // ⚠ Everything past this point must be individually non-fatal.
  //
  // The order is now "paid", so the guard above turns any Stripe redelivery into
  // an early return. A throw here would therefore return 500, and the retry it
  // triggers would skip every remaining step — inventory, coupon, BoxNow AND the
  // invoice — permanently, rather than re-running them. Each side effect owns its
  // own failure so one cannot silently cancel the others.

  // Decrement inventory for all products (direct + inside bundles)
  try {
    await decrementInventory(orderId);
  } catch (err) {
    console.error("[webhook] Inventory decrement failed for order", orderId, err);
  }

  // Record coupon usage only after confirmed payment
  if (couponId && couponEmail && orderNumber) {
    try {
      await recordCouponUsage(couponId, couponEmail, orderNumber);
      // The hold has done its job: from here the usage log is the permanent
      // record that this email redeemed this coupon, and it is what the next
      // checkout checks. Deleting is safe to repeat on a redelivery.
      await releaseCouponHold(couponId, couponEmail);
    } catch (err) {
      console.error("[webhook] Coupon usage recording failed for order", orderId, err);
    }
  }

  // Auto-create BoxNow delivery request if this is a BoxNow order
  try {
    const fullOrder = await backendClient.fetch(
      `*[_type == "order" && _id == $orderId][0]{
        orderNumber,
        email,
        totalPrice,
        boxNowLockerId,
        boxNowLockerName,
        boxNowLockerAddress,
        shippingAddress,
        "shippingProvider": shippingMethod->provider
      }`,
      { orderId }
    );

    if (fullOrder?.shippingProvider === "boxnow" && fullOrder.boxNowLockerId) {
      const { deliveryRequestId, parcelId } = await createDeliveryRequest(fullOrder);
      await backendClient
        .patch(orderId)
        .set({
          boxNowDeliveryRequestId: deliveryRequestId,
          boxNowParcelId:          parcelId,
          boxNowParcelStatus:      "new",
        })
        .commit();
    }
  } catch (err) {
    // Non-fatal: log and continue — the Stripe webhook must return 200.
    // Stripe will not retry this step on failure, so the order is left with no
    // boxNowParcelId and no automatic recovery.
    // TODO: add a Sanity Studio document action to manually retry createDeliveryRequest()
    // for orders stuck with shippingProvider "boxnow" and no boxNowParcelId.
    console.error("[webhook] BoxNow delivery request failed for order", orderId, err);
  }

  // File the retail receipt (ΑΠΥ) with the Compliance Gateway → myDATA/ΑΑΔΕ.
  //
  // Non-fatal for the same reason BoxNow is, and the reasoning is worth keeping:
  // an invoice IS a legal obligation, so throwing looks like the responsible
  // choice. It is not. Throwing makes Stripe redeliver the whole event, and the
  // `status === "paid"` guard at the top returns early on redelivery — so the
  // retry would skip the invoice too, while re-running nothing else either. It
  // would trade a visible failure for an invisible one.
  //
  // Instead the outcome is recorded on the order (`invoiceStatus`), which makes
  // it visible in Studio and retryable via POST /api/orders/invoice/retry.
  if (isGatewayConfigured()) {
    try {
      const result = await submitInvoiceAndRecord(backendClient, orderId);
      if (result.status !== "submitted") {
        console.error(
          `[webhook] Invoice ${result.status} for order ${orderId}:`,
          result.error,
        );
      }
    } catch (err) {
      // submitInvoiceAndRecord already swallows gateway and mapping failures;
      // reaching here means Sanity itself failed, so the order has no
      // invoiceStatus at all. Log loudly — this one is invisible in Studio.
      console.error("[webhook] Could not record invoice outcome for order", orderId, err);
    }
  }
}

// Mirrors couponClaimDocId in create-payment-intent — same address, so the hold
// taken there is the one dropped here.
async function releaseCouponHold(saleId, email) {
  const emailKey = createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 32);
  await backendClient.delete(`couponClaim.${saleId}.${emailKey}`);
}

async function handlePaymentFailed(paymentIntent) {
  const { orderId } = paymentIntent.metadata ?? {};
  if (!orderId) return;

  await backendClient
    .patch(orderId)
    .set({ status: "cancelled" })
    .commit()
    .catch((err) => console.error("[webhook] Failed to cancel order:", err));

  // The first-order discount hold is deliberately NOT released here. A failed
  // payment leaves the intent confirmable — the customer can put in another card
  // and pay that same discounted intent. Releasing the hold would let a second
  // checkout claim the discount while this intent can still settle, so the
  // discount could be spent twice. The hold stays with the intent that carries
  // it, and is freed when that intent succeeds, or when it expires and the next
  // checkout takes it over (cancelling this intent as it does).
}

async function decrementInventory(orderId) {
  // Fetch the order with direct products AND bundle constituent products in one query
  const order = await backendClient.fetch(
    `*[_type == "order" && _id == $orderId][0]{
      products[]{
        quantity,
        "productId": product->_id
      },
      bundles[]{
        quantity,
        "selected": selectedFlavours[]{
          quantity,
          "productId": variant->_id
        },
        "constituents": bundle->products[]{
          quantity,
          "productId": product->_id
        }
      }
    }`,
    { orderId }
  );

  if (!order) return;

  // Aggregate total demand per product so bundles sharing a product are handled correctly
  const demand = {};

  for (const item of order.products ?? []) {
    if (!item.productId) continue;
    demand[item.productId] = (demand[item.productId] ?? 0) + item.quantity;
  }

  for (const bundle of order.bundles ?? []) {
    // Decrement the flavours the customer actually chose. Fall back to the bundle's
    // default constituents for legacy lines (no stored selection) and for a stored
    // selection that is incomplete — e.g. a chosen variant deleted before this ran,
    // whose null productId would otherwise leave that slot silently un-decremented.
    const selectedComplete = bundle.selected?.length && bundle.selected.every((c) => c.productId);
    const lines = (selectedComplete ? bundle.selected : bundle.constituents) ?? [];
    for (const c of lines) {
      if (!c.productId) continue;
      demand[c.productId] = (demand[c.productId] ?? 0) + bundle.quantity * c.quantity;
    }
  }

  if (!Object.keys(demand).length) return;

  // One Sanity transaction for all decrements — atomic, minimal round trips
  const tx = backendClient.transaction();
  for (const [productId, qty] of Object.entries(demand)) {
    tx.patch(productId, (p) => p.dec({ inventory: qty }));
  }

  try {
    await tx.commit();
  } catch (err) {
    // Log but do not re-throw — order is already paid, inventory can be reconciled manually
    console.error("[webhook] Inventory decrement failed for order", orderId, err);
  }
}
