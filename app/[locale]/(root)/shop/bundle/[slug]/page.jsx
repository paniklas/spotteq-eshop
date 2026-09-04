import { Suspense } from "react";
import { notFound } from "next/navigation";
import { permanentRedirect } from "@/i18n/navigation";
import { normalizeSlug } from "@/utils/normalizeSlug";
import BundleInteractive from "@/components/shop/bundle-interactive";
import ProductPageSkeleton from "@/components/skeletons/product-page-skeleton";
import QualitySection from "@/components/home/quality-section";
import SpotteqImage from "@/components/home/spotteq-image";
import FeaturedProducts from "@/components/home/featured-products";
import KeyFeatures from "@/components/product/key-features";
import { getBundleBySlug } from "@/sanity/getData/getBundleBySlug";

export const dynamic = "force-dynamic";

export default async function BundlePage({ params }) {
    const { locale, slug: rawSlug } = await params;
    const { slug, stripped } = normalizeSlug(rawSlug);
    if (stripped && slug) {
        permanentRedirect({ href: `/shop/bundle/${encodeURIComponent(slug)}`, locale });
    }

    return (
        <>
            <Suspense fallback={<ProductPageSkeleton />}>
                <BundleContent locale={locale} slug={slug} />
            </Suspense>
            <KeyFeaturesForSlug slug={slug} locale={locale} />
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

async function KeyFeaturesForSlug({ slug, locale }) {
    const bundle = await getBundleBySlug(slug, locale)
    if (!bundle?.keyFeatures) return null
    return <KeyFeatures keyFeatures={bundle.keyFeatures} />
}
