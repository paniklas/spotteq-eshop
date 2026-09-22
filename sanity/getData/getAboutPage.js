import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'
import { urlFor } from '../lib/image'

export async function getAboutPage(locale) {
    const QUERY = defineQuery(`
        *[_type == "aboutPage"][0] {
            "heading": heading[language == $locale][0].value,
            heroImage,
            "heroImageAlt": heroImageAlt[language == $locale][0].value,
            "spotterLines": spotterLines[language == $locale][0].value,
            "spotterBody": spotterBody[language == $locale][0].value,
            spotterImage,
            "spotterImageAlt": spotterImageAlt[language == $locale][0].value,
            "missionHeading": missionHeading[language == $locale][0].value,
            "missionBody": missionBody[language == $locale][0].value,
            missionImage,
            "missionImageAlt": missionImageAlt[language == $locale][0].value,
        }
    `)

    try {
        const aboutPage = await catalogFetch({
            query: QUERY,
            params: { locale },
            tags: ['aboutPage'],
        })

        if (!aboutPage) return null

        return {
            ...aboutPage,
            // Cropped to the exact frame aspect so the editor's hotspot/crop in Studio
            // decides what stays visible, rather than the browser centre-cropping.
            heroImageUrl: aboutPage.heroImage ? urlFor(aboutPage.heroImage).width(1710).height(785).fit('crop').url() : null,
            spotterImageUrl: aboutPage.spotterImage ? urlFor(aboutPage.spotterImage).width(876).height(900).fit('crop').url() : null,
            missionImageUrl: aboutPage.missionImage ? urlFor(aboutPage.missionImage).width(1150).height(1000).fit('crop').url() : null,
        }
    } catch {
        return null
    }
}
