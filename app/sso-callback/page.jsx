'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { AuthenticateWithRedirectCallback, useAuth } from '@clerk/nextjs';

// This route sits outside the [locale] tree, so there's no next-intl provider
// here. Read the locale from the cookie next-intl sets; default to the app's
// default locale (el). useSyncExternalStore keeps the hydration render matching
// the server ('el') then reconciles to the cookie value — same approach as
// use-cart-hydrated, and avoids the set-state-in-effect lint.
const MESSAGES = {
    el: { title: 'Σύνδεση…', subtitle: 'Ρυθμίζουμε τον λογαριασμό σας.' },
    en: { title: 'Signing you in…', subtitle: 'Setting up your account.' },
};

const subscribe = () => () => {};
const getLocaleSnapshot = () => {
    const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
    return match?.[1] === 'en' ? 'en' : 'el';
};
const getServerLocaleSnapshot = () => 'el';

function Spinner() {
    return (
        <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-spin text-black-custom"
            aria-hidden="true"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}

export default function SSOCallbackPage() {
    const locale = useSyncExternalStore(subscribe, getLocaleSnapshot, getServerLocaleSnapshot);
    const t = MESSAGES[locale];
    const { isLoaded, isSignedIn } = useAuth();

    // Once the OAuth handshake has established a session, navigate to /account
    // ourselves with a full page load. The forms set redirectUrlComplete back to
    // this public page (not the protected /account), so Clerk's own post-OAuth
    // navigation never gets bounced to /sign-in by the middleware; this hard
    // navigation then guarantees the freshly-set session cookie accompanies the
    // request to /account (a soft navigation can beat the cookie there on mobile).
    useEffect(() => {
        if (isLoaded && isSignedIn) {
            window.location.href = `/${locale}/account`;
        }
    }, [isLoaded, isSignedIn, locale]);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-light page-x text-center">
            <Spinner />
            <div role="status" aria-live="polite" className="flex flex-col gap-1">
                <p className="font-aeonik text-[18px] text-black-custom">{t.title}</p>
                <p className="font-aeonik text-[14px] text-gray-text">{t.subtitle}</p>
            </div>

            {/* Process the OAuth ticket only while signed out. Once signed in, the
                effect above owns navigation — rendering this after completion (when
                the SDK soft-navigates back here with no ticket) would make it redirect
                to /sign-in, reintroducing the bounce. */}
            {isLoaded && !isSignedIn && <AuthenticateWithRedirectCallback />}
        </main>
    );
}
