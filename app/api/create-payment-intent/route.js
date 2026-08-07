import "server-only";
import { randomBytes } from "crypto";
import { z } from "zod";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";

// Points at the pending order + PI this browser most recently started, so a
// Back → Continue cycle updates that order instead of creating another one.
const PENDING_CHECKOUT_COOKIE = "pending_checkout";

function generateOrderNumber() {
  const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SPQ-${ymd}-${rand}`;
}

// Secret required (alongside the guessable orderNumber) to view the order on
// the checkout success page — prevents PII exposure via order number enumeration.
function generateViewToken() {
  return randomBytes(24).toString("base64url");
}

const bundleFlavourSchema = z.object({
  slotProductId: z.string().min(1),
  variantId: z.string().min(1),
  flavourName: z.string().optional(),
  quantity: z.number().int().min(1).max(99).optional(),
});

const cartItemSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["product", "bundle"]).optional(),
  qty: z.number().int().min(1).max(99),
  selectedFlavour: z.string().optional(),
  selectedFlavours: z.array(bundleFlavourSchema).max(20).optional(),
});

const bodySchema = z.object({
  items: z.array(cartItemSchema).min(1).max(50),
  shippingMethodId: z.string().min(1),
  couponId: z.string().optional().nullable(),
  couponCode: z.string().optional().nullable(),
  customerInfo: z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address: z.string().optional(),
    apartment: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    phone: z.string().optional(),
    billingInfo: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        company: z.string().optional(),
        address: z.string().optional(),
        apartment: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        phone: z.string().optional(),
      })
      .optional(),
  }),
  boxNowLockerId: z.string().optional().nullable(),
  boxNowLockerName: z.string().optional().nullable(),
  boxNowLockerAddress: z.string().optional().nullable(),
});

export async function POST(req) {
  try {
    const rawBody = await req.json();
    const parsed = bodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
    }

    const {
      items,
      shippingMethodId,
      couponId,
      couponCode,
      customerInfo,
      boxNowLockerId,
      boxNowLockerName,
      boxNowLockerAddress,
    } = parsed.data;

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
            `*[_type == "bundle" && _id in $ids && status == true]{
              _id, bundlePrice, saleBundlePrice,
              products[]{
                quantity,
                allowFlavourChange,
                "defaultId": product->_id,
                "variants": product->flavours[]->{ _id, "active": status }
              }
            }`,
            { ids: bundleIds }
          )
        : Promise.resolve([]),
      backendClient.fetch(
        `*[_type == "shipping" && _id == $id && isActive == true][0]{ _id, price, freeShippingMinimum, provider }`,
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
    if (shippingMethod.provider === "boxnow" && !boxNowLockerId) {
      return NextResponse.json({ error: "Please select a BoxNow locker." }, { status: 400 });
    }

    // --- Build order line items and compute subtotal ---
    const productPriceMap = Object.fromEntries(
      (sanityProducts ?? []).map((p) => [p._id, p.salePrice ?? p.price])
    );
    const bundlePriceMap = Object.fromEntries(
      (sanityBundles ?? []).map((b) => [b._id, b.saleBundlePrice ?? b.bundlePrice])
    );
    const bundleSlotsMap = Object.fromEntries(
      (sanityBundles ?? []).map((b) => [b._id, b.products ?? []])
    );

    let subtotal = 0;
    const orderProducts = [];
    const orderBundles  = [];

    // Total quantity demanded per product id (incl. bundle constituents/variants),
    // used for the server-side stock check below. Mirrors the webhook decrement.
    const demand = {};
    const addDemand = (id, qty) => { if (id) demand[id] = (demand[id] ?? 0) + qty; };

    for (const [i, item] of productItems.entries()) {
      const price = productPriceMap[item.id];
      if (!price) {
        return NextResponse.json({ error: "One or more products are no longer available." }, { status: 400 });
      }
      subtotal += price * item.qty;
      addDemand(item.id, item.qty);
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

      // Validate the customer's flavour choice against the bundle's real slots.
      // Never trust the client: a locked slot must keep its default, and an unlocked
      // slot may only take one of that slot's active variants. Quantity comes from
      // the bundle, not the client. Empty selection = bundle defaults (quick-add/legacy).
      const slots = bundleSlotsMap[item.id] ?? [];
      const clientSel = item.selectedFlavours ?? [];
      let selectedFlavours = null;

      if (clientSel.length) {
        if (clientSel.length !== slots.length) {
          return NextResponse.json({ error: "Invalid bundle flavour selection." }, { status: 400 });
        }
        selectedFlavours = [];
        for (let s = 0; s < slots.length; s++) {
          const slot = slots[s];
          const entry = clientSel[s];
          if (!slot?.defaultId || entry.slotProductId !== slot.defaultId) {
            return NextResponse.json({ error: "Invalid bundle flavour selection." }, { status: 400 });
          }
          const activeVariantIds = (slot.variants ?? [])
            .filter((v) => v?.active !== false)
            .map((v) => v._id);
          const allowed = slot.allowFlavourChange
            ? new Set([slot.defaultId, ...activeVariantIds])
            : new Set([slot.defaultId]);
          if (!allowed.has(entry.variantId)) {
            return NextResponse.json({ error: "Invalid bundle flavour selection." }, { status: 400 });
          }
          addDemand(entry.variantId, item.qty * (slot.quantity ?? 1));
          selectedFlavours.push({
            _key: `bf_${i}_${s}`,
            variant: { _type: "reference", _ref: entry.variantId },
            flavourName: entry.flavourName ?? "",
            quantity: slot.quantity ?? 1,
          });
        }
      } else {
        // No explicit selection = bundle defaults; demand falls on each slot's default.
        for (const slot of slots) addDemand(slot.defaultId, item.qty * (slot.quantity ?? 1));
      }

      orderBundles.push({
        _key: `bndl_${item.id}_${i}`,
        bundle: { _type: "reference", _ref: item.id },
        quantity: item.qty,
        price,
        ...(selectedFlavours ? { selectedFlavours } : {}),
      });
    }

    // --- Server-side stock check (H5) ---
    // The client validates inventory at form submit, but nothing stops a stale tab,
    // a direct API call, or two buyers of the last unit from reaching here. Re-check
    // against live inventory before creating the order/PI. Not a hard reservation
    // (stock is only decremented on the paid webhook), but it shrinks the oversell
    // window to the seconds between this check and payment confirmation.
    const demandIds = Object.keys(demand);
    if (demandIds.length) {
      const stock = await backendClient.fetch(
        `*[_type == "product" && _id in $ids]{ _id, inventory }`,
        { ids: demandIds }
      );
      const invById = Object.fromEntries((stock ?? []).map((p) => [p._id, p.inventory]));
      // inventory null = unlimited; a demanded id missing from stock is already
      // guarded upstream (price map for products, variant validation for bundles).
      const outOfStock = demandIds.some((id) => {
        const inv = invById[id];
        return inv != null && demand[id] > inv;
      });
      if (outOfStock) {
        return NextResponse.json(
          { error: "Some items just went out of stock. Please review your bag and try again." },
          { status: 409 }
        );
      }
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

    // --- Link the order to a signed-in user's profile (guests stay guest) ---
    const { userId } = await auth();
    let userInfoRef = null;
    if (userId) {
      const userInfo = await backendClient.fetch(
        `*[_type == "userInfo" && userId == $userId][0]{ _id }`,
        { userId }
      );
      if (userInfo?._id) userInfoRef = userInfo._id;
    }

    const cookieStore = await cookies();

    // --- Reuse the order this browser already started, if any ---
    // Going Back from the payment step unmounts the payment component, so a second
    // "Continue to Payment" would otherwise create a fresh order + PI every cycle.
    // The pending checkout is tracked in an httpOnly cookie rather than on the order
    // document: it keeps reuse scoped to this browser (an order must never be handed
    // to a different visitor who happens to type the same email) and it carries the
    // previous PI id, which the order does not store until the webhook fires.
    //
    // The cookie is treated as untrusted input — httpOnly stops scripts, not the
    // person holding the devtools. It must therefore prove which order it names, so
    // it carries the order's viewToken and the query matches on it. Otherwise anyone
    // who learned an order _id could steer this endpoint at someone else's checkout.
    const [pendingOrderId, pendingIntentId, pendingViewToken] =
      (cookieStore.get(PENDING_CHECKOUT_COOKIE)?.value ?? "").split("|");

    let reusableOrder = null;
    if (pendingOrderId && pendingViewToken) {
      reusableOrder = await backendClient.fetch(
        `*[_type == "order" && _id == $id && viewToken == $viewToken
           && status == "pending" && !defined(stripePaymentIntentId)][0]{
          _id, orderNumber, viewToken
        }`,
        { id: pendingOrderId, viewToken: pendingViewToken }
      );
    }

    // The order alone cannot tell us whether payment is already in flight: it stays
    // "pending" with no PI id until the webhook lands. Ask Stripe directly, so a
    // customer who paid and then hit Back never has their paid order overwritten.
    // Otherwise cancel the superseded PI, so only one live intent targets the order.
    if (reusableOrder && pendingIntentId) {
      try {
        const previousIntent = await stripe.paymentIntents.retrieve(pendingIntentId);

        // The intent id also comes from the cookie, so confirm Stripe agrees it
        // belongs to this order before cancelling it. Without this, a tampered
        // cookie could cancel another customer's in-flight Payment Intent.
        if (previousIntent.metadata?.orderId !== reusableOrder._id) {
          console.warn("[create-payment-intent] intent/order mismatch — refusing to cancel");
          reusableOrder = null;
        } else if (["succeeded", "processing", "requires_capture"].includes(previousIntent.status)) {
          reusableOrder = null;
        } else if (previousIntent.status !== "canceled") {
          await stripe.paymentIntents.cancel(pendingIntentId);
        }
      } catch (err) {
        // Unknown PI state — fall back to a fresh order rather than risk clobbering.
        const reason = err instanceof Error ? err.message : String(err);
        console.warn("[create-payment-intent] superseded PI check failed:", reason);
        reusableOrder = null;
      }
    }

    // --- Create or update the Sanity order (pending — PI ID is set in the webhook) ---
    const orderNumber  = reusableOrder?.orderNumber ?? generateOrderNumber();
    const viewToken    = reusableOrder?.viewToken   ?? generateViewToken();
    const customerName = `${customerInfo.firstName} ${customerInfo.lastName}`.trim();

    const appliedCoupon = validatedCouponId && couponCode
      ? { code: couponCode, sale: { _type: "reference", _ref: validatedCouponId } }
      : null;

    const orderFields = {
      stripeCustomerId,
      isGuestCheckout: !userInfoRef,
      customerName,
      email: customerInfo.email,
      products: orderProducts,
      bundles: orderBundles,
      totalPrice:     parseFloat(total.toFixed(2)),
      currency:       "eur",
      amountDiscount: parseFloat(discountAmount.toFixed(2)),
      // Persisted because the invoice needs the exact amount charged for shipping.
      // It is not recoverable from shippingMethod->price alone: the free-shipping
      // threshold may have zeroed it.
      shippingCost:   parseFloat(shippingCost.toFixed(2)),
      shippingMethod: { _type: "reference", _ref: shippingMethodId },
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
      // Billing address for invoicing. Falls back to the shipping fields when the
      // client didn't send a separate billing block (older clients / safety).
      billingAddress: {
        firstName:  customerInfo.billingInfo?.firstName  ?? customerInfo.firstName,
        lastName:   customerInfo.billingInfo?.lastName   ?? customerInfo.lastName,
        company:    customerInfo.billingInfo?.company    ?? "",
        address:    customerInfo.billingInfo?.address    ?? customerInfo.address    ?? "",
        apartment:  customerInfo.billingInfo?.apartment  ?? customerInfo.apartment  ?? "",
        city:       customerInfo.billingInfo?.city       ?? customerInfo.city       ?? "",
        postalCode: customerInfo.billingInfo?.postalCode ?? customerInfo.postalCode ?? "",
        country:    customerInfo.billingInfo?.country    ?? customerInfo.country    ?? "",
        phone:      customerInfo.billingInfo?.phone      ?? customerInfo.phone      ?? "",
      },
      status:    "pending",
      orderDate: new Date().toISOString(),
      ...(userInfoRef ? { userInfo: { _type: "reference", _ref: userInfoRef } } : {}),
      ...(appliedCoupon ? { appliedCoupon } : {}),
      ...(boxNowLockerId ? {
        boxNowLockerId,
        boxNowLockerName:    boxNowLockerName    ?? "",
        boxNowLockerAddress: boxNowLockerAddress ?? "",
      } : {}),
    };

    let sanityOrder;
    if (reusableOrder) {
      // Optional fields must be explicitly unset — a retry that drops the coupon or
      // switches away from BoxNow would otherwise keep the previous attempt's values.
      const staleFields = [
        ...(userInfoRef     ? [] : ["userInfo"]),
        ...(appliedCoupon   ? [] : ["appliedCoupon"]),
        ...(boxNowLockerId  ? [] : ["boxNowLockerId", "boxNowLockerName", "boxNowLockerAddress"]),
      ];
      sanityOrder = await backendClient
        .patch(reusableOrder._id)
        .set(orderFields)
        .unset(staleFields)
        .commit();
    } else {
      sanityOrder = await backendClient.create({
        _type: "order",
        orderNumber,
        viewToken,
        ...orderFields,
      });
    }

    // --- Create Stripe Payment Intent ---
    // orderId in metadata lets the webhook find and update this order
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   amountInCents,
      currency: "eur",
      customer: stripeCustomerId,
      // Card only — Apple Pay / Google Pay are wallets on top of "card" and
      // are surfaced automatically by the Payment Element, not separate types.
      payment_method_types: ["card"],
      metadata: {
        orderNumber,
        orderId:     sanityOrder._id,
        couponId:    validatedCouponId ?? "",
        couponEmail: customerInfo.email,
      },
    });

    // Order-scoped, httpOnly cookie — proves the browser that started this checkout
    // is the one viewing the success page, without putting the secret in the URL
    // (URLs leak via referrer headers, browser history, and screenshots).
    cookieStore.set(`order_token_${orderNumber}`, viewToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      path:     "/",
      maxAge:   60 * 60 * 24 * 7, // 7 days
    });

    cookieStore.set(PENDING_CHECKOUT_COOKIE, `${sanityOrder._id}|${paymentIntent.id}|${viewToken}`, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      path:     "/",
      maxAge:   60 * 60, // 1h — a stale pointer just means a new order is created
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
