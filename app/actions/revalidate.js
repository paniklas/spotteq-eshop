"use server"

import { updateTag, revalidateTag } from "next/cache"

export async function revalidateSyncTags(tags) {
    if (process.env.NODE_ENV === "development") {
        for (const tag of tags) updateTag(tag)
    } else {
        for (const tag of tags) revalidateTag(tag, "max")
    }
    return "refresh"
}
