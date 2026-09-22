/**
 * What a shipping method actually costs for a given cart subtotal.
 *
 * Free shipping is configured per method in Sanity (`shipping.freeShippingMinimum`).
 * An empty or zero threshold means the method never offers free shipping. The
 * comparison uses the PRE-discount subtotal, matching the server-side rule in
 * app/api/create-payment-intent/route.js — the amount actually charged.
 */
export const effectiveShippingCost = (method, subTotal) => {
    if (!method) return 0
    const threshold = method.freeShippingMinimum ?? 0
    const price = method.price ?? 0
    return threshold > 0 && subTotal >= threshold ? 0 : price
}
