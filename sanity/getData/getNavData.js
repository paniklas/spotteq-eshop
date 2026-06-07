import { defineQuery } from 'next-sanity'
import { sanityFetch } from '../lib/live'

export async function getNavData(locale) {
  const QUERY = defineQuery(`{
    "categoryGroups": *[_type == "categoryGroup" && status == true] | order(sortOrder asc) {
      "slug": slug.current,
      "title": title[language == $locale][0].value,
      "categories": *[_type == "category" && categoryGroup._ref == ^._id && status == true] | order(sortOrder asc) {
        "title": title[language == $locale][0].value,
        "slug": slugs[$locale].current,
      }
    },
    "bundles": *[_type == "bundle" && status == true] | order(sortOrder asc) {
      "title": title[language == $locale][0].value,
      "slug": slugs[$locale].current,
    }
  }`)

  try {
    const result = await sanityFetch({ query: QUERY, params: { locale } })
    return result.data ?? { categoryGroups: [], bundles: [] }
  } catch (error) {
    console.error('Error fetching nav data', error)
    return { categoryGroups: [], bundles: [] }
  }
}
