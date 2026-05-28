import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getProductBySlug } from "@/sanity/getData/getProductBySlug"
import { getRelatedProducts } from "@/sanity/getData/getRelatedProducts"
import ProductInteractive from "@/components/shop/product-interactive"
import ProductPageSkeleton from "@/components/skeletons/product-page-skeleton"
import QualitySection from "@/components/home/quality-section"
import SpotteqImage from "@/components/home/spotteq-image"
import FeaturedProducts from "@/components/home/featured-products"
import FeaturedProductsSlider from "@/components/home/featured-products-slider"
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
            <RelatedProductsForSlug slug={slug} locale={locale} />
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

async function RelatedProductsForSlug({ slug, locale }) {
    const product = await getProductBySlug(slug, locale)
    if (!product) return <FeaturedProducts compact locale={locale} />

    const categoryIds = product.categories?.map(c => c._id) ?? []
    const related = await getRelatedProducts(product._id, categoryIds, locale)

    if (related.length > 0) {
        return (
            <section className="w-full bg-white py-16 xl:py-24">
                <div className="max-w-480 mx-auto page-x">
                    <FeaturedProductsSlider products={related} />
                </div>
            </section>
        )
    }

    return <FeaturedProducts compact locale={locale} />
}

