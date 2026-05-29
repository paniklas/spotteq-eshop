import Link from "next/link";
import BundleCard from "./bundle-card";
import { getAllBundles } from "@/sanity/getData/getAllBundles";

const BundleSection = async ({ locale }) => {
    const bundles = await getAllBundles(locale)

    return (
        <section
            id="bundle-section"
            className="w-full bg-gray-light py-16 xl:py-24"
        >
            <div className="max-w-480 mx-auto page-x">
                {/* Header */}
                <div className="flex items-center justify-between mb-20">
                    <h2 className="font-aeonik text-black text-[28px] xl:text-[35px] leading-[1.45]">
                        Our Bundles
                    </h2>
                    <p className="font-aeonik text-black-custom text-[16px] xl:text-[18px] leading-[1.2] max-w-[700px] hidden md:block">
                        Curated combinations of products that work together – for strength,
                        performance, recovery and everyday health. Choose a Performance or
                        Clinical bundle to simplify your routine and get a complete SPOTTEQ
                        system in just one step.
                    </p>
                    <Link
                        href="/shop/bundles"
                        className="hidden xl:inline-flex items-center justify-center h-[41px] w-[159px] bg-black rounded-[21px] font-aeonik text-white-custom text-[14px] hover:bg-white-custom hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-700 shrink-0"
                    >
                        VIEW OUR BUNDLES
                    </Link>
                </div>

                <p className="font-aeonik text-black text-[16px] xl:text-[18px] leading-[1.2] mb-10 md:hidden">
                    Curated combinations of products that work together – for strength,
                    performance, recovery and everyday health.
                </p>

                {bundles.length > 0 && (
                    <>
                        {/* Row 1: two equal cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {bundles[0] && <BundleCard {...bundles[0]} />}
                            {bundles[1] && <BundleCard {...bundles[1]} />}
                        </div>

                        {/* Row 2: vertical card narrower, horizontal card wider */}
                        {(bundles[2] || bundles[3]) && (
                            <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 mt-6">
                                {bundles[2] && <BundleCard {...bundles[2]} variant="vertical" />}
                                {bundles[3] && <BundleCard {...bundles[3]} />}
                            </div>
                        )}
                    </>
                )}

                <div className="mt-8 flex justify-center xl:hidden">
                    <Link
                        href="/shop/bundles"
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
