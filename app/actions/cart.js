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

// Max number of a bundle that can be built from the customer's *chosen* variants.
// items: [{ productId, quantity }] — the selected variant per slot and its per-bundle qty.
export async function checkBundleVariantInventory(items) {
    const list = (items ?? []).filter((i) => i?.productId)
    if (!list.length) return null

    const ids = [...new Set(list.map((i) => i.productId))]
    const QUERY = defineQuery(`
        *[_type == "product" && _id in $ids && status == true] {
            _id,
            inventory
        }
    `)

    try {
        const result = await sanityFetch({ query: QUERY, params: { ids } })
        const invById = Object.fromEntries((result.data ?? []).map((p) => [p._id, p.inventory]))

        let maxQty = Infinity
        for (const it of list) {
            // Absent id = inactive/deleted variant -> unavailable. Distinct from a
            // present id whose inventory is null, which genuinely means unlimited.
            if (!(it.productId in invById)) return 0
            const inv = invById[it.productId]
            if (inv == null) continue // unlimited
            maxQty = Math.min(maxQty, Math.floor(inv / it.quantity))
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

    // Bundles carrying chosen flavours: demand comes straight from the cart line's
    // selected variants — the customer gets those, not the bundle's admin defaults.
    const bundlesWithSelection = bundleItems.filter((i) => (i.selectedFlavours ?? []).length)
    const bundlesLegacy = bundleItems.filter((i) => !(i.selectedFlavours ?? []).length)

    for (const b of bundlesWithSelection) {
        for (const s of b.selectedFlavours) {
            if (!s.variantId) continue
            demand[s.variantId] = (demand[s.variantId] ?? 0) + b.qty * (s.quantity ?? 1)
        }
    }

    // Legacy bundle lines (added before per-slot selection existed): fall back to the
    // live bundle's default constituents.
    if (bundlesLegacy.length > 0) {
        const bundleIds = bundlesLegacy.map((i) => i.id)
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
                const cartBundle = bundlesLegacy.find((i) => i.id === bundle._id)
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
        return { valid: false, issues: [], error: "validation_failed" }
    }
}
