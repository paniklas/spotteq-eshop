import { getTranslations } from "next-intl/server";
import ShopFilters from "@/components/shop/shop-filters";

const ShopView = async ({ children, categories = [], bundles = [], total, activeSlug, activeBundleSlug, activeBundlesPage = false, heading = "Shop All", description, locale }) => {
    // Without a page/category description, fall back to the home page's Featured
    // Products text. The locale is passed explicitly, as on the force-static home
    // page, so this works whether or not the page is statically rendered.
    const shownDescription = description ?? (await getTranslations({ locale, namespace: "home.featuredProducts" }))("description")

    const grouped = categories.reduce((acc, cat) => {
        const key = cat.group || "other"
        if (!acc[key]) acc[key] = { title: cat.groupTitle || key, sortOrder: cat.groupSortOrder ?? 999, items: [] }
        acc[key].items.push(cat)
        return acc
    }, {})

    const sortedGroups = Object.entries(grouped).sort((a, b) => a[1].sortOrder - b[1].sortOrder)

    return (
        <section className="pt-24 min-h-screen bg-white-custom pb-10 xl:pb-42 relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div 
                    className="hidden xl:block product-glow"
                    style={{ top: "35%", right: "-100px", zIndex: 99, transform: "translateY(-50%)" }}
                />
            </div>

            <div className="max-w-480 mx-auto page-x">
                <div className="flex flex-col md:flex-row gap-10 xl:gap-24 py-4 xl:py-16">

                    {/* Sidebar */}
                    <aside className="w-full md:w-60 xl:w-105 shrink-0 md:sticky md:top-28 md:self-start relative">
                        <div className="hidden xl:block shop-glow" />

                        <h1 className="font-aeonik text-[18px] xl:text-[35px] leading-tight text-black-custom mb-4">
                            {heading}
                        </h1>

                        <p className="font-aeonik text-[14px] xl:text-[18px] text-black-custom leading-relaxed mb-10">
                            {shownDescription}
                        </p>

                        <ShopFilters
                            total={total}
                            sortedGroups={sortedGroups}
                            bundles={bundles}
                            activeSlug={activeSlug}
                            activeBundleSlug={activeBundleSlug}
                            activeBundlesPage={activeBundlesPage}
                        />
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ShopView
