import { defineQuery } from 'next-sanity'
import { sanityFetch } from '../lib/live'

export async function getShopBundles(locale) {
  const QUERY = defineQuery(`
    *[_type == "bundle" && status == true]
      | order(sortOrder asc) {
      _id,
      "title": title[language == $locale][0].value,
      "slug": slugs[$locale].current,
      "productIds": products[].product->._id
    }
  `)

  try {
    const result = await sanityFetch({ query: QUERY, params: { locale } })
    return result.data ?? []
  } catch (error) {
    console.error('Error fetching shop bundles', error)
    return []
  }
}
