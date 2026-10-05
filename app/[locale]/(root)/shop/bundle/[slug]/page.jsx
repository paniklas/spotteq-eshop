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
import { seoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

// Bundle SEO from Sanity (Bundle → SEO Metadata); empty fields fall back to the
// bundle's own title, description and main image.
export async function generateMetadata({ params }, parent) {
    const { locale, slug: rawSlug } = await params;
    const { slug } = normalizeSlug(rawSlug);
    const bundle = await getBundleBySlug(slug, locale);
    if (!bundle) return {};
    return seoMetadata(bundle.seo, locale, {
        title: bundle.title,
        description: bundle.description,
        image: bundle.image,
    }, parent);
}

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
            <QualitySection locale={locale} />
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
