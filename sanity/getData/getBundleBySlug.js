import { defineQuery } from 'next-sanity'
import { sanityFetch } from '../lib/live'
import { urlFor } from '../lib/image'

export async function getBundleBySlug(slug, locale) {
  const QUERY = defineQuery(`
    *[_type == "bundle" && slugs[$locale].current == $slug && status == true][0] {
      _id,
      "title": title[language == $locale][0].value,
      "description": description[language == $locale][0].value,
      "slug": slugs[$locale].current,
      "productIds": products[].product->._id,
      image,
      bundlePrice,
      saleBundlePrice,
      badge,
      status,
      products[] {
        quantity,
        "product": product-> {
          _id,
          "title": title[language == $locale][0].value,
          image,
          price,
          salePrice,
          inventory,
          "slug": slugs[$locale].current
        }
      }
    }
  `)

  try {
    const result = await sanityFetch({ query: QUERY, params: { slug, locale } })
    const bundle = result.data
    if (!bundle) return null

    return {
      ...bundle,
      imageUrl: bundle.image ? urlFor(bundle.image).width(600).url() : null,
      products: bundle.products?.map(item => ({
        ...item,
        product: item.product
          ? { ...item.product, imageUrl: item.product.image ? urlFor(item.product.image).width(300).url() : null }
          : null,
      })) ?? [],
    }
  } catch (error) {
    console.error('Error fetching bundle by slug', error)
    return null
  }
}
