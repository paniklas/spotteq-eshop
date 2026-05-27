import { client } from '../lib/client'

export async function getAllBundles(locale) {
  const query = `
    *[_type == 'bundle' && status == true]
      | order(sortOrder asc) {
      _id,
      "title": title[language == $locale][0].value,
      "description": description[language == $locale][0].value,
      localizedSlugs[] { language, "slug": slug.current },
      image,
      bundlePrice,
      badge,
      products[] {
        quantity,
        "product": product-> {
          _id,
          "title": title[language == $locale][0].value,
          image,
          price
        }
      }
    }
  `
  return client.fetch(query, { locale }, { next: { tags: ['bundle'], revalidate: 3600 } })
}
