import Link from "next/link";
import ProductCard from "./product-card";


const PROTEIN_STRAWBERRY = "/images/products/liposomal-magnesium-1.png";
const MAGNESIUM = "/images/products/liposomal-magnesium-2.png";
const MAGNESIUM_3 = "/images/products/liposomal-magnesium-3.png";


const products = [
    {
        name: "Pure Whey Protein Strawberry",
        price: "40€",
        image: PROTEIN_STRAWBERRY,
        inStock: true,
        detail1: "23,4g Protein",
        detail2: "5,6g BCAAs",
        detail3: "1Kg",
        detail4: "1 - Month Supply",
        badge: null,
    },
    {
        name: "Liposomal Magnesium",
        price: "40€",
        image: MAGNESIUM,
        inStock: true,
        detail1: "93,6 mg 25% NRV",
        detail2: "Vegan",
        detail3: "60 caps",
        detail4: "1 - Month Supply",
        badge: null,
    },
    {
        name: "Hyperfuel®",
        price: "40€",
        image: MAGNESIUM_3,
        inStock: true,
        detail1: "Premium blend",
        detail2: "No fillers",
        detail3: "30 servings",
        detail4: "1 - Month Supply",
        badge: "BESTSELLER",
    },
];

const FeaturedProducts = () => {
    return (
        <section
            id="featured-products-section"
            className="w-full bg-white py-16 xl:py-24"
        >
            <div className="max-w-[1920px] mx-auto page-x">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <h2 className="font-aeonik text-black-custom text-[28px] xl:text-[35px] leading-none">
                        Featured Products
                    </h2>

                    {/* Description */}
                    <p className="font-aeonik text-black-custom text-[16px] xl:text-[18px] leading-[1.45] max-w-[652px] mb-12">
                        A focused line of science-driven formulas for strength, performance,
                        recovery and everyday health. Explore all our series, flavours and
                        formats to build the system that works for your body and training.
                    </p>

                    <Link
                        href="/shop"
                        className="hidden xl:inline-flex items-center justify-center h-[41px] w-[140px] bg-black rounded-[20.5px] font-aeonik text-white text-[14px] hover:bg-white-custom hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 ease-in-out shrink-0 self-center"
                    >
                        SHOP ALL
                    </Link>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-12">
                    {products.map((p, i) => (
                        <ProductCard key={p.name} product={p} priority={i === 0} />
                    ))}
                </div>

                {/* Carousel controls */}
                <div className="flex items-center gap-3 mt-20">
                    {/* Left arrow */}
                    <button aria-label="Previous" className="w-10 h-10 flex items-center justify-center shrink-0 rotate-180 rounded-full hover:bg-gray-mint transition-colors duration-300">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30.5303 20.5303C30.8232 20.2374 30.8232 19.7626 30.5303 19.4697L25.7574 14.6967C25.4645 14.4038 24.9896 14.4038 24.6967 14.6967C24.4038 14.9896 24.4038 15.4645 24.6967 15.7574L28.9393 20L24.6967 24.2426C24.4038 24.5355 24.4038 25.0104 24.6967 25.3033C24.9896 25.5962 25.4645 25.5962 25.7574 25.3033L30.5303 20.5303ZM10 20L10 20.75L30 20.75L30 20L30 19.25L10 19.25L10 20Z" fill="black"/>
                        </svg>

                    </button>
                    {/* Right arrow */}
                    <button aria-label="Next" className="w-10 h-10 flex items-center justify-center shrink-0 rounded-full hover:bg-gray-mint transition-colors duration-300">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30.5303 20.5303C30.8232 20.2374 30.8232 19.7626 30.5303 19.4697L25.7574 14.6967C25.4645 14.4038 24.9896 14.4038 24.6967 14.6967C24.4038 14.9896 24.4038 15.4645 24.6967 15.7574L28.9393 20L24.6967 24.2426C24.4038 24.5355 24.4038 25.0104 24.6967 25.3033C24.9896 25.5962 25.4645 25.5962 25.7574 25.3033L30.5303 20.5303ZM10 20L10 20.75L30 20.75L30 20L30 19.25L10 19.25L10 20Z" fill="black"/>
                        </svg>
                    </button>
                    {/* Progress line */}
                    <div className="flex items-center">
                        <div className="w-[89px] border-t-[3px] border-black" />
                        <div className="w-[89px] border-t border-black/50" />
                        <div className="w-[89px] border-t border-black/50" />
                    </div>
                </div>
                
                {/* "Shop All" button */}
                <div className="mt-10 flex justify-center xl:hidden">
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center h-[41px] w-[140px] bg-black rounded-[21px] font-aeonik text-white text-[14px] hover:bg-white-custom hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 ease-in-out"
                    >
                        SHOP ALL
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default FeaturedProducts