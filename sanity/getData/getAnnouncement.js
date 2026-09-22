import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'

export async function getAnnouncement(locale) {
    const QUERY = defineQuery(`
        *[_type == "announcement" && isActive == true][0] {
            "text": text[language == $locale][0].value,
            link,
            "linkText": linkText[language == $locale][0].value,
        }
    `)

    try {
        return await catalogFetch({
            query: QUERY,
            params: { locale },
            tags: ['announcement'],
        })
    } catch (error) {
        console.error('Error fetching announcement', error)
        return null
    }
}
