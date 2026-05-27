import { defineQuery } from 'next-sanity'
import { sanityFetch } from '../lib/live'

const PAGE_SIZE = 12

export async function getAllProducts(locale, options = {}) {
  const { limit = PAGE_SIZE, offset = 0, categoryIds = [], productIds = [], minPrice, maxPrice } = options

  const filters = [
    `_type == "product"`,
    `status == true`,
    categoryIds.length > 0 ? `count((categories[]._ref)[@ in $categoryIds]) > 0` : null,
    productIds.length > 0 ? `_id in $productIds` : null,
    minPrice !== undefined ? `price >= $minPrice` : null,
    maxPrice !== undefined ? `price <= $maxPrice` : null,
  ]
    .filter(Boolean)
    .join(' && ')

  const endIndex = offset + limit

  const productsQuery = defineQuery(`
    *[${filters}]
      | order(sortOrder asc, _createdAt desc)
      [$offset...$endIndex] {
      _id,
      "title": title[language == $locale][0].value,
      "slug": slugs[$locale].current,
      "subtitleLine1": subtitleLine1[language == $locale][0].value,
      "flavourName": flavourName[language == $locale][0].value,
      "size": size[language == $locale][0].value,
      "tagline": tagline[language == $locale][0].value,
      image,
      price,
      salePrice,
      inventory,
      badge,
      categories[]-> {
        _id,
        categoryGroup,
        "title": title[language == $locale][0].value
      }
    }
  `)

  const countQuery = defineQuery(`count(*[${filters}])`)

  const params = {
    locale,
    offset,
    endIndex,
    categoryIds,
    productIds,
    minPrice: minPrice ?? 0,
    maxPrice: maxPrice ?? 99999,
  }

  const [productsResult, countResult] = await Promise.all([
    sanityFetch({ query: productsQuery, params }),
    sanityFetch({ query: countQuery, params }),
  ])

  return {
    products: productsResult.data ?? [],
    total: countResult.data ?? 0,
  }
}
