import "server-only";
import { cache } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { backendClient } from "../lib/backendClient";

// Lazily ensures a Sanity `userInfo` document exists for the signed-in Clerk user.
// Called on-demand (account layout + pages, checkout) — no external webhook required.
// Idempotent: returns the existing doc if present, otherwise creates one.
// Wrapped in cache() so the layout and its child page share one call per request.
// Server-only — uses the write client and must never be imported client-side.
export const getOrCreateUserInfo = cache(async () => {
    const user = await currentUser();
    if (!user) return null;

    const userId = user.id;
    const email =
        user.primaryEmailAddress?.emailAddress ??
        user.emailAddresses?.[0]?.emailAddress ??
        "";

    const existing = await backendClient.fetch(
        `*[_type == "userInfo" && userId == $userId][0]`,
        { userId }
    );
    if (existing) return existing;

    // Deterministic _id keyed by Clerk userId + createIfNotExists makes creation
    // idempotent under concurrent requests (two misses can't create duplicates).
    return backendClient.createIfNotExists({
        _id: `userInfo.${userId}`,
        _type: "userInfo",
        userId,
        email,
        role: "customer",
        createdAt: new Date().toISOString(),
    });
});
