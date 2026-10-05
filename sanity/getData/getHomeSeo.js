import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'
import { seoProjection } from '../lib/seoProjection'

// SEO fields of the home page (Studio: Site Settings → Home Page → SEO), in $locale.
// Also the site-wide default in the locale layout. Returns null on failure, so
// callers fall back to their own defaults.
export async function getHomeSeo(locale) {
    const QUERY = defineQuery(`
        *[_type == "homePage"][0] { ${seoProjection('seo')} }.seo
    `)

    try {
        return await catalogFetch({
            query: QUERY,
            params: { locale },
            tags: ['homePage'],
        })
    } catch (error) {
        console.error('Error fetching home page SEO', error)
        return null
    }
}
