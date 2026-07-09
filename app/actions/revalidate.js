"use server"

import { updateTag, revalidateTag } from "next/cache"

// Manual escape hatch for forcing a cache refresh outside the normal Sanity
// webhook flow (app/api/webhook/sanity-revalidate). Guarded by a shared secret
// since product/category/bundle data is cached (see sanity/lib/catalogFetch.js) —
// an unauthenticated caller could otherwise repeatedly purge hot tags and force
// every request back onto Sanity, a cache-stampede vector.
export async function revalidateSyncTags(tags, secret) {
    if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
        throw new Error("Unauthorized")
    }

    if (process.env.NODE_ENV === "development") {
        for (const tag of tags) updateTag(tag)
    } else {
        // { expire: 0 } forces immediate expiration without the "revalidateTag
        // without a second argument" deprecation warning — see
        // app/api/webhook/sanity-revalidate/route.js for the full explanation.
        for (const tag of tags) revalidateTag(tag, { expire: 0 })
    }
    return "refresh"
}
