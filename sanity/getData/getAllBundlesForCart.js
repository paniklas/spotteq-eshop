import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'
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
    const bundles = await catalogFetch({
      query: QUERY,
      params: { locale },
      tags: ['bundles'],
    })

    return (bundles ?? []).map(bundle => ({
      ...bundle,
      imageUrl: bundle.image ? urlFor(bundle.image).width(120).url() : null,
    }))
  } catch (error) {
    console.error('Error fetching bundles for cart', error)
    return []
  }
}
