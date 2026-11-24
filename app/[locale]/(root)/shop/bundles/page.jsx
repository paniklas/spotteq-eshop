import { Suspense } from "react";
import ShopView from "@/components/shop/shop-view";
import ShopSkeleton from "@/components/shop/shop-skeleton";
import ProductGrid from "@/components/shop/product-grid";
import QualitySection from "@/components/home/quality-section";
import SpotteqImage from "@/components/home/spotteq-image";
import { getShopBundles } from "@/sanity/getData/getShopBundles";
import { getAllCategories } from "@/sanity/getData/getAllcategories";
import { getTranslations } from "next-intl/server";
import { brandTitle, localeAlternates } from "@/lib/seo";


// Fixed el/en copy (messages → metadata); there is no Sanity document for this page.
// No openGraph here, so the layout's default share image is kept.
export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata" });
    return {
        title: brandTitle(t("bundlesTitle")),
        description: t("bundlesDescription"),
        alternates: localeAlternates(locale, "/shop/bundles"),
    };
}

export default async function ShopBundles({ params }) {
    const { locale } = await params;
    return (
        <>
            <Suspense fallback={<ShopSkeleton />}>
                <ShopBundlesContent locale={locale} />
            </Suspense>
            <QualitySection locale={locale} />
            <SpotteqImage />
        </>
    )
}

async function ShopBundlesContent({ locale }) {
    const [bundles, categories, t] = await Promise.all([
        getShopBundles(locale),
        getAllCategories(locale),
        getTranslations({ locale, namespace: "shopBundles" }),
    ])

    return (
        <ShopView
            categories={categories}
            bundles={bundles}
            total={bundles.length}
            heading="Shop Bundles"
            description={t("description")}
            activeBundlesPage
        >
            <ProductGrid initialProducts={[]} total={0} locale={locale} bundles={bundles} />
        </ShopView>
    )
}
