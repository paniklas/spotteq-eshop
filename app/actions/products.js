"use server"

import { getAllProducts } from "@/sanity/getData/getAllProducts"

export async function loadMoreProducts(locale, offset, categoryIds = [], productIds = []) {
    const { products } = await getAllProducts(locale, { offset, categoryIds, productIds })
    return products
}
