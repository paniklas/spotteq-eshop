// Bundle flavour tamper rejection (manual script, not part of the Playwright suite).
//
// POSTs forged payloads to /api/create-payment-intent and asserts each is rejected
// with 400 "Invalid bundle flavour selection." These cases fail validation mid-loop,
// BEFORE any Stripe customer / Sanity order / Payment Intent is created — so running
// this leaves no test data behind.
//
// Requires the dev server running (pnpm dev). Usage:
//   node tests/d2-bundle-flavour-tamper.mjs
//   BASE_URL=http://localhost:3001 node tests/d2-bundle-flavour-tamper.mjs
//
// The ids below are for the "Strength & Growth" bundle in the production dataset
// (slot 0 unlocked, slot 1 locked). Update them if that bundle changes.

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const URL = `${BASE}/api/create-payment-intent`;

const BUNDLE = "01f65598-6729-406e-b413-a7c0bcbfe758"; // "Strength & Growth"
const SHIPPING = "0d62199c-5a4d-4df2-a388-c008541bdd1a"; // active standard method

const SLOT0_DEFAULT = "c259da09-c452-4207-bef2-bffacd5cad03"; // unlocked; allowed: this + 112aa019 + 630c43f5
const SLOT0_VARIANT = "112aa019-90de-42e1-87c7-9d993fa47811"; // a legal flavour of slot 0
const SLOT1_DEFAULT = "7b1f0792-8d59-4973-bef9-9e1b88de2664"; // LOCKED
const FOREIGN = "eae635e0-0bce-4cb6-bde0-97c0c85d4ced"; // a real product, not a flavour of either slot

const base = (selectedFlavours) => ({
  items: [{ id: BUNDLE, type: "bundle", qty: 1, selectedFlavours }],
  shippingMethodId: SHIPPING,
  couponId: null,
  couponCode: null,
  boxNowLockerId: null,
  boxNowLockerName: null,
  boxNowLockerAddress: null,
  customerInfo: { email: "tamper-test@example.com", firstName: "Tamper", lastName: "Test" },
});

const slot = (slotProductId, variantId) => ({ slotProductId, variantId, quantity: 1 });

const cases = [
  {
    name: "locked slot swapped to a non-default variant",
    body: base([slot(SLOT0_DEFAULT, SLOT0_DEFAULT), slot(SLOT1_DEFAULT, SLOT0_VARIANT)]),
    expect: 400,
  },
  {
    name: "unlocked slot given a variant that is not one of its flavours",
    body: base([slot(SLOT0_DEFAULT, FOREIGN), slot(SLOT1_DEFAULT, SLOT1_DEFAULT)]),
    expect: 400,
  },
  {
    name: "slotProductId does not match the slot's default (misalignment)",
    body: base([slot(FOREIGN, SLOT0_DEFAULT), slot(SLOT1_DEFAULT, SLOT1_DEFAULT)]),
    expect: 400,
  },
  {
    name: "wrong number of slots (1 sent, bundle has 2)",
    body: base([slot(SLOT0_DEFAULT, SLOT0_DEFAULT)]),
    expect: 400,
  },
];

let pass = 0;
for (const c of cases) {
  let status, json;
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(c.body),
    });
    status = res.status;
    json = await res.json().catch(() => ({}));
  } catch (err) {
    console.log(`✗ ${c.name}\n    request failed: ${err.message} (is the dev server up at ${BASE}?)`);
    continue;
  }
  const ok = status === c.expect;
  if (ok) pass++;
  console.log(
    `${ok ? "✓" : "✗"} ${c.name}\n    -> ${status} ${JSON.stringify(json)}${ok ? "" : `  (expected ${c.expect})`}`
  );
}

console.log(`\n${pass}/${cases.length} tamper cases rejected as expected.`);
process.exit(pass === cases.length ? 0 : 1);
