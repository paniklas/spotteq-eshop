import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getProductBySlug } from "@/sanity/getData/getProductBySlug"
import ProductInteractive from "@/components/shop/product-interactive"
import ProductPageSkeleton from "@/components/skeletons/product-page-skeleton"
import QualitySection from "@/components/home/quality-section"
import SpotteqImage from "@/components/home/spotteq-image"
import FeaturedProducts from "@/components/home/featured-products"
import KeyFeatures from "@/components/product/key-features"

export const dynamic = "force-dynamic"
export const revalidate = 86400;

export default async function ProductPage({ params }) {
    const { slug, locale } = await params
    return (
        <>
            <Suspense fallback={<ProductPageSkeleton />}>
                <ProductPageContent slug={slug} locale={locale} />
            </Suspense>
            <KeyFeatures />
            <FeaturedProducts compact locale={locale} />
            <QualitySection />
            <SpotteqImage />
        </>
    )
}

async function ProductPageContent({ slug, locale }) {
    const product = await getProductBySlug(slug, locale)
    if (!product) notFound()

    const images = [product.imageUrl, ...product.galleryImageUrls].filter(Boolean)
    const subtitle = [product.subtitleLine1, product.subtitleLine2].filter(Boolean)

    return (
        <ProductInteractive
            product={{
                ...product,
                images,
                subtitle,
            }}
            relatedProducts={product.relatedProducts}
        />
    )
}

