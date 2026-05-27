import { client } from '../lib/client'

export async function getAllGoals(locale) {
  const query = `
    *[_type == "category" && categoryGroup->slug.current == "goal" && status == true]
      | order(sortOrder asc) {
      _id,
      "title": title[language == $locale][0].value,
      "slug": slugs[$locale].current,
      sortOrder
    }
  `
  return client.fetch(query, { locale }, { next: { tags: ['category'], revalidate: 3600 } })
}
