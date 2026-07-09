import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'

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
    const navData = await catalogFetch({
      query: QUERY,
      params: { locale },
      tags: ['nav', 'categories', 'bundles'],
    })
    return navData ?? { categoryGroups: [], bundles: [] }
  } catch (error) {
    console.error('Error fetching nav data', error)
    return { categoryGroups: [], bundles: [] }
  }
}
