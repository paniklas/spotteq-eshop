/**
 * Sanity order → Compliance Gateway invoice payload.
 *
 * Pure and side-effect free so the money arithmetic can be unit-tested without a
 * network or a Sanity client. The gateway call itself lives in
 * `lib/compliance-gateway.js`.
 *
 * Decisions encoded here (see the gateway's docs/PROJECT-STATUS.md thread 1f):
 *
 * - **Retail ΑΠΥ only.** `isRetail: true`, which means the gateway reads
 *   `unitPrice` as GROSS (VAT-inclusive). A Greek shelf price already is, so
 *   Sanity's `price` maps straight across — it must NOT be divided by 1.24.
 *   B2B τιμολόγιο needs an ΑΦΜ the order document does not carry.
 * - **Shipping is a LINE, never `extraCharges`.** The gateway declares
 *   `extraCharges` on both its interface and its DTO and its Elorus adapter
 *   never reads it, so anything sent there is silently dropped and the filed
 *   document would understate what the customer was charged.
 * - **The coupon discount is spread pro-rata across the lines.** It is stored
 *   order-level (`amountDiscount`) while the gateway's `discount` is per line.
 *   The coupon is always a percentage of subtotal applied before shipping, so a
 *   uniform per-line rate reproduces it exactly; the rounding residue is pushed
 *   onto the largest line so the document total reconciles to the cent.
 * - **A bundle is one line**, priced as charged. Exploding it into components
 *   would require inventing per-component prices that exist nowhere in the order.
 */

/** Every product spotteq sells is standard-rated. No VAT field exists in Sanity. */
export const INVOICE_VAT_PERCENT = 24;

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Pull one language out of an internationalizedArray. Sanity keys these by
 * `_key`, but some of this project's schemas use `language`, so accept both
 * rather than silently returning an empty description on a tax document.
 */
export function localizedValue(field, lang = "el") {
  if (typeof field === "string") return field;
  if (!Array.isArray(field)) return "";
  const match =
    field.find((e) => e?._key === lang) ?? field.find((e) => e?.language === lang);
  return (match ?? field[0])?.value ?? "";
}

/** "Παυσίπονο" + "Λεμόνι" → "Παυσίπονο – Λεμόνι". */
function withFlavour(title, flavour) {
  const f = localizedValue(flavour);
  return f ? `${title} – ${f}` : title;
}

/**
 * Build the CreateInvoiceDto body for an order.
 *
 * @throws {Error} when the lines cannot be reconciled to `order.totalPrice`.
 *   Filing a document that disagrees with the money actually taken is worse
 *   than not filing one — a mismatch must surface as a visible failure.
 */
export function buildInvoicePayload(order) {
  if (!order) throw new Error("buildInvoicePayload: no order");

  const products = order.products ?? [];
  const bundles = order.bundles ?? [];

  // --- Goods lines (pre-discount) ---
  const goods = [
    ...products.map((p) => ({
      description: withFlavour(localizedValue(p.title), p.selectedFlavour),
      productCode: p.sku || undefined,
      quantity: p.quantity,
      unitPrice: p.price,
      gross: round2(p.price * p.quantity),
    })),
    ...bundles.map((b) => ({
      description: `${localizedValue(b.title)} (πακέτο)`,
      productCode: b.sku || undefined,
      quantity: b.quantity,
      unitPrice: b.price,
      gross: round2(b.price * b.quantity),
    })),
  ];

  if (!goods.length) {
    throw new Error(`Order ${order.orderNumber}: no products or bundles to invoice`);
  }

  const subtotal = round2(goods.reduce((s, l) => s + l.gross, 0));
  const discount = round2(order.amountDiscount ?? 0);
  const shipping = round2(order.shippingCost ?? 0);

  // --- Spread the order-level discount across the goods lines ---
  // Shipping is deliberately excluded: the coupon is applied to subtotal before
  // shipping is added, so discounting the shipping line would over-credit.
  if (discount > subtotal + 0.005) {
    throw new Error(
      `Order ${order.orderNumber}: discount ${discount} exceeds subtotal ${subtotal}`,
    );
  }

  const rate = subtotal > 0 ? discount / subtotal : 0;
  const discounts = goods.map((l) => round2(l.gross * rate));

  // Push the residue onto the largest line, which is guaranteed to absorb it.
  const residue = round2(discount - discounts.reduce((s, d) => s + d, 0));
  if (residue !== 0) {
    let biggest = 0;
    for (let i = 1; i < goods.length; i += 1) {
      if (goods[i].gross > goods[biggest].gross) biggest = i;
    }
    discounts[biggest] = round2(discounts[biggest] + residue);
  }

  const lines = goods.map((l, i) => ({
    description: l.description,
    ...(l.productCode ? { productCode: l.productCode } : {}),
    quantity: l.quantity,
    unitPrice: l.unitPrice,
    vatPercent: INVOICE_VAT_PERCENT,
    ...(discounts[i] ? { discount: discounts[i] } : {}),
  }));

  if (shipping > 0) {
    lines.push({
      description: localizedValue(order.shippingName) || "Μεταφορικά",
      quantity: 1,
      unitPrice: shipping,
      vatPercent: INVOICE_VAT_PERCENT,
    });
  }

  // --- Reconcile against what Stripe actually charged ---
  // The gateway computes each retail line as qty * unitPrice - discount, so this
  // mirrors its arithmetic rather than trusting the order's own total blindly.
  const invoiceTotal = round2(
    goods.reduce((s, l, i) => s + l.gross - discounts[i], 0) + shipping,
  );
  if (Math.abs(invoiceTotal - round2(order.totalPrice)) > 0.01) {
    throw new Error(
      `Order ${order.orderNumber}: invoice total ${invoiceTotal} does not match ` +
        `charged total ${order.totalPrice} (subtotal ${subtotal}, discount ${discount}, shipping ${shipping})`,
    );
  }

  const billing = order.billingAddress ?? {};
  const name =
    [billing.firstName, billing.lastName].filter(Boolean).join(" ").trim() ||
    order.customerName ||
    order.email;

  return {
    clientReference: order.orderNumber,
    issueDate: order.orderDate ?? new Date().toISOString(),
    isRetail: true,
    vatCategory: "NORMAL",
    paymentMethod: "ESHOP",
    currency: (order.currency ?? "eur").toUpperCase(),
    customer: {
      name,
      email: order.email,
      phone: billing.phone || undefined,
      // The order stores one free-text address line; the gateway rejoins
      // street + streetNumber, so passing the whole line as `street` is correct.
      street: [billing.address, billing.apartment].filter(Boolean).join(", ") || undefined,
      city: billing.city || undefined,
      postalCode: billing.postalCode || undefined,
      country: billing.country || "GR",
    },
    lines,
  };
}
