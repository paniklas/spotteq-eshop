import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'
import { urlFor } from '../lib/image'
import { seoProjection } from '../lib/seoProjection'

// The ambassador page singleton in $locale, with image URLs built here. Returns
// null only when the document doesn't exist, which the page turns into a 404.
// Fetch errors are rethrown, so a Sanity outage is a 500, as for the legal and
// FAQ pages.
export async function getAmbassadorPage(locale) {
    const QUERY = defineQuery(`
        *[_type == "ambassadorPage" && _id == "ambassadorPage"][0] {
            "label": label[language == $locale][0].value,
            heroImage,
            "heroImageAlt": heroImageAlt[language == $locale][0].value,
            "name": name[language == $locale][0].value,
            "subtitle": subtitle[language == $locale][0].value,
            "tagline": tagline[language == $locale][0].value,
            "journeyHeading": journeyHeading[language == $locale][0].value,
            "journeyBody": journeyBody[language == $locale][0].value,
            "achievements": achievements[language == $locale][0].value,
            medalImage,
            "medalImageAlt": medalImageAlt[language == $locale][0].value,
            "storyBody": storyBody[language == $locale][0].value,
            "quote": quote[language == $locale][0].value,
            interviewImage,
            "interviewImageAlt": interviewImageAlt[language == $locale][0].value,
            "interviewHeading": interviewHeading[language == $locale][0].value,
            "interviewIntro": interviewIntro[language == $locale][0].value,
            "interviewItems": interviewItems[] {
                _key,
                "question": question[language == $locale][0].value,
                "answer": answer[language == $locale][0].value
            },
            ${seoProjection('metadata')}
        }
    `)

    let page
    try {
        page = await catalogFetch({
            query: QUERY,
            params: { locale },
            tags: ['ambassadorPage'],
        })
    } catch (error) {
        console.error('Error fetching ambassador page', error)
        throw error
    }
    if (!page) return null

    // Widths cover the largest frame at 2x. Not cropped to a fixed aspect: the
    // hero card changes shape between mobile and desktop, so CSS covers it.
    return {
        ...page,
        heroImageUrl: page.heroImage ? urlFor(page.heroImage).width(2400).url() : null,
        medalImageUrl: page.medalImage ? urlFor(page.medalImage).width(1000).url() : null,
        interviewImageUrl: page.interviewImage ? urlFor(page.interviewImage).width(1100).url() : null,
    }
}
