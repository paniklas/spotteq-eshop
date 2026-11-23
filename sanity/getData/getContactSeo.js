import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'
import { seoProjection } from '../lib/seoProjection'

// SEO fields of the contact page (Studio: Site Settings → Contact Page → SEO
// Metadata), in $locale. Returns null when the document doesn't exist yet or the
// fetch fails, so the page falls back to its messages/*.json metadata.
export async function getContactSeo(locale) {
    const QUERY = defineQuery(`
        *[_type == "contactPage"][0] { ${seoProjection('metadata')} }.seo
    `)

    try {
        return await catalogFetch({
            query: QUERY,
            params: { locale },
            tags: ['contactPage'],
        })
    } catch (error) {
        console.error('Error fetching contact page SEO', error)
        return null
    }
}
