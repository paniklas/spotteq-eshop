"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";

// Links PostHog events to the signed-in Clerk user (the Clerk id is the
// distinct id; email is a person property). Nothing is sent while the visitor
// is opted out. Sign-out resets the identity (sign-out-button.jsx). Renders nothing.
export default function PostHogIdentify() {
    const { isLoaded, isSignedIn, user } = useUser();
    const userId = user?.id;
    const email = user?.primaryEmailAddress?.emailAddress;

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !userId) return;
        posthog.identify(userId, email ? { email } : undefined);
    }, [isLoaded, isSignedIn, userId, email]);

    return null;
}
