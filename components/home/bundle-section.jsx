import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import BundleCard from "./bundle-card";
import BundleCarousel from "./bundle-carousel";
import { getAllBundles } from "@/sanity/getData/getAllBundles";

const BundleSection = async ({ locale }) => {
    // Explicit locale: the home page is force-static, so next-intl has no
    // request to read it from (see stories-that-move).
    const [bundles, t] = await Promise.all([
        getAllBundles(locale),
        getTranslations({ locale, namespace: "home.bundles" }),
    ])

    return (
        <section
            id="bundle-section"
            className="w-full bg-gray-light py-16 xl:py-24"
        >
            <div className="max-w-480 mx-auto page-x">
                {/* Header */}
                <div className="md:flex md:items-start md:justify-between mb-6 md:mb-20">
                    <h2 className="font-aeonik text-black text-[28px] xl:text-[35px] leading-[1.45] mb-4 md:mb-0 shrink-0">
                        Our Bundles
                    </h2>
                    <p className="font-aeonik text-black-custom text-[16px] xl:text-[18px] leading-[1.2] md:max-w-175">
                        {t("description")}
                    </p>
                    <Link
                        href="/shop/bundles"
                        locale={locale}
                        className="hidden xl:inline-flex items-center justify-center h-[41px] w-[159px] bg-black rounded-[21px] font-aeonik text-white-custom text-[14px] hover:bg-white-custom hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-700 shrink-0"
                    >
                        VIEW OUR BUNDLES
                    </Link>
                </div>

                {/* Mobile — button sits below the description, above the carousel */}
                <Link
                    href="/shop/bundles"
                    locale={locale}
                    className="md:hidden inline-flex items-center justify-center h-7 px-6 bg-black-custom rounded-[21px] font-aeonik text-white text-[14px] mb-12"
                >
                    VIEW OUR BUNDLES
                </Link>

                {bundles.length > 0 && (
                    <>
                        {/* Tablet / desktop grid */}
                        <div className="hidden md:block">
                            {/* Row 1: two equal cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {bundles[0] && <BundleCard {...bundles[0]} />}
                                {bundles[1] && <BundleCard {...bundles[1]} />}
                            </div>

                            {/* Row 2: two vertical cards (image on top), the second one wider */}
                            {(bundles[2] || bundles[3]) && (
                                <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 mt-6">
                                    {bundles[2] && <BundleCard {...bundles[2]} variant="vertical" />}
                                    {bundles[3] && <BundleCard {...bundles[3]} variant="vertical" />}
                                </div>
                            )}
                        </div>

                        {/* Mobile carousel — one vertical card at a time */}
                        <div className="md:hidden">
                            <BundleCarousel bundles={bundles} />
                        </div>
                    </>
                )}

                {/* Tablet-only bottom button (mobile has its own above; desktop has top-right) */}
                <div className="mt-8 hidden md:flex justify-center xl:hidden">
                    <Link
                        href="/shop/bundles"
                        locale={locale}
                        className="inline-flex items-center justify-center h-[41px] w-[159px] bg-black-custom rounded-[20px] font-aeonik text-white text-[14px]"
                    >
                        VIEW OUR BUNDLES
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default BundleSection
