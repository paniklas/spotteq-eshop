import { Suspense } from "react";
import { notFound } from "next/navigation";
import BundleInteractive from "@/components/shop/bundle-interactive";
import ProductPageSkeleton from "@/components/skeletons/product-page-skeleton";
import QualitySection from "@/components/home/quality-section";
import SpotteqImage from "@/components/home/spotteq-image";
import FeaturedProducts from "@/components/home/featured-products";
import KeyFeatures from "@/components/product/key-features";
import { getBundleBySlug } from "@/sanity/getData/getBundleBySlug";

export const dynamic = "force-dynamic";

export default async function BundlePage({ params }) {
    const { locale, slug } = await params;
    return (
        <>
            <Suspense fallback={<ProductPageSkeleton />}>
                <BundleContent locale={locale} slug={slug} />
            </Suspense>
            <KeyFeatures />
            <FeaturedProducts compact locale={locale} />
            <QualitySection />
            <SpotteqImage />
        </>
    )
}

async function BundleContent({ locale, slug }) {
    const bundle = await getBundleBySlug(slug, locale)
    if (!bundle) notFound()

    return <BundleInteractive bundle={bundle} />
}
