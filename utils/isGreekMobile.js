// BoxNow texts the customer their locker code, so a BoxNow order needs a Greek
// mobile number: 69 + 8 digits, optionally prefixed with +30 / 0030 / 30.
// Spaces, dashes, dots and brackets are ignored.
// Used by the checkout form and re-checked in create-payment-intent.
export function isGreekMobile(phone) {
  const compact = String(phone ?? "").replace(/[\s\-().]/g, "");
  return /^(?:\+30|0030|30)?69\d{8}$/.test(compact);
}
