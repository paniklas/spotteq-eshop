import "server-only";
import { defineQuery } from "next-sanity";
import { backendClient } from "../lib/backendClient";
import { catalogFetch } from "../lib/catalogFetch";

const PROMO_QUERY = `*[_type == "firstOrderPromo"][0]{ isActive, discountPercent }`;

// Shared shape check: an absent, inactive or nonsensical promo means "no discount".
function toPercent(promo) {
    if (!promo?.isActive) return 0;
    const percent = Number(promo.discountPercent);
    return Number.isFinite(percent) && percent > 0 && percent <= 100 ? percent : 0;
}

// Percentage off a registered customer's first order, configured in Studio
// (Site Settings → First Order Discount). Returns 0 when the promo is off,
// missing or misconfigured — no discount is the safe outcome.
//
// Read through backendClient (uncached) rather than catalogFetch: this value
// decides the amount actually charged, and a stale cached percentage would show
// the customer one total and charge them another.
export async function getFirstOrderPromoPercent() {
    try {
        return toPercent(await backendClient.fetch(PROMO_QUERY));
    } catch (error) {
        console.error("Error fetching first order promo", error);
        return 0;
    }
}

// Same value for marketing surfaces that only advertise the promo (the hero promo
// bar). Read through the tagged cache like other display data — it must not put a
// per-visitor Sanity query on the statically rendered home page. Never use this to
// decide what a customer is charged; getFirstOrderPromoPercent above is that.
export async function getFirstOrderPromoPercentForDisplay() {
    try {
        const promo = await catalogFetch({
            query: defineQuery(PROMO_QUERY),
            tags: ["firstOrderPromo"],
        });
        return toPercent(promo);
    } catch (error) {
        console.error("Error fetching first order promo for display", error);
        return 0;
    }
}
