"use client";

import { useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { useTranslations } from "next-intl";
import posthog from "posthog-js";
import { Link } from "@/i18n/navigation";
import { CONSENT_KEY } from "@/lib/cookie-consent";

// The stored choice gates PostHog analytics: Accept opts in, Decline opts out,
// and closing (X) leaves the visitor opted out (the default set in
// instrumentation-client.js). Essential storage (cart, auth, payments) and
// UserWay load regardless. Accept/decline persist in localStorage; closing
// hides it for the session. The Cookies Policy page reopens it through
// reopenCookieBanner(); the stored choice stays until Accept or Decline.

// useSyncExternalStore rather than a useEffect-set flag (see use-cart-hydrated):
// the server snapshot keeps the banner out of the hydration render, and it
// avoids react-hooks/set-state-in-effect. The "storage" event syncs other tabs.
const listeners = new Set();
const subscribe = (onStoreChange) => {
    listeners.add(onStoreChange);
    window.addEventListener("storage", onStoreChange);
    return () => {
        listeners.delete(onStoreChange);
        window.removeEventListener("storage", onStoreChange);
    };
};
// Set by reopenCookieBanner(); in memory only, so a reload hides it again.
let reopened = false;
const notify = () => listeners.forEach((listener) => listener());
const getSnapshot = () =>
    reopened || (!localStorage.getItem(CONSENT_KEY) && !sessionStorage.getItem(CONSENT_KEY));
const getServerSnapshot = () => false;

const saveChoice = (storage, value) => {
    storage.setItem(CONSENT_KEY, value);
    reopened = false;
    notify();
};

export function reopenCookieBanner() {
    reopened = true;
    notify();
}

export default function CookieBanner() {
    const t = useTranslations("cookieBanner");
    const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const accept = () => {
        saveChoice(localStorage, "accepted");
        posthog.opt_in_capturing();
    };
    const dismiss = () => saveChoice(sessionStorage, "dismissed");
    const decline = () => {
        saveChoice(localStorage, "declined");
        posthog.opt_out_capturing();
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    role="region"
                    aria-labelledby="cookie-banner-title"
                    data-testid="cookie-banner"
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 24, opacity: 0 }}
                    transition={{ type: "spring", damping: 28, stiffness: 320 }}
                    // z-30: below the menu overlay, filters and cart drawer (z-40/50)
                    className="fixed z-30 mx-4 left-0 right-0 bottom-[calc(env(safe-area-inset-bottom)+16px)] md:bottom-6 md:left-auto md:right-6 md:mx-0 md:w-90"
                >
                    <div className="bg-white-custom text-black-custom rounded-2xl p-5 shadow-2xl ring-1 ring-black/10">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-gray-soft flex items-center justify-center shrink-0">
                                    <Cookie size={15} />
                                </div>
                                <p id="cookie-banner-title" className="font-aeonik text-[15px] leading-tight">
                                    {t("title")}
                                </p>
                            </div>
                            <button
                                onClick={dismiss}
                                aria-label={t("close")}
                                className="p-1 hover:opacity-60 transition-opacity cursor-pointer shrink-0"
                            >
                                <X size={16} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Body */}
                        <p className="font-aeonik text-[13px] text-gray-text leading-relaxed mb-4">
                            {t("description")}{" "}
                            <Link href="/cookies" className="text-black-custom underline hover:opacity-60 transition-opacity">
                                {t("learnMore")}
                            </Link>
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={decline}
                                className="flex-1 h-11 border border-black-custom font-aeonik text-[13px] uppercase text-black-custom rounded-[14px] hover:bg-gray-soft transition-colors duration-300 cursor-pointer"
                            >
                                {t("decline")}
                            </button>
                            <button
                                onClick={accept}
                                className="flex-1 h-11 bg-black-custom font-aeonik text-[13px] uppercase text-white-custom rounded-[14px] hover:bg-gray-text transition-colors duration-300 cursor-pointer"
                            >
                                {t("accept")}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
