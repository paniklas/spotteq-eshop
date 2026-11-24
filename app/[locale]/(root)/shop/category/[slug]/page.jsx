import { Suspense } from "react";
import { notFound } from "next/navigation";
import { permanentRedirect } from "@/i18n/navigation";
import { normalizeSlug } from "@/utils/normalizeSlug";
import ShopView from "@/components/shop/shop-view";
import ShopSkeleton from "@/components/shop/shop-skeleton";
import ProductGrid from "@/components/shop/product-grid";
import QualitySection from "@/components/home/quality-section";
import SpotteqImage from "@/components/home/spotteq-image";
import { getAllProducts } from "@/sanity/getData/getAllProducts";
import { getAllCategories, getCategoryBySlug } from "@/sanity/getData/getAllcategories";
import { getShopBundles } from "@/sanity/getData/getShopBundles";
import { NO_INDEX, seoMetadata, slugPaths } from "@/lib/seo";
import { HOME_CRUMB, breadcrumbJsonLd } from "@/lib/jsonld";
import JsonLd from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";

// Category SEO from Sanity (Category → SEO Metadata); empty fields fall back to
// the category's own title, description and image.
export async function generateMetadata({ params }, parent) {
    const { locale, slug: rawSlug } = await params;
    const { slug } = normalizeSlug(rawSlug);
    const category = await getCategoryBySlug(slug, locale);
    // A missing category answers 200 (notFound() runs inside Suspense); noindex it.
    if (!category) return { robots: NO_INDEX };
    return seoMetadata(category.seo, locale, {
        title: category.title,
        description: category.description,
        image: category.image,
    }, parent, slugPaths("/shop/category", category.slugsByLocale));
}

export default async function CategoryPageBySlug({ params }) {
    const { locale, slug: rawSlug } = await params;
    const { slug, stripped } = normalizeSlug(rawSlug);
    if (stripped && slug) {
        permanentRedirect({ href: `/shop/category/${encodeURIComponent(slug)}`, locale });
    }

    return (
        <>
            <Suspense fallback={<ShopSkeleton />}>
                <CategoryContent locale={locale} slug={slug} />
            </Suspense>
            <QualitySection locale={locale} />
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

    const [{ products, total }, allBundles, filteredBundles] = await Promise.all([
        getAllProducts(locale, { categoryIds: [category._id] }),
        getShopBundles(locale),
        getShopBundles(locale, { categoryId: category._id }),
    ])

    return (
        <>
        <JsonLd data={breadcrumbJsonLd([HOME_CRUMB(locale), { name: category.title }])} />
        <ShopView
            categories={categories}
            bundles={allBundles}
            total={total}
            activeSlug={slug}
            heading={category.title}
            description={category.description}
            locale={locale}
        >
            <ProductGrid
                initialProducts={products}
                total={total}
                locale={locale}
                categoryIds={[category._id]}
                bundles={filteredBundles}
            />
        </ShopView>
        </>
    )
}
