import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'
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
    const bundles = await catalogFetch({
      query: QUERY,
      params: { productId, locale },
      tags: ['bundles'],
    })

    return (bundles ?? []).map(bundle => ({
      ...bundle,
      imageUrl: bundle.image ? urlFor(bundle.image).width(120).url() : null,
    }))
  } catch (error) {
    console.error('Error fetching bundles containing product', error)
    return []
  }
}
