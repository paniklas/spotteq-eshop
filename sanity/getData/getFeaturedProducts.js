import { client } from '../lib/client'

export async function getFeaturedProducts(locale, limit = 3) {
  const query = `
    *[_type == 'product' && status == true && defined(badge) && badge != '']
      | order(sortOrder asc)
      [0...$limit] {
      _id,
      "title": title[language == $locale][0].value,
      localizedSlugs[] { language, "slug": slug.current },
      image,
      price,
      salePrice,
      badge,
      inventory,
      "size": size[language == $locale][0].value,
      series[]-> { _id, "title": title[language == $locale][0].value }
    }
  `
  return client.fetch(query, { locale, limit }, { next: { tags: ['product'], revalidate: 3600 } })
}
