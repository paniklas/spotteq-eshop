import { defineQuery } from 'next-sanity'
import { sanityFetch } from '../lib/live'
import { urlFor } from '../lib/image'

// Minimal bundle data for client-side cart suggestion matching.
export async function getAllBundlesForCart(locale) {
  const QUERY = defineQuery(`
    *[_type == "bundle" && status == true] {
      _id,
      "title": title[language == $locale][0].value,
      "slug": slugs[$locale].current,
      image,
      bundlePrice,
      saleBundlePrice,
      products[] {
        quantity,
        "product": product-> {
          _id,
          price
        }
      }
    }
  `)

  try {
    const result = await sanityFetch({ query: QUERY, params: { locale } })
    const bundles = result.data ?? []

    return bundles.map(bundle => ({
      ...bundle,
      imageUrl: bundle.image ? urlFor(bundle.image).width(120).url() : null,
    }))
  } catch (error) {
    console.error('Error fetching bundles for cart', error)
    return []
  }
}
