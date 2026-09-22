import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'

/**
 * The cart subtotal at which shipping becomes free, for display in the cart
 * drawer. Compared against the PRE-discount subtotal, like every other
 * consumer of the threshold.
 *
 * The threshold lives per shipping method (`shipping.freeShippingMinimum`), and
 * that per-method value is what actually zeroes the shipping cost at checkout
 * (order-summary.jsx / create-payment-intent). The cart drawer runs before a
 * method has been chosen, so it advertises the lowest threshold any active
 * method offers — the earliest point at which free shipping is reachable.
 *
 * Returns 0 when no active method offers free shipping; callers should hide the
 * banner in that case rather than promise something checkout will not honour.
 */
export async function getFreeShippingThreshold() {
    const QUERY = defineQuery(`
        *[_type == "shipping" && isActive == true && freeShippingMinimum > 0].freeShippingMinimum
    `)

    try {
        const thresholds = await catalogFetch({
            query: QUERY,
            tags: ['shipping'],
        })
        if (!Array.isArray(thresholds) || thresholds.length === 0) return 0
        return Math.min(...thresholds)
    } catch (error) {
        console.error('Error fetching free shipping threshold', error)
        return 0
    }
}
