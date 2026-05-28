import { Link } from "@/i18n/navigation"
import FeaturedProductsSlider from "./featured-products-slider";
import { getFeaturedProducts } from "@/sanity/getData/getFeaturedProducts";


const FeaturedProducts = async ({ compact = false, locale }) => {
    const products = await getFeaturedProducts(locale)

    if (!products.length) return null

    return (
        <section
            id="featured-products-section"
            className="w-full bg-white py-16 xl:py-24"
        >
            <div className="max-w-480 mx-auto page-x pt-20">

                {/* Header */}
                {!compact && (
                    <div className="flex items-start justify-between mb-6">
                        <h2 className="font-aeonik text-black-custom text-[28px] xl:text-[35px] leading-none">
                            Featured Products
                        </h2>

                        <p className="font-aeonik text-black-custom text-[16px] xl:text-[18px] leading-[1.45] max-w-163 mb-12">
                            A focused line of science-driven formulas for strength, performance,
                            recovery and everyday health. Explore all our series, flavours and
                            formats to build the system that works for your body and training.
                        </p>

                        <Link
                            href="/shop/shop-all"
                            className="hidden xl:inline-flex items-center justify-center h-10.25 w-35 bg-black rounded-[20.5px] font-aeonik text-white text-[14px] hover:bg-white-custom hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 ease-in-out shrink-0 self-center"
                        >
                            SHOP ALL
                        </Link>
                    </div>
                )}

                <FeaturedProductsSlider products={products} />

                {/* "Shop All" button — mobile only */}
                {!compact && (
                    <div className="mt-10 flex justify-center xl:hidden">
                        <Link
                            href="/shop/shop-all"
                            className="inline-flex items-center justify-center h-10.25 w-35 bg-black rounded-[21px] font-aeonik text-white text-[14px] hover:bg-white-custom hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 ease-in-out"
                        >
                            SHOP ALL
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}

export default FeaturedProducts
