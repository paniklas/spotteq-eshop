import "server-only";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { recordCouponUsage } from "@/app/actions/coupon";

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
  const { orderId, orderNumber, couponId, couponEmail } = paymentIntent.metadata ?? {};

  if (!orderId) {
    console.error("[webhook] payment_intent.succeeded: missing orderId in metadata — PI:", paymentIntent.id);
    return;
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

  // Decrement inventory for all products (direct + inside bundles)
  await decrementInventory(orderId);

  // Record coupon usage only after confirmed payment
  // (improvement: hatlias does this in create-payment-intent, which records usage even on abandoned checkouts)
  if (couponId && couponEmail && orderNumber) {
    await recordCouponUsage(couponId, couponEmail, orderNumber);
  }
}

async function handlePaymentFailed(paymentIntent) {
  const { orderId } = paymentIntent.metadata ?? {};
  if (!orderId) return;

  await backendClient
    .patch(orderId)
    .set({ status: "cancelled" })
    .commit()
    .catch((err) => console.error("[webhook] Failed to cancel order:", err));
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
    for (const c of bundle.constituents ?? []) {
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
