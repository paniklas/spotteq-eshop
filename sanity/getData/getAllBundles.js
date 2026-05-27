import { defineQuery } from 'next-sanity'
import { sanityFetch } from '../lib/live'
import { urlFor } from '../lib/image'

export async function getAllBundles(locale) {
  const QUERY = defineQuery(`
    *[_type == "bundle" && status == true && showOnHomePage == true]
      | order(sortOrder asc) [0...4] {
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
          image,
          price,
          salePrice
        }
      }
    }
  `)

  try {
    const result = await sanityFetch({ query: QUERY, params: { locale } })
    const bundles = result.data ?? []

    return bundles.map(bundle => ({
      ...bundle,
      imageUrl: bundle.image ? urlFor(bundle.image).width(600).url() : null,
      products: bundle.products?.map(item => ({
        ...item,
        product: item.product
          ? { ...item.product, imageUrl: item.product.image ? urlFor(item.product.image).width(300).url() : null }
          : null,
      })) ?? [],
    }))
  } catch (error) {
    console.error('Error fetching bundles', error)
    return []
  }
}
