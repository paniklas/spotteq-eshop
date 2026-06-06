import "server-only";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";

function generateOrderNumber() {
  const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SPQ-${ymd}-${rand}`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { items, shippingMethodId, couponId, couponCode, customerInfo } = body;

    // --- Basic validation ---
    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }
    if (!shippingMethodId) {
      return NextResponse.json({ error: "Shipping method is required." }, { status: 400 });
    }
    if (!customerInfo?.email || !customerInfo?.firstName || !customerInfo?.lastName) {
      return NextResponse.json({ error: "Customer information is incomplete." }, { status: 400 });
    }

    const productItems = items.filter((i) => i.type !== "bundle");
    const bundleItems  = items.filter((i) => i.type === "bundle");
    const productIds   = productItems.map((i) => i.id);
    const bundleIds    = bundleItems.map((i) => i.id);

    // --- Fetch server-side prices (never trust client totals) ---
    const [sanityProducts, sanityBundles, shippingMethod, coupon] = await Promise.all([
      productIds.length
        ? backendClient.fetch(
            `*[_type == "product" && _id in $ids && status == true]{ _id, price, salePrice }`,
            { ids: productIds }
          )
        : Promise.resolve([]),
      bundleIds.length
        ? backendClient.fetch(
            `*[_type == "bundle" && _id in $ids && status == true]{ _id, bundlePrice, saleBundlePrice }`,
            { ids: bundleIds }
          )
        : Promise.resolve([]),
      backendClient.fetch(
        `*[_type == "shipping" && _id == $id && isActive == true][0]{ _id, price, freeShippingMinimum }`,
        { id: shippingMethodId }
      ),
      couponId
        ? backendClient.fetch(
            `*[_type == "sale" && _id == $id && isActive == true][0]{
              _id, discountAmount, validFrom, validUntil, maxUses, usedCount
            }`,
            { id: couponId }
          )
        : Promise.resolve(null),
    ]);

    if (!shippingMethod) {
      return NextResponse.json({ error: "Invalid shipping method." }, { status: 400 });
    }

    // --- Build order line items and compute subtotal ---
    const productPriceMap = Object.fromEntries(
      (sanityProducts ?? []).map((p) => [p._id, p.salePrice ?? p.price])
    );
    const bundlePriceMap = Object.fromEntries(
      (sanityBundles ?? []).map((b) => [b._id, b.saleBundlePrice ?? b.bundlePrice])
    );

    let subtotal = 0;
    const orderProducts = [];
    const orderBundles  = [];

    for (const [i, item] of productItems.entries()) {
      const price = productPriceMap[item.id];
      if (!price) {
        return NextResponse.json({ error: "One or more products are no longer available." }, { status: 400 });
      }
      subtotal += price * item.qty;
      orderProducts.push({
        _key: `prod_${item.id}_${i}`,
        product: { _type: "reference", _ref: item.id },
        quantity: item.qty,
        price,
        selectedFlavour: item.selectedFlavour ?? "",
      });
    }

    for (const [i, item] of bundleItems.entries()) {
      const price = bundlePriceMap[item.id];
      if (!price) {
        return NextResponse.json({ error: "One or more bundles are no longer available." }, { status: 400 });
      }
      subtotal += price * item.qty;
      orderBundles.push({
        _key: `bndl_${item.id}_${i}`,
        bundle: { _type: "reference", _ref: item.id },
        quantity: item.qty,
        price,
      });
    }

    // --- Validate coupon server-side ---
    let discountAmount    = 0;
    let validatedCouponId = null;

    if (coupon) {
      const now       = new Date();
      const notStarted = coupon.validFrom  && new Date(coupon.validFrom)  > now;
      const expired    = coupon.validUntil && new Date(coupon.validUntil) < now;
      const maxedOut   = coupon.maxUses != null && (coupon.usedCount ?? 0) >= coupon.maxUses;

      if (!notStarted && !expired && !maxedOut) {
        // discountAmount is stored as a percentage (e.g. 10 = 10%) — match the UI calculation
        discountAmount    = (subtotal * (coupon.discountAmount ?? 0)) / 100;
        validatedCouponId = coupon._id;
      }
    }

    // --- Shipping cost (free if pre-discount subtotal meets threshold — matches UI logic) ---
    const freeThreshold = shippingMethod.freeShippingMinimum;
    const shippingCost =
      freeThreshold != null && freeThreshold > 0 && subtotal >= freeThreshold
        ? 0
        : shippingMethod.price;

    const total        = Math.max(0, subtotal - discountAmount + shippingCost);
    const amountInCents = Math.round(total * 100);

    if (amountInCents < 50) {
      return NextResponse.json({ error: "Order total is below the minimum for payment processing." }, { status: 400 });
    }

    // --- Create or find Stripe customer ---
    let stripeCustomerId;
    const existing = await stripe.customers.list({ email: customerInfo.email, limit: 1 });
    if (existing.data.length > 0) {
      stripeCustomerId = existing.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: customerInfo.email,
        name: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
      });
      stripeCustomerId = customer.id;
    }

    // --- Create Sanity order (pending — PI ID is set in the webhook after payment) ---
    const orderNumber  = generateOrderNumber();
    const customerName = `${customerInfo.firstName} ${customerInfo.lastName}`.trim();

    const sanityOrder = await backendClient.create({
      _type: "order",
      orderNumber,
      stripeCustomerId,
      isGuestCheckout: true,
      customerName,
      email: customerInfo.email,
      products: orderProducts,
      bundles: orderBundles,
      totalPrice:     parseFloat(total.toFixed(2)),
      currency:       "eur",
      amountDiscount: parseFloat(discountAmount.toFixed(2)),
      ...(validatedCouponId && couponCode
        ? {
            appliedCoupon: {
              code: couponCode,
              sale: { _type: "reference", _ref: validatedCouponId },
            },
          }
        : {}),
      shippingMethod:  { _type: "reference", _ref: shippingMethodId },
      shippingAddress: {
        firstName:  customerInfo.firstName,
        lastName:   customerInfo.lastName,
        address:    customerInfo.address    ?? "",
        apartment:  customerInfo.apartment  ?? "",
        city:       customerInfo.city       ?? "",
        postalCode: customerInfo.postalCode ?? "",
        country:    customerInfo.country    ?? "",
        phone:      customerInfo.phone      ?? "",
      },
      status:    "pending",
      orderDate: new Date().toISOString(),
    });

    // --- Create Stripe Payment Intent ---
    // orderId in metadata lets the webhook find and update this order
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   amountInCents,
      currency: "eur",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      metadata: {
        orderNumber,
        orderId:     sanityOrder._id,
        couponId:    validatedCouponId ?? "",
        couponEmail: customerInfo.email,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderNumber,
    });
  } catch (err) {
    console.error("[create-payment-intent]", err);
    return NextResponse.json({ error: "Failed to initialise payment." }, { status: 500 });
  }
}
