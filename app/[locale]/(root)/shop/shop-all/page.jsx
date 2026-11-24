import { Suspense } from "react";
import ShopView from "@/components/shop/shop-view";
import ShopSkeleton from "@/components/shop/shop-skeleton";
import ProductGrid from "@/components/shop/product-grid";
import QualitySection from "@/components/home/quality-section";
import SpotteqImage from "@/components/home/spotteq-image";
import { getAllProducts } from "@/sanity/getData/getAllProducts";
import { getAllCategories } from "@/sanity/getData/getAllcategories";
import { getShopBundles } from "@/sanity/getData/getShopBundles";
import { getTranslations } from "next-intl/server";
import { brandTitle, localeAlternates } from "@/lib/seo";


// Fixed el/en copy (messages → metadata); there is no Sanity document for this page.
// No openGraph here, so the layout's default share image is kept.
export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata" });
    return {
        title: brandTitle(t("shopAllTitle")),
        description: t("shopAllDescription"),
        alternates: localeAlternates(locale, "/shop/shop-all"),
    };
}

export default async function ShopAll({ params }) {
    const { locale } = await params;
    return (
        <>
            <Suspense fallback={<ShopSkeleton />}>
                <ShopAllContent locale={locale} />
            </Suspense>
            <QualitySection locale={locale} />
            <SpotteqImage />
        </>
    )
}

async function ShopAllContent({ locale }) {
    const [{ products, total }, categories, bundles, t] = await Promise.all([
        getAllProducts(locale),
        getAllCategories(locale),
        getShopBundles(locale),
        getTranslations({ locale, namespace: "shopAll" }),
    ])

    return (
        <ShopView categories={categories} bundles={bundles} total={total} heading="Shop All" description={t("description")} locale={locale}>
            <ProductGrid initialProducts={products} total={total} locale={locale} />
        </ShopView>
    )
}
