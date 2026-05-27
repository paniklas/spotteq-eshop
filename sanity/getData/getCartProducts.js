import { client } from '../lib/client'

export async function getCartProducts(productIds, locale) {
  if (!productIds?.length) return []

  const query = `
    *[_type == 'product' && _id in $ids] {
      _id,
      "title": title[language == $locale][0].value,
      price,
      salePrice,
      image,
      inventory,
      status,
      "slug": localizedSlugs[language == $locale][0].slug.current
    }
  `
  return client.fetch(
    query,
    { ids: productIds, locale },
    { next: { tags: ['product'], revalidate: 60 } }
  )
}
