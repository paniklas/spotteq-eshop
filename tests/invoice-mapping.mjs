// Order → invoice mapping arithmetic (manual script, not part of the Playwright suite).
//
// Pure — no dev server, no network, no Sanity. Usage:
//   node tests/invoice-mapping.mjs
//
// What it pins is the money: that the lines the gateway will price up always add
// back to the total Stripe actually charged. The gateway prices a retail line as
// `quantity * unitPrice - discount` with unitPrice GROSS, so these expectations
// mirror that formula rather than re-deriving VAT.

import { buildInvoicePayload, localizedValue } from "../lib/invoice-mapping.js";

let failures = 0;
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

function check(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failures += 1;
    console.error(`  ✗ ${name}\n      ${err.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function assertEq(actual, expected, what) {
  if (actual !== expected) throw new Error(`${what}: expected ${expected}, got ${actual}`);
}

/** What the gateway will compute for the document total, from our lines. */
function gatewayTotal(payload) {
  return round2(
    payload.lines.reduce(
      (s, l) => s + round2(l.quantity * l.unitPrice) - (l.discount ?? 0),
      0,
    ),
  );
}

const el = (v) => [{ _key: "el", value: v }];

const order = (over = {}) => ({
  _id: "order-1",
  orderNumber: "SPQ-1001",
  orderDate: "2026-08-06T10:00:00.000Z",
  email: "buyer@example.com",
  customerName: "Γιώργος Παπάς",
  currency: "eur",
  amountDiscount: 0,
  shippingCost: 0,
  billingAddress: { firstName: "Γιώργος", lastName: "Παπάς", address: "Ερμού 12", city: "Αθήνα", postalCode: "10563", country: "GR" },
  shippingName: el("Κούριερ"),
  products: [{ quantity: 2, price: 10, title: el("Πρωτεΐνη"), sku: "PRO-1" }],
  bundles: [],
  totalPrice: 20,
  ...over,
});

console.log("localizedValue");

check("prefers the Greek entry, keyed by _key", () => {
  assertEq(localizedValue([{ _key: "en", value: "Protein" }, { _key: "el", value: "Πρωτεΐνη" }]), "Πρωτεΐνη", "value");
});

check("also accepts the `language` key some schemas here use", () => {
  assertEq(localizedValue([{ language: "el", value: "Πρωτεΐνη" }]), "Πρωτεΐνη", "value");
});

check("falls back to the first entry rather than an empty description", () => {
  assertEq(localizedValue([{ _key: "de", value: "Protein" }]), "Protein", "value");
});

console.log("\nbuildInvoicePayload — document shape");

check("retail ΑΠΥ with ESHOP payment and 24% NORMAL VAT", () => {
  const p = buildInvoicePayload(order());
  assertEq(p.isRetail, true, "isRetail");
  assertEq(p.vatCategory, "NORMAL", "vatCategory");
  assertEq(p.paymentMethod, "ESHOP", "paymentMethod");
  assertEq(p.currency, "EUR", "currency");
  assertEq(p.clientReference, "SPQ-1001", "clientReference");
  assertEq(p.lines[0].vatPercent, 24, "vatPercent");
});

check("the shelf price maps across GROSS — never divided by 1.24", () => {
  const p = buildInvoicePayload(order());
  assertEq(p.lines[0].unitPrice, 10, "unitPrice");
  assertEq(gatewayTotal(p), 20, "document total");
});

check("customer name comes from the billing address, falling back to the order", () => {
  assertEq(buildInvoicePayload(order()).customer.name, "Γιώργος Παπάς", "name");
  const p = buildInvoicePayload(order({ billingAddress: {}, customerName: "Walk-in" }));
  assertEq(p.customer.name, "Walk-in", "fallback name");
});

console.log("\nbuildInvoicePayload — shipping");

check("shipping becomes its own line (extraCharges is dead on the gateway)", () => {
  const p = buildInvoicePayload(order({ shippingCost: 3.5, totalPrice: 23.5 }));
  assertEq(p.lines.length, 2, "line count");
  assertEq(p.lines[1].description, "Κούριερ", "shipping description");
  assertEq(p.lines[1].unitPrice, 3.5, "shipping unitPrice");
  assertEq(gatewayTotal(p), 23.5, "document total");
});

check("free shipping adds no line at all", () => {
  const p = buildInvoicePayload(order({ shippingCost: 0 }));
  assertEq(p.lines.length, 1, "line count");
});

console.log("\nbuildInvoicePayload — discount");

check("an order-level discount is spread across the goods lines", () => {
  const p = buildInvoicePayload(
    order({
      products: [
        { quantity: 1, price: 30, title: el("A") },
        { quantity: 1, price: 70, title: el("B") },
      ],
      amountDiscount: 10, // 10% of a 100 subtotal
      totalPrice: 90,
    }),
  );
  assertEq(p.lines[0].discount, 3, "line A discount");
  assertEq(p.lines[1].discount, 7, "line B discount");
  assertEq(gatewayTotal(p), 90, "document total");
});

check("shipping is never discounted — the coupon applies before it", () => {
  const p = buildInvoicePayload(
    order({ amountDiscount: 2, shippingCost: 4, totalPrice: 22 }),
  );
  const shippingLine = p.lines[p.lines.length - 1];
  assert(shippingLine.discount === undefined, "shipping line carried a discount");
  assertEq(gatewayTotal(p), 22, "document total");
});

check("the rounding residue lands on the largest line, so the total still reconciles", () => {
  // 10% of 33.33 = 3.333 → per-line rounding cannot sum to 3.33 on its own.
  const p = buildInvoicePayload(
    order({
      products: [
        { quantity: 1, price: 11.11, title: el("A") },
        { quantity: 1, price: 11.11, title: el("B") },
        { quantity: 1, price: 11.11, title: el("C") },
      ],
      amountDiscount: 3.33,
      totalPrice: 30,
    }),
  );
  const summed = round2(p.lines.reduce((s, l) => s + (l.discount ?? 0), 0));
  assertEq(summed, 3.33, "discounts must sum to amountDiscount");
  assertEq(gatewayTotal(p), 30, "document total");
});

console.log("\nbuildInvoicePayload — bundles");

check("a bundle is one line, priced as charged", () => {
  const p = buildInvoicePayload(
    order({
      products: [],
      bundles: [{ quantity: 2, price: 45, title: el("Πακέτο Όγκου") }],
      totalPrice: 90,
    }),
  );
  assertEq(p.lines.length, 1, "line count");
  assertEq(p.lines[0].description, "Πακέτο Όγκου (πακέτο)", "description");
  assertEq(p.lines[0].quantity, 2, "quantity");
  assertEq(gatewayTotal(p), 90, "document total");
});

check("a product flavour is named on the line", () => {
  const p = buildInvoicePayload(
    order({ products: [{ quantity: 1, price: 20, title: el("Πρωτεΐνη"), selectedFlavour: el("Σοκολάτα") }], totalPrice: 20 }),
  );
  assertEq(p.lines[0].description, "Πρωτεΐνη – Σοκολάτα", "description");
});

console.log("\nbuildInvoicePayload — refusals");

check("refuses to file a document that disagrees with what was charged", () => {
  let threw = false;
  try {
    buildInvoicePayload(order({ totalPrice: 999 }));
  } catch (err) {
    threw = true;
    assert(/does not match charged total/.test(err.message), `unexpected message: ${err.message}`);
  }
  assert(threw, "a mismatched total was accepted");
});

check("refuses an order with no lines", () => {
  let threw = false;
  try {
    buildInvoicePayload(order({ products: [], bundles: [], totalPrice: 0 }));
  } catch {
    threw = true;
  }
  assert(threw, "an empty order was accepted");
});

check("refuses a discount larger than the subtotal", () => {
  let threw = false;
  try {
    buildInvoicePayload(order({ amountDiscount: 50, totalPrice: -30 }));
  } catch (err) {
    threw = true;
    assert(/exceeds subtotal/.test(err.message), `unexpected message: ${err.message}`);
  }
  assert(threw, "an over-large discount was accepted");
});

console.log(failures ? `\n${failures} FAILED` : "\nAll passed.");
process.exit(failures ? 1 : 0);
