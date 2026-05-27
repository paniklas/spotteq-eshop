import { client } from '../lib/client'
import { urlFor } from '../lib/image'

export async function getBundleBySlug(slug, locale) {
  const query = `
    *[_type == "bundle" && slugs[$locale].current == $slug][0] {
      _id,
      "title": title[language == $locale][0].value,
      "description": description[language == $locale][0].value,
      "slug": slugs[$locale].current,
      image,
      bundlePrice,
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
  `

  const bundle = await client.fetch(
    query,
    { slug, locale },
    { next: { tags: [`bundle:${slug}`], revalidate: 3600 } }
  )

  if (!bundle) return null

  return {
    ...bundle,
    imageUrl: bundle.image ? urlFor(bundle.image).url() : null,
    products: bundle.products?.map(item => ({
      ...item,
      product: {
        ...item.product,
        imageUrl: item.product?.image ? urlFor(item.product.image).url() : null,
      },
    })) ?? [],
  }
}
