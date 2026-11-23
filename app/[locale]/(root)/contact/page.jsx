import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { getContactSeo } from "@/sanity/getData/getContactSeo"
import ContactSection from "@/components/contact/contact-section"
import FeaturedProducts from "@/components/home/featured-products"
import FeaturedProductsSkeleton from "@/components/skeletons/featured-products-skeleton"
import QualitySection from "@/components/home/quality-section"
import SpotteqImage from "@/components/home/spotteq-image"
import { seoMetadata } from "@/lib/seo"

export const dynamic = "force-dynamic"
export const revalidate = 86400;

// Contact SEO from Sanity (Site Settings → Contact Page → SEO Metadata); empty
// fields fall back to the metadata.contact* messages.
export async function generateMetadata({ params }, parent) {
    const { locale } = await params
    const [seo, t] = await Promise.all([
        getContactSeo(locale),
        getTranslations({ locale, namespace: "metadata" }),
    ])
    return seoMetadata(seo, locale, {
        title: t("contactTitle"),
        description: t("contactDescription"),
    }, parent)
}

export default async function ContactPage({ params }) {
    const { locale } = await params

    return (
        <>
            <ContactSection locale={locale} />
            {/* The full section as on the home page: heading, description, SHOP ALL */}
            <Suspense fallback={<FeaturedProductsSkeleton />}>
                <FeaturedProducts locale={locale} />
            </Suspense>
            <QualitySection locale={locale} />
            <SpotteqImage />
        </>
    )
}
