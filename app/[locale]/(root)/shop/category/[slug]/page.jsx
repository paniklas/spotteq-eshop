import ProductCard from "@/components/home/product-card";
import QualitySection from "@/components/home/quality-section";
import SpotteqImage from "@/components/home/spotteq-image";

const products = [
    {
        id: "liposomal-magnesium-1",
        name: "Liposomal Magnesium",
        price: 40,
        inStock: true,
        image: "/images/products/liposomal-magnesium-1.png",
        attributes: [
            { label: "93.6 mg 25% NRV", value: "60 caps" },
            { label: "Vegan", value: "1 - Month Supply" },
        ],
        imgBg: "#f5f5f5",
        circle: { bg: "#e4e4e4", dot: "#cccccc" },
    },
    {
        id: "liposomal-magnesium-2",
        name: "Liposomal Magnesium",
        price: 40,
        inStock: true,
        image: "/images/products/liposomal-magnesium-2.png",
        attributes: [
            { label: "93.6 mg 25% NRV", value: "60 caps" },
            { label: "Vegan", value: "1 - Month Supply" },
        ],
        imgBg: "#ffffff",
    },
    {
        id: "hyperfuel-green-apple",
        name: "Hyperfuel®",
        price: 40,
        inStock: true,
        image: "/images/products/group-84.png",
        attributes: [
            { label: "BCAA 4:1:1", value: "390g" },
            { label: "Green Apple Flavor", value: "1 - Month Supply" },
        ],
        imgBg: "#ffffff",
    },
    {
        id: "liposomal-vitamin-c",
        name: "Liposomal Vitamin C",
        price: 40,
        inStock: true,
        image: "/images/products/liposomal-magnesium-3.png",
        attributes: [
            { label: "93.6 mg 25% NRV", value: "60 caps" },
            { label: "Vegan", value: "1 - Month Supply" },
        ],
        imgBg: "#f2e8d4",
        circle: { bg: "#e8d4a8", dot: "#d4be88" },
    },
    {
        id: "whey-protein-chocolate",
        name: "100% Pure Whey Protein",
        price: 40,
        inStock: true,
        image: "/images/products/group-86.png",
        attributes: [
            { label: "25g Protein", value: "30 servings" },
            { label: "Chocolate Flavour", value: "900g" },
        ],
        imgBg: "#ffffff",
    },
    {
        id: "hyperfuel-orange",
        name: "Hyperfuel®",
        price: 40,
        inStock: true,
        image: "/images/products/group-87.png",
        attributes: [
            { label: "BCAA 4:1:1", value: "390g" },
            { label: "Orange Flavor", value: "1 - Month Supply" },
        ],
        imgBg: "#f2e8d4",
    },
    {
        id: "liposomal-magnesium-3",
        name: "Liposomal Magnesium",
        price: 40,
        inStock: true,
        image: "/images/products/liposomal-magnesium-3.png",
        attributes: [
            { label: "93.6 mg 25% NRV", value: "60 caps" },
            { label: "Vegan", value: "1 - Month Supply" },
        ],
        imgBg: "#ffffff",
    },
    {
        id: "whey-protein-strawberry",
        name: "100% Pure Whey Protein",
        price: 40,
        inStock: true,
        image: "/images/products/group-88.png",
        attributes: [
            { label: "25g Protein", value: "30 servings" },
            { label: "Strawberry Flavour", value: "900g" },
        ],
        imgBg: "#f5f5f5",
        circle: { bg: "#e4e4e4", dot: "#cccccc" },
    },
];

const SERIES_FILTERS = ["Performance Series", "Clinical Series"];
const GOAL_FILTERS = [
    "Build Muscle & Strength",
    "Endurance & Performance",
    "Recovery & Muscle Function",
    "Immunity & Everyday Health",
];

const CategoryPageBySlug = async ({ params }) => {

    const { locale, slug } = await params;

    return (
        <>
            <section className="pt-24 min-h-screen bg-white-custom pb-10 xl:pb-[10.5rem]">
                <div className="max-w-[1920px] mx-auto page-x">
                    <div className="flex flex-col md:flex-row gap-16 xl:gap-24 py-16">
                        {/* ── Sidebar ── */}
                        <aside className="w-full md:w-[240px] xl:w-[420px] flex-shrink-0 md:sticky md:top-28 md:self-start relative">
                            {/* Glow — inside the sticky sidebar so it scrolls with it */}
                            <div className="shop-glow" />
                            <h1 className="font-aeonik text-[35px] leading-tight text-black-custom mb-4">
                                Shop All
                            </h1>
                            <p className="font-aeonik text-[14px] xl:text-[18px] text-black-custom leading-relaxed mb-16">
                                A focused line of science-driven formulas for strength,
                                performance, recovery and everyday health. Explore all our
                                series, flavours and formats to build the system that works for
                                your body and training.
                            </p>

                            <p className="mb-12 font-aeonik text-[14px] xl:text-[18px] uppercase text-black-custom border-b-2 border-black-custom">
                                {products.length} Results
                            </p>

                            {/* Shop By Series */}
                            <div className="mt-8">
                                <p className="font-aeonik text-[12px] xl:text-[14px] uppercase text-black-custom">
                                    SHOP BY SERIES
                                </p>
                                <ul className="mt-4 flex flex-col">
                                    {SERIES_FILTERS.map((series) => (
                                        <li key={series}>
                                            <button className="font-aeonik text-[12px] xl:text-[15px] text-black-custom hover:text-panBlack transition-colors duration-300">
                                                {series}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Shop By Goal */}
                            <div className="mt-12">
                                <p className="font-aeonik text-[12px] xl:text-[14px] uppercase text-black-custom">
                                    SHOP BY GOAL
                                </p>
                                <ul className="mt-4 flex flex-col">
                                    {GOAL_FILTERS.map((goal) => (
                                        <li key={goal}>
                                            <button className="font-aeonik text-[12px] xl:text-[15px] text-black-custom hover:text-panBlack transition-colors duration-300">
                                                {goal}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Bundles */}
                            <div className="mt-12">
                                <p className="font-aeonik text-[12px] xl:text-[14px] uppercase text-black-custom">
                                    Bundles
                                </p>
                            </div>
                        </aside>

                        {/* ── Product Grid ── */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} locale={locale} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <QualitySection />
            <SpotteqImage />
        </>
    )
}

export default CategoryPageBySlug