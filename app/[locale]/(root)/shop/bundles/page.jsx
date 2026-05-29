import { Suspense } from "react";
import ShopView from "@/components/shop/shop-view";
import ShopSkeleton from "@/components/shop/shop-skeleton";
import ProductGrid from "@/components/shop/product-grid";
import QualitySection from "@/components/home/quality-section";
import SpotteqImage from "@/components/home/spotteq-image";
import { getShopBundles } from "@/sanity/getData/getShopBundles";
import { getAllCategories } from "@/sanity/getData/getAllcategories";


export default async function ShopBundles({ params }) {
    const { locale } = await params;
    return (
        <>
            <Suspense fallback={<ShopSkeleton />}>
                <ShopBundlesContent locale={locale} />
            </Suspense>
            <QualitySection />
            <SpotteqImage />
        </>
    )
}

async function ShopBundlesContent({ locale }) {
    const [bundles, categories] = await Promise.all([
        getShopBundles(locale),
        getAllCategories(locale),
    ])

    return (
        <ShopView
            categories={categories}
            bundles={bundles}
            total={bundles.length}
            heading="Shop Bundles"
            description="Curated combinations of our best-selling products, designed to support your training, recovery and daily health. Save more when you bundle."
            activeBundlesPage
        >
            <ProductGrid initialProducts={[]} total={0} locale={locale} bundles={bundles} />
        </ShopView>
    )
}
