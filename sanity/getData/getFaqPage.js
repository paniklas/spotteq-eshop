import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'
import { seoProjection } from '../lib/seoProjection'

// The FAQ page singleton in $locale. Returns null only when the document
// doesn't exist, which the page turns into a 404. Fetch errors are rethrown so
// a Sanity outage is a 500, as for the legal pages.
export async function getFaqPage(locale) {
    const QUERY = defineQuery(`
        *[_type == "faqPage" && _id == "faqPage"][0] {
            "heading": heading[language == $locale][0].value,
            "sections": sections[] {
                _key,
                "title": title[language == $locale][0].value,
                "items": items[] {
                    _key,
                    "question": question[language == $locale][0].value,
                    "answer": answer[language == $locale][0].value
                }
            },
            "closing": closing[language == $locale][0].value,
            ${seoProjection('metadata')}
        }
    `)

    try {
        return await catalogFetch({
            query: QUERY,
            params: { locale },
            tags: ['faqPage'],
        })
    } catch (error) {
        console.error('Error fetching FAQ page', error)
        throw error
    }
}
