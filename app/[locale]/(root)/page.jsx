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


const Home = async ({ params }) => {

  const { locale } = await params;

  return (
    <>
      <HeroSection locale={locale} />
      <AnnouncementBar />
      <AboutSection />
      <ShopBySeries />
      <BundleSection />
      <FeaturedProducts />
      <StoriesThatMove />
      <TrainingBanner />
      <QualitySection />
      <SpotteqImage />
    </>
  )
}

export default Home
