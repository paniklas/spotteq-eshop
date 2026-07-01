"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";

const profileSchema = z.object({
    phone: z.string().optional().default(""),
});

// Persists profile fields owned by Sanity (phone) on the user's `userInfo` doc.
// Name/email are managed by Clerk directly from the client (user.update).
export async function updateUserProfile(formData) {
    const { userId } = await auth();
    if (!userId) return { ok: false, error: "Not authenticated." };

    const parsed = profileSchema.safeParse(formData);
    if (!parsed.success) return { ok: false, error: "Invalid profile data." };

    const userInfo = await backendClient.fetch(
        `*[_type == "userInfo" && userId == $userId][0]{ _id }`,
        { userId }
    );
    if (!userInfo?._id) return { ok: false, error: "Profile not found." };

    try {
        await backendClient
            .patch(userInfo._id)
            .set({ phone: parsed.data.phone })
            .commit();
    } catch (err) {
        console.error("[updateUserProfile]", err);
        return { ok: false, error: "Could not save your profile. Please try again." };
    }

    revalidatePath("/account/profile");
    return { ok: true };
}
