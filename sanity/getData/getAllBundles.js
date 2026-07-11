import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'
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
          salePrice,
          inventory
        }
      }
    }
  `)

  try {
    // Tagged/cached path (via catalogFetch) so a bundle/product publish refreshes
    // this home section through the existing webhook (`bundles` tag), instead of
    // being frozen by the page's force-static render. Draft mode still goes live.
    const bundles = await catalogFetch({ query: QUERY, params: { locale }, tags: ['bundles'] }) ?? []

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
