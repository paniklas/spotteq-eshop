"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { addressSchema } from "@/lib/addressSchema";

// Patches the signed-in user's default shipping address on their Sanity `userInfo`
// document. The userInfo is resolved from the Clerk session userId — never from a
// client-supplied id — so a user can only ever update their own profile.
export async function updateUserShippingInfo(formData) {
    const { userId } = await auth();
    if (!userId) return { ok: false, error: "Not authenticated." };

    const parsed = addressSchema.safeParse(formData);
    if (!parsed.success) {
        return { ok: false, error: "Please check the address fields." };
    }

    const userInfo = await backendClient.fetch(
        `*[_type == "userInfo" && userId == $userId][0]{ _id }`,
        { userId }
    );
    if (!userInfo?._id) return { ok: false, error: "Profile not found." };

    try {
        await backendClient
            .patch(userInfo._id)
            .set({ shippingInfo: parsed.data })
            .commit();
    } catch (err) {
        console.error("[updateUserShippingInfo]", err);
        return { ok: false, error: "Could not save your address. Please try again." };
    }

    revalidatePath("/account");
    return { ok: true };
}
