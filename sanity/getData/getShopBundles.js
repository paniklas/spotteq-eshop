import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'
import { urlFor } from '../lib/image'

export async function getShopBundles(locale, { categoryId = null } = {}) {
  const QUERY = defineQuery(`
    *[_type == "bundle" && status == true
      && (!defined($categoryId) || $categoryId in products[].product->categories[]->._id)]
      | order(sortOrder asc) {
      _id,
      "title": title[language == $locale][0].value,
      "description": description[language == $locale][0].value,
      "slug": slugs[$locale].current,
      image,
      bundlePrice,
      saleBundlePrice,
      badge,
      products[] {
        quantity,
        "product": product-> {
          _id,
          "title": title[language == $locale][0].value,
          inventory,
        }
      }
    }
  `)

  try {
    const bundles = await catalogFetch({
      query: QUERY,
      params: { locale, categoryId },
      tags: ['bundles'],
    })
    return (bundles ?? []).map(bundle => ({
      ...bundle,
      imageUrl: bundle.image ? urlFor(bundle.image).width(600).url() : null,
    }))
  } catch (error) {
    console.error('Error fetching shop bundles', error)
    return []
  }
}
