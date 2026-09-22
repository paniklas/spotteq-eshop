import { Suspense } from "react"
import { getAboutPage } from "@/sanity/getData/getAboutPage"
import AboutHero from "@/components/about/about-hero"
import AboutSpotter from "@/components/about/about-spotter"
import AboutMission from "@/components/about/about-mission"
import AboutPageSkeleton from "@/components/skeletons/about-page-skeleton"
import FeaturedProducts from "@/components/home/featured-products"
import FeaturedProductsSkeleton from "@/components/skeletons/featured-products-skeleton"
import QualitySection from "@/components/home/quality-section"
import SpotteqImage from "@/components/home/spotteq-image"

export const dynamic = "force-dynamic"
export const revalidate = 86400;

export default async function AboutUs({ params }) {
    const { locale } = await params

    return (
        <>
            <div className="w-full bg-gray-light">
                <Suspense fallback={<AboutPageSkeleton />}>
                    <AboutContent locale={locale} />
                </Suspense>
            </div>

            <Suspense fallback={<FeaturedProductsSkeleton />}>
                <FeaturedProducts locale={locale} />
            </Suspense>
            <QualitySection />
            <SpotteqImage />
        </>
    )
}

async function AboutContent({ locale }) {
    const about = await getAboutPage(locale)
    if (!about) return null

    return (
        <>
            <AboutHero
                heading={about.heading}
                imageUrl={about.heroImageUrl}
                imageAlt={about.heroImageAlt}
            />
            <AboutSpotter
                lines={about.spotterLines}
                body={about.spotterBody}
                imageUrl={about.spotterImageUrl}
                imageAlt={about.spotterImageAlt}
            />
            <AboutMission
                heading={about.missionHeading}
                body={about.missionBody}
                imageUrl={about.missionImageUrl}
                imageAlt={about.missionImageAlt}
            />
        </>
    )
}
