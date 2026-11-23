import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAmbassadorPage } from "@/sanity/getData/getAmbassadorPage";
import AmbassadorHero from "@/components/ambassador/ambassador-hero";
import AmbassadorStory from "@/components/ambassador/ambassador-story";
import AmbassadorInterview from "@/components/ambassador/ambassador-interview";
import FeaturedProducts from "@/components/home/featured-products";
import FeaturedProductsSkeleton from "@/components/skeletons/featured-products-skeleton";
import QualitySection from "@/components/home/quality-section";
import SpotteqImage from "@/components/home/spotteq-image";
import { seoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic"
export const revalidate = 86400;

// Ambassador page from Sanity (Site Settings → Ambassador Page); empty SEO
// fields fall back to the name and the hero image.
export async function generateMetadata({ params }, parent) {
    const { locale } = await params
    const page = await getAmbassadorPage(locale)
    if (!page) return {}
    return seoMetadata(page.seo, locale, { title: page.name, image: page.heroImage }, parent)
}

// Below the interview, the same sections as the FAQ and contact pages.
export default async function AmbassadorPage({ params }) {
    const { locale } = await params
    const page = await getAmbassadorPage(locale)
    if (!page) notFound()

    return (
        <>
            <AmbassadorHero page={page} />
            <AmbassadorStory body={page.storyBody} quote={page.quote} />
            <AmbassadorInterview page={page} />
            <Suspense fallback={<FeaturedProductsSkeleton />}>
                <FeaturedProducts locale={locale} />
            </Suspense>
            <QualitySection locale={locale} />
            <SpotteqImage />
        </>
    )
}
