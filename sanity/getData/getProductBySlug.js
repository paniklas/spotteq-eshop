import { defineQuery } from 'next-sanity'
import { sanityFetch } from '../lib/live'
import { urlFor } from '../lib/image'

export async function getProductBySlug(slug, locale) {
    const QUERY = defineQuery(`
        *[_type == "product" && slugs[$locale].current == $slug][0] {
            _id,
            sku,
            "title": title[language == $locale][0].value,
            "subtitleLine1": subtitleLine1[language == $locale][0].value,
            "subtitleLine2": subtitleLine2[language == $locale][0].value,
            "tagline": tagline[language == $locale][0].value,
            "description": description[language == $locale][0].value,
            "highlights": highlights[language == $locale][0].value,
            "size": size[language == $locale][0].value,
            badge,
            "slug": slugs[$locale].current,
            image,
            galleryImages,
            price,
            salePrice,
            inventory,
            status,
            flavours[]-> {
                _id,
                "flavourName": flavourName[language == $locale][0].value,
                "slug": slugs[$locale].current,
                image
            },
            relatedProducts[]-> {
                _id,
                "title": title[language == $locale][0].value,
                "flavourName": flavourName[language == $locale][0].value,
                "slug": slugs[$locale].current,
                price,
                image
            },
            categories[]-> {
                _id,
                "title": title[language == $locale][0].value,
                "slug": slugs[$locale].current,
                "group": categoryGroup->slug.current
            },
            productDetails {
                "ingredients": ingredients[language == $locale][0].value,
                "directions": directions[language == $locale][0].value,
                "additionalInfo": additionalInfo[language == $locale][0].value
            }
        }
    `)

    try {
        const result = await sanityFetch({ query: QUERY, params: { slug, locale } })
        const product = result.data
        if (!product) return null

        return {
            ...product,
            imageUrl: product.image ? urlFor(product.image).width(800).url() : null,
            galleryImageUrls: product.galleryImages?.filter(img => img?.asset?._ref).map(img => urlFor(img).width(800).url()) ?? [],
            flavours: product.flavours?.filter(Boolean).map(f => ({
                ...f,
                imageUrl: f.image ? urlFor(f.image).width(200).url() : null,
            })) ?? [],
            relatedProducts: product.relatedProducts?.filter(Boolean).map(rp => ({
                ...rp,
                imageUrl: rp.image ? urlFor(rp.image).width(300).url() : null,
            })) ?? [],
        }
    } catch (error) {
        console.error('Error fetching product by slug', error)
        return null
    }
}
