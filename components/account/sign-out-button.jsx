"use client";

import { useClerk } from "@clerk/nextjs";
import { useLocale, useTranslations } from "next-intl";

const SignOutButton = () => {
    const { signOut } = useClerk();
    const locale = useLocale();
    const t = useTranslations("account");

    return (
        <button
            onClick={() => signOut({ redirectUrl: `/${locale}` })}
            className="font-aeonik text-[13px] text-gray-text underline hover:text-black-custom transition-colors cursor-pointer"
        >
            {t("signOut")}
        </button>
    );
};

export default SignOutButton;
