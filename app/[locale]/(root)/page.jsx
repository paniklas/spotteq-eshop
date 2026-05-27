import { Suspense } from "react"
import AboutSection from "@/components/home/about-section"
import AnnouncementBar from "@/components/home/announcement-bar"
import BundleSection from "@/components/home/bundle-section"
import FeaturedProducts from "@/components/home/featured-products"
import HeroSection from "@/components/home/hero-section"
import QualitySection from "@/components/home/quality-section"
import ShopBySeries from "@/components/home/shop-by-series"
import SpotteqImage from "@/components/home/spotteq-image"
import StoriesThatMove from "@/components/home/stories-that-move"
import TrainingBanner from "@/components/home/training-banner"
import ShopBySeriesSkeleton from "@/components/skeletons/shop-by-series-skeleton"
import BundleSectionSkeleton from "@/components/skeletons/bundle-section-skeleton"

export const dynamic = "force-static";
export const revalidate = 86400;

const Home = async ({ params }) => {
  const { locale } = await params;

  return (
    <>
      <HeroSection locale={locale} />
      <AnnouncementBar />
      <AboutSection />
      <Suspense fallback={<ShopBySeriesSkeleton />}>
        <ShopBySeries locale={locale} />
      </Suspense>
      <Suspense fallback={<BundleSectionSkeleton />}>
        <BundleSection locale={locale} />
      </Suspense>
      <FeaturedProducts locale={locale} />
      <StoriesThatMove />
      <TrainingBanner />
      <QualitySection />
      <SpotteqImage />
    </>
  )
}

export default Home
