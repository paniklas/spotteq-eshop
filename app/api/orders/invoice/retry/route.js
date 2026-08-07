import "server-only";
import { backendClient } from "@/sanity/lib/backendClient";
import { submitInvoiceAndRecord, isGatewayConfigured } from "@/lib/compliance-gateway";

export const runtime = "nodejs";

// Ceiling on a sweep, so one call cannot fan out into an unbounded number of
// gateway requests (each of which is metered against the plan).
const MAX_SWEEP = 50;

/**
 * Manual retry for orders whose myDATA submission did not succeed.
 *
 *   POST /api/orders/invoice/retry
 *   Authorization: Bearer $INVOICE_RETRY_SECRET
 *   { "orderId": "<sanity _id>" }   — one order
 *   { "all": true }                 — every order left in "failed", up to 50
 *
 * ⚠ Retry is safe by construction: the gateway keys idempotency on the order id,
 * so a FAILED submission is genuinely re-attempted while SUCCESS and AMBIGUOUS
 * replay their recorded outcome without filing a second document.
 *
 * ⚠ "ambiguous" orders are deliberately NOT swept. The gateway treats AMBIGUOUS
 * as terminal and will replay it forever; the document may or may not exist at
 * ΑΑΔΕ, and only checking Elorus resolves it. Sweeping them would burn requests
 * and, worse, imply the problem was being worked on.
 *
 * There is no Sanity Studio document action for this on purpose: a Studio action
 * runs in the browser, so wiring one would mean shipping this secret to every
 * Studio user's bundle.
 */
export async function POST(req) {
  const secret = process.env.INVOICE_RETRY_SECRET;
  if (!secret) {
    return Response.json({ error: "INVOICE_RETRY_SECRET is not configured." }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isGatewayConfigured()) {
    return Response.json({ error: "Compliance Gateway is not configured." }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const { orderId, all } = body ?? {};

  if (!orderId && !all) {
    return Response.json({ error: "Provide either orderId or all: true." }, { status: 400 });
  }

  let ids;
  if (orderId) {
    ids = [orderId];
  } else {
    ids = await backendClient.fetch(
      `*[_type == "order" && status == "paid" && invoiceStatus == "failed"]
         | order(orderDate asc)[0...$max]._id`,
      { max: MAX_SWEEP },
    );
  }

  const results = [];
  for (const id of ids) {
    // Sequential on purpose — these are metered, and a burst of parallel
    // submissions against one tenant is exactly what rate limiting will police.
    try {
      const result = await submitInvoiceAndRecord(backendClient, id);
      results.push({ orderId: id, ...result });
    } catch (err) {
      results.push({ orderId: id, status: "failed", error: err.message });
    }
  }

  return Response.json({
    attempted: results.length,
    submitted: results.filter((r) => r.status === "submitted").length,
    results,
  });
}
