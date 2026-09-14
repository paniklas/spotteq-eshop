"use server"

import { defineQuery } from "next-sanity"
import { catalogFetch } from "@/sanity/lib/catalogFetch"
import { routing } from "@/i18n/routing"
import { normalizeSlug } from "@/utils/normalizeSlug"

// Route segment → Sanity document type + the list tag the revalidate webhook
// purges on publish, so a renamed slug is picked up here too.
const DOC_TYPES = {
    product: { type: "product", tag: "products" },
    category: { type: "category", tag: "categories" },
    bundle: { type: "bundle", tag: "bundles" },
}

/**
 * Slugs are localized (slugs.el / slugs.en), so switching language on a detail
 * page needs the other locale's slug for the same document.
 * @returns {Promise<string|null>} null when the document or its translation is missing.
 */
export async function getAlternateSlug(segment, rawSlug, fromLocale, toLocale) {
    const docType = DOC_TYPES[segment]
    if (!docType) return null
    if (!routing.locales.includes(fromLocale) || !routing.locales.includes(toLocale)) return null

    const { slug } = normalizeSlug(rawSlug)
    if (!slug) return null

    const QUERY = defineQuery(`
        *[_type == $type && slugs[$fromLocale].current == $slug][0].slugs[$toLocale].current
    `)

    try {
        return await catalogFetch({
            query: QUERY,
            params: { type: docType.type, slug, fromLocale, toLocale },
            tags: [docType.tag],
        }) ?? null
    } catch {
        return null
    }
}
