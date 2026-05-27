import Image from "next/image";

const BundleCard = ({
    title,
    products = [],
    description,
    bundlePrice,
    saleBundlePrice,
    imageUrl,
    variant = "horizontal",
}) => {
    const displayImages = imageUrl
        ? [imageUrl]
        : products.map(p => p.product?.imageUrl).filter(Boolean)

    const priceBlock = (
        <div className="flex items-end gap-2">
            <span className="font-tt font-light text-[42px] xl:text-[48px] text-black-custom leading-none">
                {saleBundlePrice ? `€${saleBundlePrice}` : `€${bundlePrice}`}
            </span>
            {saleBundlePrice && (
                <span className="font-tt text-[20px] text-black-custom/50 line-through leading-none mb-2">
                    €{bundlePrice}
                </span>
            )}
        </div>
    )

    const productNames = (
        <div className="mb-3">
            {products.map((item, i) => (
                <p key={item.product?._id ?? i} className="font-aeonik text-[15px] xl:text-[22px] text-black-custom leading-snug opacity-90">
                    {item.product?.title}
                </p>
            ))}
        </div>
    )

    const imageStack = (
        <div className="flex items-end justify-center gap-0">
            {displayImages.map((src, i) => (
                <Image
                    key={i}
                    src={src}
                    alt=""
                    width={160}
                    height={280}
                    sizes="200px"
                    unoptimized
                    className="object-contain w-auto"
                    style={{
                        height: variant === "vertical" ? "clamp(280px, 25vw, 380px)" : "clamp(300px, 28vw, 420px)",
                        marginLeft: i > 0 ? "-2rem" : 0,
                        zIndex: displayImages.length - i,
                    }}
                />
            ))}
        </div>
    )

    if (variant === "vertical") {
        return (
            <div className="group relative rounded-[190px] p-8 xl:p-10 overflow-hidden flex flex-col min-h-130">
                <div className="absolute inset-0 bg-gray-mint transition-[filter,opacity] duration-300 group-hover:bg-gray-mint/80 group-hover:blur-[7.5px]" />

                <div className="relative z-[1] flex items-end justify-center pt-10 px-8">
                    {imageStack}
                </div>

                <div className="relative z-[1] flex flex-col flex-1 p-8 xl:p-10">
                    <div className="flex-1">
                        <h3 className="font-aeonik text-[22px] xl:text-[28px] text-black-custom leading-[1.2] mb-3">
                            {title}
                        </h3>
                        {productNames}
                        <p className="font-aeonik text-[13px] xl:text-[18px] text-black-custom leading-[1.4] max-w-[290px] opacity-90">
                            {description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        {priceBlock}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-teal-accent shrink-0" />
                                <span className="font-aeonik text-[13px] text-black-custom">IN STOCK</span>
                            </div>
                            <button aria-label="Add to wishlist" className="w-fit p-1 cursor-pointer bg-black rounded-full">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white-custom">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-3">
                        <button className="flex-1 h-10 bg-black-custom rounded-[21px] font-aeonik text-white-custom cursor-pointer text-[14px] hover:bg-gray-mint hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500">
                            ADD TO BAG
                        </button>
                        <button className="flex-1 h-10 bg-white-custom rounded-[21px] font-aeonik text-black-custom cursor-pointer text-[14px] hover:bg-gray-mint hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500">
                            VIEW DETAILS
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="group relative rounded-[190px] p-8 xl:p-18 flex flex-row overflow-hidden min-h-105 gap-6 xl:gap-10">
            <div className="absolute inset-0 bg-gray-mint transition-[filter,opacity] duration-300 group-hover:bg-gray-mint/80 group-hover:blur-[7.5px]" />

            <div className="relative z-1 flex items-center justify-center">
                {imageStack}
            </div>

            <div className="relative z-1 flex-1 flex flex-col">
                <div className="flex-1 flex flex-col">
                    <h3 className="font-aeonik text-[22px] xl:text-[28px] text-black-custom leading-[1.2] mb-3">
                        {title}
                    </h3>
                    {productNames}
                    <p className="font-aeonik text-[13px] xl:text-[18px] text-black-custom leading-[1.4] opacity-70">
                        {description}
                    </p>
                </div>

                <div className="flex items-end justify-between gap-4 xl:gap-10 mt-6">
                    <div className="flex flex-col gap-2">
                        {priceBlock}
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-teal-accent shrink-0" />
                            <span className="font-aeonik text-[13px] text-black-custom">IN STOCK</span>
                        </div>
                        <button aria-label="Add to wishlist" className="w-fit p-1 cursor-pointer bg-black rounded-full">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white-custom">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 min-w-37.5">
                        <button className="w-full h-11.25 bg-black-custom rounded-[20px] font-aeonik text-white-custom cursor-pointer text-[14px] hover:bg-gray-mint hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500">
                            ADD TO BAG
                        </button>
                        <button className="w-full h-11.25 bg-white-custom rounded-[20px] font-aeonik text-black-custom text-[14px] hover:bg-gray-mint cursor-pointer hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500">
                            VIEW DETAILS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BundleCard
