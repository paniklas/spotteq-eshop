import "server-only";

import { buildInvoicePayload } from "./invoice-mapping";

const GATEWAY_URL = process.env.COMPLIANCE_GATEWAY_URL;
const API_KEY = process.env.COMPLIANCE_GATEWAY_API_KEY;

/** How the gateway's SubmissionLog statuses land on the order document. */
const STATUS_MAP = {
  SUCCESS: "submitted",
  FAILED: "failed",
  AMBIGUOUS: "ambiguous",
};

export function isGatewayConfigured() {
  return Boolean(GATEWAY_URL && API_KEY);
}

/**
 * File the retail receipt (ΑΠΥ) for an order with the Compliance Gateway.
 *
 * Returns a plain result rather than throwing, because every caller is on the
 * non-fatal path: the Stripe webhook must still return 200 for the steps that
 * already succeeded, and the retry route needs the failure text to store.
 *
 * ⚠ Idempotency is keyed on the Sanity order `_id`. That is what makes both
 * Stripe's redelivery and a manual retry safe: the gateway re-attempts a FAILED
 * submission under the same key but replays SUCCESS and AMBIGUOUS untouched, so
 * no order can ever produce two documents.
 *
 * @returns {Promise<{status: string, submissionId?: string, externalId?: string, error?: string}>}
 */
export async function submitInvoice(order) {
  if (!isGatewayConfigured()) {
    return { status: "skipped", error: "Compliance Gateway is not configured." };
  }

  let payload;
  try {
    payload = buildInvoicePayload(order);
  } catch (err) {
    // A mapping failure is a data problem, not a transport one — it will fail
    // identically on retry until the order is corrected, so say so plainly.
    return { status: "failed", error: `Mapping failed: ${err.message}` };
  }

  let res;
  let body;
  try {
    res = await fetch(`${GATEWAY_URL}/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "Idempotency-Key": order._id,
      },
      body: JSON.stringify(payload),
    });
    body = await res.json().catch(() => null);
  } catch (err) {
    // Transport failure. The document may or may not have been filed, but the
    // idempotency key means a retry resolves it either way.
    return { status: "failed", error: `Gateway unreachable: ${err.message}` };
  }

  if (!res.ok) {
    // 409 means a submission for this order is already in flight — not a
    // failure, and overwriting the status would hide the one that is running.
    if (res.status === 409) {
      return { status: "in_progress", error: "A submission for this order is already in progress." };
    }
    const detail = body?.message ?? body?.errorMessage ?? res.statusText;
    return {
      status: "failed",
      error: `Gateway returned ${res.status}: ${
        Array.isArray(detail) ? detail.join("; ") : detail
      }`,
    };
  }

  // A FAILED or AMBIGUOUS submission still comes back as HTTP 200 with the
  // outcome in the body — the call succeeded, the filing did not.
  return {
    status: STATUS_MAP[body?.status] ?? "failed",
    submissionId: body?.submissionId,
    externalId: body?.externalId,
    error: body?.errorMessage
      ? `${body.errorCode ?? "ERROR"}: ${body.errorMessage}`
      : undefined,
  };
}

/** The GROQ projection `submitInvoice` needs. Shared by the webhook and the retry route. */
export const INVOICE_ORDER_PROJECTION = `{
  _id,
  orderNumber,
  orderDate,
  email,
  customerName,
  totalPrice,
  currency,
  amountDiscount,
  shippingCost,
  billingAddress,
  invoiceStatus,
  "shippingName": shippingMethod->name,
  products[]{
    quantity,
    price,
    selectedFlavour,
    "title": product->title,
    "sku": product->sku
  },
  bundles[]{
    quantity,
    price,
    "title": bundle->title
  }
}`;

/**
 * Submit an order and record the outcome on the order document. Shared by the
 * Stripe webhook and the manual retry route so the two cannot drift into
 * different notions of what "invoiced" means.
 */
export async function submitInvoiceAndRecord(client, orderId) {
  const order = await client.fetch(
    `*[_type == "order" && _id == $orderId][0]${INVOICE_ORDER_PROJECTION}`,
    { orderId },
  );
  if (!order) return { status: "failed", error: "Order not found." };

  // Never re-file an order that already has a document. The gateway would
  // replay rather than duplicate, but not calling at all is clearer and does
  // not consume a metered request.
  if (order.invoiceStatus === "submitted") {
    return { status: "submitted", skipped: true };
  }

  const result = await submitInvoice(order);

  // 409 leaves the existing status alone — something else is mid-flight.
  if (result.status === "in_progress") return result;

  await client
    .patch(orderId)
    .set({
      invoiceStatus: result.status,
      invoiceSubmittedAt: new Date().toISOString(),
      ...(result.submissionId ? { invoiceSubmissionId: result.submissionId } : {}),
      ...(result.externalId ? { invoiceExternalId: result.externalId } : {}),
      invoiceError: result.error ?? null,
    })
    .commit();

  return result;
}
