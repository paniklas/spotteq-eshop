import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getFaqPage } from "@/sanity/getData/getFaqPage";
import FaqSection from "@/components/faq/faq-section";
import FeaturedProducts from "@/components/home/featured-products";
import FeaturedProductsSkeleton from "@/components/skeletons/featured-products-skeleton";
import QualitySection from "@/components/home/quality-section";
import SpotteqImage from "@/components/home/spotteq-image";
import { seoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic"
export const revalidate = 86400;

// FAQ from Sanity (Site Settings → FAQ Page); empty SEO fields fall back to the
// page heading.
export async function generateMetadata({ params }, parent) {
    const { locale } = await params
    const page = await getFaqPage(locale)
    if (!page) return {}
    return seoMetadata(page.seo, locale, { title: page.heading }, parent)
}

// Below the questions, the same sections as the contact page.
export default async function FaqPage({ params }) {
    const { locale } = await params
    const page = await getFaqPage(locale)
    if (!page) notFound()

    return (
        <>
            <FaqSection heading={page.heading} sections={page.sections} closing={page.closing} />
            <Suspense fallback={<FeaturedProductsSkeleton />}>
                <FeaturedProducts locale={locale} />
            </Suspense>
            <QualitySection locale={locale} />
            <SpotteqImage />
        </>
    )
}
