"use client";

import { useTranslations } from "next-intl";
import { reopenCookieBanner } from "@/components/common/cookie-banner";

// Cookies Policy page: lets visitors change their Accept/Decline choice.
const CookieSettingsButton = () => {
    const t = useTranslations("cookieBanner");

    return (
        <button
            type="button"
            onClick={reopenCookieBanner}
            className="mt-10 xl:mt-12 h-11 px-6 border border-black-custom font-aeonik text-[13px] uppercase text-black-custom rounded-[14px] hover:bg-gray-soft transition-colors duration-300 cursor-pointer"
        >
            {t("changeChoice")}
        </button>
    );
};

export default CookieSettingsButton;
