import "server-only";
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { backendClient } from "@/sanity/lib/backendClient";

export const runtime = "nodejs";

// BoxNow parcel event -> our order status. Forward-progress events mark the order
// shipped, a successful pickup delivered, and terminal-failure events cancelled.
// Ambiguous events (new, missing, lost, accepted-for-return) only update the
// parcel-status label and leave the order status for an admin to decide.
const EVENT_TO_STATUS = {
  "in-depot":            "shipped",
  "accepted-to-locker":  "shipped",
  "final-destination":   "shipped",
  delivered:             "delivered",
  canceled:              "cancelled",
  returned:              "cancelled",
  expired:               "cancelled",
};

// BoxNow signs the HMAC over the RAW bytes of the `data` object. Re-serializing
// the parsed object can reorder keys or change whitespace and break verification
// (the BoxNow guide warns against this), so isolate the exact `data` object
// substring from the raw payload. Brace-matched, string/escape aware.
function extractRawDataObject(raw) {
  const keyIdx = raw.indexOf('"data"');
  if (keyIdx === -1) return null;
  const start = raw.indexOf("{", keyIdx);
  if (start === -1) return null;
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < raw.length; i++) {
    const ch = raw[i];
    if (esc) { esc = false; continue; }
    if (ch === "\\") { esc = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === "{") depth++;
    else if (ch === "}" && --depth === 0) return raw.slice(start, i + 1);
  }
  return null;
}

export async function POST(req) {
  const raw = await req.text();
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  // Verify HMAC-SHA256 datasignature
  const secret = process.env.BOXNOW_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[boxnow-webhook] BOXNOW_WEBHOOK_SECRET is not set — rejecting request");
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  const rawData = extractRawDataObject(raw);
  if (!rawData) {
    console.error("[boxnow-webhook] Could not isolate raw data object for signature check");
    return new NextResponse("Bad Request", { status: 400 });
  }

  const received = body.datasignature ?? "";
  // Validate the shape first: a SHA-256 hex digest is exactly 64 hex chars. This
  // rejects malformed signatures early and guarantees both buffers are 32 bytes
  // so timingSafeEqual can't throw on a length mismatch.
  if (!/^[0-9a-fA-F]{64}$/.test(received)) {
    console.error("[boxnow-webhook] Malformed datasignature");
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Compare the decoded 32-byte digests, not the hex strings — decoding via hex
  // normalizes case, so an uppercase signature from BoxNow still verifies.
  const expected = createHmac("sha256", secret).update(rawData).digest();
  const sigValid = timingSafeEqual(Buffer.from(received, "hex"), expected);

  if (!sigValid) {
    console.error("[boxnow-webhook] Invalid datasignature");
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { parcelId, event } = body.data ?? {};

  if (!parcelId || !event) {
    return NextResponse.json({ ok: true });
  }

  const order = await backendClient.fetch(
    `*[_type == "order" && boxNowParcelId == $parcelId][0]{ _id, status }`,
    { parcelId }
  );

  if (!order) {
    return NextResponse.json({ ok: true });
  }

  const patch = backendClient.patch(order._id).set({ boxNowParcelStatus: event });
  const newStatus = EVENT_TO_STATUS[event];
  if (newStatus && newStatus !== order.status) {
    patch.set({ status: newStatus });
  }

  try {
    await patch.commit();
  } catch (err) {
    console.error("[boxnow-webhook] Failed to update order", order._id, err);
    return new NextResponse("Internal error", { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
