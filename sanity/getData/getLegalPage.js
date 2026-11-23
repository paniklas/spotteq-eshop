import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'
import { seoProjection } from '../lib/seoProjection'

// A legal page singleton by its fixed document id ("privacyPage", …), in
// $locale. Returns null when the document doesn't exist yet or the fetch fails.
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
        return null
    }
}
