import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { ClerkProvider } from '@clerk/nextjs';
import { elGR, enUS } from '@clerk/localizations';
import { aeonikProRegular, ttNormsProLight } from '@/fonts/fonts';
import { Toaster } from "@/components/ui/sonner";
// components
import LocaleLanguageSetter from "@/components/common/locale-lng-setter";
import FavouritesHydrator from "@/components/common/favourites-hydrator";
import CookieBanner from "@/components/common/cookie-banner";
import SmoothScrolling from "@/utils/SmoothScrolling";
import Navbar from '@/components/common/navbar';
import { CartProvider } from '@/context/cart-context';
import { routing } from '@/i18n/routing';
import { SanityLive } from "../../sanity/lib/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { DisableDraftMode } from "../../components/sanity/DisableDraftMode";
import { draftMode } from "next/headers";
import { getNavData } from '@/sanity/getData/getNavData'
import { getAllBundlesForCart } from '@/sanity/getData/getAllBundlesForCart';
import { getFreeShippingThreshold } from '@/sanity/getData/getFreeShippingThreshold';
import { getHomeSeo } from '@/sanity/getData/getHomeSeo';
import { getTranslations } from 'next-intl/server';
import { defaultMetadata } from '@/lib/seo';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

// Site-wide defaults: what any page without its own metadata shows. Taken from
// the home page's SEO in Sanity, with the translations as fallback.
export async function generateMetadata({ params }) {
    const { locale } = await params;
    if (!routing.locales.includes(locale)) return {};

    const [seo, t] = await Promise.all([
        getHomeSeo(locale),
        getTranslations({ locale, namespace: "metadata" }),
    ]);
    return defaultMetadata(seo, locale, { title: t("siteTitle"), description: t("siteDescription") });
}

export default async function LocaleLayout({ children, params }) {

    const { locale } = await params;
    if (!routing.locales.includes(locale)) notFound();

    const [messages, navData, allBundles, freeShippingThreshold] = await Promise.all([
        import(`../../messages/${locale}.json`).then(m => m.default),
        getNavData(locale),
        getAllBundlesForCart(locale),
        getFreeShippingThreshold(),
    ]);

    // <html> lives here, not in app/layout.jsx, so lang comes from the [locale]
    // param — correct on pre-rendered pages too (the force-static home).
    return (
        <ClerkProvider
            localization={locale === 'el' ? elGR : enUS}
            signInUrl={`/${locale}/sign-in`}
            signUpUrl={`/${locale}/sign-up`}
            afterSignOutUrl={`/${locale}`}
            signInFallbackRedirectUrl={`/${locale}/account`}
            signUpFallbackRedirectUrl={`/${locale}/account`}
        >
        <html lang={locale} data-scroll-behavior="smooth">
        <body className={`${aeonikProRegular.variable} ${ttNormsProLight.variable} antialiased bg-black-custom`}>
            {(await draftMode()).isEnabled && (
                <>
                    <DisableDraftMode />
                    <VisualEditing />
                </>
            )}
            <NextIntlClientProvider messages={messages} locale={locale}>
                <CartProvider allBundles={allBundles} freeShippingThreshold={freeShippingThreshold}>
                <SmoothScrolling>
                    <LocaleLanguageSetter locale={locale} />
                    <FavouritesHydrator />
                    <Navbar categoryGroups={navData.categoryGroups} navBundles={navData.bundles} />
                    <main>
                        {children}
                    </main>
                </SmoothScrolling>
                </CartProvider>
                <CookieBanner />
                <Toaster richColors toastOptions={{
                    duration: 5000,
                    closeButton: true
                }} />
            </NextIntlClientProvider>
            <SanityLive />
            {/* UserWay accessibility widget. Lives here rather than in the root
                layout so it stays out of Sanity Studio and /sso-callback;
                lazyOnload keeps it off the critical path (hero, Stripe). */}
            <Script
                src="https://cdn.userway.org/widget.js"
                data-account="f8N3POMRAT"
                strategy="lazyOnload"
            />
        </body>
        </html>
        </ClerkProvider>
    );
}
