import { Suspense } from "react";
import { notFound } from "next/navigation";
import ShopView from "@/components/shop/shop-view";
import ShopSkeleton from "@/components/shop/shop-skeleton";
import ProductGrid from "@/components/shop/product-grid";
import QualitySection from "@/components/home/quality-section";
import SpotteqImage from "@/components/home/spotteq-image";
import { getAllProducts } from "@/sanity/getData/getAllProducts";
import { getAllCategories } from "@/sanity/getData/getAllcategories";
import { getShopBundles } from "@/sanity/getData/getShopBundles";
import { getBundleBySlug } from "@/sanity/getData/getBundleBySlug";

export const dynamic = "force-dynamic";

export default async function BundlePage({ params }) {
    const { locale, slug } = await params;
    return (
        <>
            <Suspense fallback={<ShopSkeleton />}>
                <BundleContent locale={locale} slug={slug} />
            </Suspense>
            <QualitySection />
            <SpotteqImage />
        </>
    )
}

async function BundleContent({ locale, slug }) {
    const [bundle, categories, bundles] = await Promise.all([
        getBundleBySlug(slug, locale),
        getAllCategories(locale),
        getShopBundles(locale),
    ])

    if (!bundle) notFound()

    const productIds = bundle.productIds ?? []
    const { products, total } = await getAllProducts(locale, { productIds })

    return (
        <ShopView
            categories={categories}
            bundles={bundles}
            total={total}
            activeBundleSlug={slug}
            heading={bundle.title}
            description={bundle.description}
        >
            <ProductGrid
                initialProducts={products}
                total={total}
                locale={locale}
                productIds={productIds}
            />
        </ShopView>
    )
}
