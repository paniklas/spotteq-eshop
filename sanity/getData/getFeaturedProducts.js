import { defineQuery } from 'next-sanity'
import { sanityFetch } from '../lib/live'

export async function getFeaturedProducts(locale) {
    const QUERY = defineQuery(`
        *[_type == "homePage"][0] {
            featuredProducts[]-> {
                _id,
                "title": title[language == $locale][0].value,
                "slug": slugs[$locale].current,
                "subtitleLine1": subtitleLine1[language == $locale][0].value,
                "flavourName": flavourName[language == $locale][0].value,
                "size": size[language == $locale][0].value,
                image,
                price,
                salePrice,
                inventory,
                badge,
            }
        }
    `)

    try {
        const result = await sanityFetch({ query: QUERY, params: { locale } })
        return result.data?.featuredProducts?.filter(Boolean) ?? []
    } catch {
        return []
    }
}
