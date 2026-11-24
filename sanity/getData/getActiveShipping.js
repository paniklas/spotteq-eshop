import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'

// Active shipping methods for the store's structured data (lib/jsonld.js), in
// $locale. Cached and tagged `shipping` like getFreeShippingThreshold, so a
// publish refreshes the home page's markup. Checkout keeps its own live query
// (getShippingMethods). Returns [] on failure: the markup then omits shipping
// rather than stating something checkout won't honour.
export async function getActiveShipping(locale) {
    const QUERY = defineQuery(`
        *[_type == "shipping" && isActive == true] | order(price asc) {
            "name": name[language == $locale][0].value,
            price,
            freeShippingMinimum,
            availableRegions,
            provider
        }
    `)

    try {
        const methods = await catalogFetch({
            query: QUERY,
            params: { locale },
            tags: ['shipping'],
        })
        return Array.isArray(methods) ? methods : []
    } catch (error) {
        console.error('Error fetching shipping methods for structured data', error)
        return []
    }
}
