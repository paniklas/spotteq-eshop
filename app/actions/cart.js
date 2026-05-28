"use server"

import { defineQuery } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"

export async function checkProductInventory(productId) {
    if (!productId) return null

    const QUERY = defineQuery(`
        *[_type == "product" && _id == $productId && status == true][0] {
            inventory
        }
    `)

    try {
        const result = await sanityFetch({ query: QUERY, params: { productId } })
        return result.data?.inventory ?? null
    } catch {
        return null
    }
}

export async function checkBundleInventory(bundleId) {
    if (!bundleId) return null

    const QUERY = defineQuery(`
        *[_type == "bundle" && _id == $bundleId && status == true][0] {
            products[] {
                quantity,
                "inventory": product->inventory
            }
        }
    `)

    try {
        const result = await sanityFetch({ query: QUERY, params: { bundleId } })
        const items = result.data?.products
        if (!items?.length) return null

        let maxQty = Infinity
        for (const item of items) {
            if (item.inventory == null) continue
            maxQty = Math.min(maxQty, Math.floor(item.inventory / item.quantity))
        }
        return maxQty === Infinity ? null : maxQty
    } catch {
        return null
    }
}

export async function validateCartInventory(cartItems, locale = "el") {
    if (!cartItems?.length) return { valid: true, issues: [] }

    const productItems = cartItems.filter((i) => i.type !== "bundle")
    const bundleItems = cartItems.filter((i) => i.type === "bundle")

    // demand map: productId -> total qty demanded across all cart items
    const demand = {}

    for (const item of productItems) {
        demand[item.id] = (demand[item.id] ?? 0) + item.qty
    }

    if (bundleItems.length > 0) {
        const bundleIds = bundleItems.map((i) => i.id)
        const BUNDLE_QUERY = defineQuery(`
            *[_type == "bundle" && _id in $bundleIds] {
                _id,
                products[] {
                    quantity,
                    "productId": product->_id,
                    "title": product->title[language == $locale][0].value
                }
            }
        `)
        try {
            const result = await sanityFetch({ query: BUNDLE_QUERY, params: { bundleIds, locale } })
            const bundles = result.data ?? []
            for (const bundle of bundles) {
                const cartBundle = bundleItems.find((i) => i.id === bundle._id)
                if (!cartBundle || !bundle.products?.length) continue
                for (const constituent of bundle.products) {
                    if (!constituent.productId) continue
                    demand[constituent.productId] = (demand[constituent.productId] ?? 0) + cartBundle.qty * constituent.quantity
                }
            }
        } catch {
            // if bundle fetch fails, skip cross-check for bundles
        }
    }

    const allProductIds = Object.keys(demand)
    if (!allProductIds.length) return { valid: true, issues: [] }

    const PRODUCTS_QUERY = defineQuery(`
        *[_type == "product" && _id in $productIds] {
            _id,
            inventory,
            "title": title[language == $locale][0].value
        }
    `)

    try {
        const result = await sanityFetch({ query: PRODUCTS_QUERY, params: { productIds: allProductIds, locale } })
        const products = result.data ?? []
        const issues = []
        for (const product of products) {
            if (product.inventory == null) continue
            const requested = demand[product._id] ?? 0
            if (requested > product.inventory) {
                issues.push({
                    productId: product._id,
                    title: product.title,
                    available: product.inventory,
                    requested,
                })
            }
        }
        return { valid: issues.length === 0, issues }
    } catch {
        return { valid: true, issues: [] }
    }
}
