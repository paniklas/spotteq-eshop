"use client";

import { useClerk } from "@clerk/nextjs";
import { useLocale, useTranslations } from "next-intl";
import posthog from "posthog-js";
import { hasAcceptedCookies } from "@/lib/cookie-consent";

const SignOutButton = () => {
    const { signOut } = useClerk();
    const locale = useLocale();
    const t = useTranslations("account");

    return (
        <button
            onClick={() => {
                // Unlink PostHog from this user so the next person on the
                // device does not inherit their identity. reset() also clears
                // PostHog's stored consent, so reapply the banner's Accept
                // (without a new $opt_in event).
                posthog.reset();
                if (hasAcceptedCookies()) posthog.opt_in_capturing({ captureEventName: false });
                signOut({ redirectUrl: `/${locale}` });
            }}
            className="font-aeonik text-[13px] text-gray-text underline hover:text-black-custom transition-colors cursor-pointer"
        >
            {t("signOut")}
        </button>
    );
};

export default SignOutButton;
