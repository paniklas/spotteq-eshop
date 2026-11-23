import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'
import { seoProjection } from '../lib/seoProjection'

// A legal page singleton by its fixed document id ("privacyPage", …), in
// $locale. Returns null only when the document doesn't exist, which the page
// turns into a 404. Fetch errors are rethrown, so a Sanity outage is a 500
// (crawlers retry) rather than a 404 (crawlers may drop the page).
export async function getLegalPage(id, locale) {
    const QUERY = defineQuery(`
        *[_type == "legalPage" && _id == $id][0] {
            "heading": heading[language == $locale][0].value,
            "body": body[language == $locale][0].value,
            ${seoProjection('metadata')}
        }
    `)

    try {
        return await catalogFetch({
            query: QUERY,
            params: { id, locale },
            tags: ['legalPage'],
        })
    } catch (error) {
        console.error(`Error fetching legal page ${id}`, error)
        throw error
    }
}
