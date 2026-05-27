import { Suspense } from "react";
import ShopView from "@/components/shop/shop-view";
import ShopSkeleton from "@/components/shop/shop-skeleton";
import ProductGrid from "@/components/shop/product-grid";
import QualitySection from "@/components/home/quality-section";
import SpotteqImage from "@/components/home/spotteq-image";
import { getAllProducts } from "@/sanity/getData/getAllProducts";
import { getAllCategories } from "@/sanity/getData/getAllcategories";


export default async function ShopAll({ params }) {
    const { locale } = await params;
    return (
        <>
            <Suspense fallback={<ShopSkeleton />}>
                <ShopAllContent locale={locale} />
            </Suspense>
            <QualitySection />
            <SpotteqImage />
        </>
    )
}

async function ShopAllContent({ locale }) {
    const [{ products, total }, categories] = await Promise.all([
        getAllProducts(locale),
        getAllCategories(locale),
    ])

    return (
        <ShopView categories={categories} total={total} heading="Shop All">
            <ProductGrid initialProducts={products} total={total} locale={locale} />
        </ShopView>
    )
}
