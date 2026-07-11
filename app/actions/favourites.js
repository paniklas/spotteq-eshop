"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { getOrCreateUserInfo } from "@/sanity/getData/getOrCreateUserInfo";

// Product _ids the signed-in user has favourited. Empty array for guests —
// callers treat "not signed in" and "no favourites" the same way on read.
export async function getFavouriteIds() {
    const { userId } = await auth();
    if (!userId) return [];

    const userInfo = await backendClient.fetch(
        `*[_type == "userInfo" && userId == $userId][0]{ "ids": favourites[]._ref }`,
        { userId }
    );
    return userInfo?.ids ?? [];
}

// Toggles a product on the user's wishlist. Guests get { ok:false, error:"unauthenticated" }
// so the UI can prompt sign-in. getOrCreateUserInfo guarantees the doc exists even for
// users who have never visited /account, so favouriting works from the very first click.
// Returns the resulting state so an optimistic client can reconcile.
export async function toggleFavourite(productId) {
    if (!productId) return { ok: false, error: "invalid" };

    const { userId } = await auth();
    if (!userId) return { ok: false, error: "unauthenticated" };

    const userInfo = await getOrCreateUserInfo();
    if (!userInfo?._id) return { ok: false, error: "no_profile" };

    const ids = (userInfo.favourites ?? []).map((f) => f._ref);
    const isFav = ids.includes(productId);

    try {
        if (isFav) {
            await backendClient
                .patch(userInfo._id)
                .unset([`favourites[_ref == "${productId}"]`])
                .commit();
        } else {
            await backendClient
                .patch(userInfo._id)
                .setIfMissing({ favourites: [] })
                .insert("after", "favourites[-1]", [
                    { _type: "reference", _ref: productId, _key: productId },
                ])
                .commit();
        }
    } catch (err) {
        console.error("[toggleFavourite]", err);
        return { ok: false, error: "failed" };
    }

    revalidatePath("/account");
    revalidatePath("/account/wishlist");
    return { ok: true, favourited: !isFav };
}
