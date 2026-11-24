"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { addressSchema } from "@/lib/addressSchema";

// Patches the signed-in user's default billing address on their Sanity `userInfo`
// document. Resolved from the Clerk session userId — never a client-supplied id.
export async function updateUserBillingInfo(formData) {
    const { userId } = await auth();
    if (!userId) return { ok: false, error: "Not authenticated.", code: "unauthenticated" };

    const parsed = addressSchema.safeParse(formData);
    if (!parsed.success) {
        return { ok: false, error: "Please check the address fields.", code: "invalid" };
    }

    const userInfo = await backendClient.fetch(
        `*[_type == "userInfo" && userId == $userId][0]{ _id }`,
        { userId }
    );
    if (!userInfo?._id) return { ok: false, error: "Profile not found.", code: "notFound" };

    try {
        await backendClient
            .patch(userInfo._id)
            .set({ billingInfo: parsed.data })
            .commit();
    } catch (err) {
        console.error("[updateUserBillingInfo]", err);
        return { ok: false, error: "Could not save your address. Please try again.", code: "saveFailed" };
    }

    revalidatePath("/account/billing");
    return { ok: true };
}
