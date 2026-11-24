"use client";

import { useClerk } from "@clerk/nextjs";
import { useLocale, useTranslations } from "next-intl";
import posthog from "posthog-js";

const SignOutButton = () => {
    const { signOut } = useClerk();
    const locale = useLocale();
    const t = useTranslations("account");

    return (
        <button
            onClick={() => {
                // Unlink PostHog from this user so the next person on the
                // device does not inherit their identity.
                posthog.reset();
                signOut({ redirectUrl: `/${locale}` });
            }}
            className="font-aeonik text-[13px] text-gray-text underline hover:text-black-custom transition-colors cursor-pointer"
        >
            {t("signOut")}
        </button>
    );
};

export default SignOutButton;
