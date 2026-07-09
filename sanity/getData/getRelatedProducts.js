import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'

export async function getRelatedProducts(productId, categoryIds, locale) {
    if (!categoryIds?.length) return []

    const QUERY = defineQuery(`
        *[_type == "product" && status == true
            && _id != $productId
            && count(categories[_ref in $categoryIds]) > 0]
            | order(sortOrder asc)
            [0...6] {
            _id,
            "title": title[language == $locale][0].value,
            "slug": slugs[$locale].current,
            "subtitleLine1": subtitleLine1[language == $locale][0].value,
            "flavourName": flavourName[language == $locale][0].value,
            "size": size[language == $locale][0].value,
            image,
            price,
            salePrice,
            inventory,
            badge,
        }
    `)

    try {
        const products = await catalogFetch({
            query: QUERY,
            params: { productId, categoryIds, locale },
            tags: ['products'],
        })
        return products ?? []
    } catch {
        return []
    }
}
