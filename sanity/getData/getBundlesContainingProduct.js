import { defineQuery } from 'next-sanity'
import { sanityFetch } from '../lib/live'
import { urlFor } from '../lib/image'

export async function getBundlesContainingProduct(productId, locale) {
  const QUERY = defineQuery(`
    *[_type == "bundle" && status == true && $productId in products[].product->._id] {
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
          "title": title[language == $locale][0].value,
          price,
          inventory
        }
      }
    }
  `)

  try {
    const result = await sanityFetch({ query: QUERY, params: { productId, locale } })
    const bundles = result.data ?? []

    return bundles.map(bundle => ({
      ...bundle,
      imageUrl: bundle.image ? urlFor(bundle.image).width(120).url() : null,
    }))
  } catch (error) {
    console.error('Error fetching bundles containing product', error)
    return []
  }
}
