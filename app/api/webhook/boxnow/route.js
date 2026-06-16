import "server-only";
import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { backendClient } from "@/sanity/lib/backendClient";

export const runtime = "nodejs";

const EVENT_TO_STATUS = {
  "final-destination": "shipped",
  delivered:           "delivered",
  canceled:            "cancelled",
};

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  // Verify HMAC-SHA256 datasignature
  const secret = process.env.BOXNOW_WEBHOOK_SECRET;
  if (secret) {
    const received = body.datasignature ?? "";
    const expected = createHmac("sha256", secret)
      .update(JSON.stringify(body.data ?? {}))
      .digest("hex");

    if (received !== expected) {
      console.error("[boxnow-webhook] Invalid datasignature");
      return new NextResponse("Unauthorized", { status: 401 });
    }
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
