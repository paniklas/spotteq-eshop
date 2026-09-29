import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'
import { urlFor } from '../lib/image'

// Product images the home hero arrows cycle through (Studio: Site Settings → Home Page).
// Returns [] when none are set, so the hero can fall back to its bundled image.
export async function getHeroImages(locale) {
    const QUERY = defineQuery(`
        *[_type == "homePage"][0].heroImages[defined(asset)] {
            asset,
            crop,
            hotspot,
            "alt": alt[language == $locale][0].value,
            "width": asset->metadata.dimensions.width,
            "height": asset->metadata.dimensions.height,
        }
    `)

    try {
        const images = await catalogFetch({
            query: QUERY,
            params: { locale },
            tags: ['homePage'],
        })

        return (images ?? []).map((image) => {
            // Studio crop is stored as fractions trimmed off each edge; the URL applies
            // it, so the rendered image has the cropped proportions, not the original's.
            const crop = image.crop ?? { top: 0, bottom: 0, left: 0, right: 0 }
            return {
                url: urlFor(image).width(1200).auto('format').url(),
                alt: image.alt,
                width: Math.round(image.width * (1 - crop.left - crop.right)),
                height: Math.round(image.height * (1 - crop.top - crop.bottom)),
            }
        })
    } catch (error) {
        console.error('Error fetching hero images', error)
        return []
    }
}
