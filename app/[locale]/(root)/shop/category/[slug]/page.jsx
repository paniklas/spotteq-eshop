import { Suspense } from "react";
import { notFound } from "next/navigation";
import ShopView from "@/components/shop/shop-view";
import ShopSkeleton from "@/components/shop/shop-skeleton";
import ProductGrid from "@/components/shop/product-grid";
import QualitySection from "@/components/home/quality-section";
import SpotteqImage from "@/components/home/spotteq-image";
import { getAllProducts } from "@/sanity/getData/getAllProducts";
import { getAllCategories, getCategoryBySlug } from "@/sanity/getData/getAllcategories";

export const dynamic = "force-dynamic";

export default async function CategoryPageBySlug({ params }) {
    const { locale, slug } = await params;
    return (
        <>
            <Suspense fallback={<ShopSkeleton />}>
                <CategoryContent locale={locale} slug={slug} />
            </Suspense>
            <QualitySection />
            <SpotteqImage />
        </>
    )
}

async function CategoryContent({ locale, slug }) {
    const [category, categories] = await Promise.all([
        getCategoryBySlug(slug, locale),
        getAllCategories(locale),
    ])

    if (!category) notFound()

    const { products, total } = await getAllProducts(locale, { categoryIds: [category._id] })

    return (
        <ShopView
            categories={categories}
            total={total}
            activeSlug={slug}
            heading={category.title}
            description={category.description}
        >
            <ProductGrid
                initialProducts={products}
                total={total}
                locale={locale}
                categoryIds={[category._id]}
            />
        </ShopView>
    )
}
