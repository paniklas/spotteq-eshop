import { Link } from "@/i18n/navigation";

const ShopView = ({ children, categories = [], bundles = [], total = 0, activeSlug, activeBundleSlug, heading = "Shop All", description }) => {
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
                <div className="product-glow" style={{ top: "35%", right: "130px", transform: "translateY(-50%)" }} />
            </div>

            <div className="max-w-480 mx-auto page-x">
                <div className="flex flex-col md:flex-row gap-16 xl:gap-24 py-16">

                    {/* Sidebar */}
                    <aside className="w-full md:w-60 xl:w-105 shrink-0 md:sticky md:top-28 md:self-start relative">
                        <div className="shop-glow" />

                        <h1 className="font-aeonik text-[35px] leading-tight text-black-custom mb-4">
                            {heading}
                        </h1>

                        <p className="font-aeonik text-[14px] xl:text-[18px] text-black-custom leading-relaxed mb-16">
                            {description ?? "A focused line of science-driven formulas for strength, performance, recovery and everyday health. Explore all our series, flavours and formats to build the system that works for your body and training."}
                        </p>

                        <p className="mb-12 font-aeonik text-[14px] xl:text-[18px] uppercase text-black-custom border-b-2 border-black-custom">
                            {total} Results
                        </p>

                        <div className="mt-8">
                            <Link
                                href="/shop/shop-all"
                                className={`font-aeonik text-[12px] xl:text-[15px] transition-colors duration-300 ${
                                    !activeSlug && !activeBundleSlug ? "text-orange-accent font-semibold" : "text-black-custom hover:text-panBlack"
                                }`}
                            >
                                All Products
                            </Link>
                        </div>

                        {sortedGroups.map(([groupSlug, group]) => (
                            <div key={groupSlug} className="mt-12">
                                <p className="font-aeonik text-[12px] xl:text-[14px] uppercase text-black-custom">
                                    SHOP BY {group.title}
                                </p>
                                <ul className="mt-4 flex flex-col">
                                    {group.items.map((cat) => (
                                        <li key={cat._id}>
                                            <Link
                                                href={`/shop/category/${cat.slug}`}
                                                className={`font-aeonik text-[12px] xl:text-[15px] transition-colors duration-300 ${
                                                    activeSlug === cat.slug
                                                        ? "text-orange-accent font-semibold"
                                                        : "text-black-custom hover:text-panBlack"
                                                }`}
                                            >
                                                {cat.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {bundles.length > 0 && (
                            <div className="mt-12">
                                <p className="font-aeonik text-[12px] xl:text-[14px] uppercase text-black-custom">
                                    SHOP BY BUNDLE
                                </p>
                                <ul className="mt-4 flex flex-col">
                                    {bundles.map((bundle) => (
                                        <li key={bundle._id}>
                                            <Link
                                                href={`/shop/bundle/${bundle.slug}`}
                                                className={`font-aeonik text-[12px] xl:text-[15px] transition-colors duration-300 ${
                                                    activeBundleSlug === bundle.slug
                                                        ? "text-orange-accent font-semibold"
                                                        : "text-black-custom hover:text-panBlack"
                                                }`}
                                            >
                                                {bundle.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
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
