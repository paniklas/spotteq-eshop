import Image from "next/image";

const BundleCard = ({
    title,
    products,
    description,
    price,
    images,
    variant = "horizontal",
}) => {
    const productList = products.split(" · ");

    if (variant === "vertical") {
        return (
            <div className="group relative rounded-[190px] p-8 xl:p-10 overflow-hidden flex flex-col min-h-[520px]">
                {/* Background — blurs on hover */}
                <div className="absolute inset-0 bg-gray-mint transition-[filter,opacity] duration-300 group-hover:bg-gray-mint/80 group-hover:blur-[7.5px]" />

                {/* Top: product images */}
                <div className="relative z-[1] flex items-end justify-center pt-10 px-8 gap-0">
                    {images.map((src, i) => (
                        <Image
                            key={i}
                            src={src}
                            alt=""
                            width={160}
                            height={240}
                            sizes="200px"
                            unoptimized={true}
                            quality={100}
                            className="object-contain h-[300px] xl:h-[380px] w-auto"
                            style={{
                                marginLeft: i > 0 ? "-2rem" : 0,
                                zIndex: images.length - i,
                            }}
                        />
                    ))}
                </div>

                {/* Bottom: content */}
                <div className="relative z-[1] flex flex-col flex-1 p-8 xl:p-10">
                    <div className="flex-1">
                        <h3 className="font-aeonik text-[22px] xl:text-[28px] text-black-custom leading-[1.2] mb-3">
                            {title}
                        </h3>
                        <div className="mb-3">
                            {productList.map((p) => (
                                <p
                                    key={p}
                                    className="font-aeonik text-[15px] xl:text-[22px] text-black-custom leading-snug opacity-90"
                                >
                                    {p}
                                </p>
                            ))}
                        </div>
                        <p className="font-aeonik text-[13px] xl:text-[18px] text-black-custom leading-[1.4] max-w-[290px] opacity-90">
                            {description}
                        </p>
                    </div>

                    {/* Price + in stock + heart in a row */}
                    <div className="flex items-center justify-between mt-6">
                        <span className="font-tt font-light text-[42px] xl:text-[48px] text-black-custom leading-none">
                            {price}
                        </span>
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

                    {/* Two buttons side by side */}
                    <div className="flex gap-3 mt-3">
                        <button className="flex-1 h-[40px] bg-black-custom rounded-[21px] font-aeonik text-white-custom cursor-pointer text-[14px] hover:bg-gray-mint hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500">
                            ADD TO BAG
                        </button>
                        <button className="flex-1 h-[40px] bg-white-custom rounded-[21px] font-aeonik text-black-custom cursor-pointer text-[14px] hover:bg-gray-mint hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500">
                            VIEW DETAILS
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative rounded-[190px] p-8 xl:p-18 flex flex-row overflow-hidden min-h-[420px] gap-6 xl:gap-10">
            {/* Background — blurs on hover */}
            <div className="absolute inset-0 bg-gray-mint transition-[filter,opacity] duration-300 group-hover:bg-gray-mint/80 group-hover:blur-[7.5px]" />

            {/* Left: Product images */}
            <div className="relative z-[1] flex items-center justify-center">
                <div className="flex items-end justify-center">
                    {images.map((src, i) => (
                        <Image
                            key={i}
                            src={src}
                            alt=""
                            width={100}
                            height={280}
                            sizes="200px"
                            quality={100}
                            unoptimized={true}
                            className="object-contain h-[400px] xl:h-[420px] w-auto"
                            style={{
                                marginLeft: i > 0 ? "-2rem" : 0,
                                zIndex: images.length - i,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Right: Content */}
            <div className="relative z-[1] flex-1 flex flex-col">
                {/* Top: title, products, description */}
                <div className="flex-1 flex flex-col">
                    <h3 className="font-aeonik text-[22px] xl:text-[28px] text-black-custom leading-[1.2] mb-3">
                        {title}
                    </h3>
                    <div className="mb-3">
                        {productList.map((p) => (
                            <p key={p} className="font-aeonik text-[15px] xl:text-[22px] text-black-custom leading-snug opacity-90">
                                {p}
                            </p>
                        ))}
                    </div>
                    <p className="font-aeonik text-[13px] xl:text-[18px] text-black-custom leading-[1.4] opacity-70">
                        {description}
                    </p>
                </div>

                {/* Bottom row: price/info left — buttons right */}
                <div className="flex items-end justify-between gap-4 xl:gap-10 mt-6">
                    {/* Left: price, in stock, heart */}
                    <div className="flex flex-col gap-2">
                        <span className="font-tt font-light text-[42px] xl:text-[48px] text-black-custom leading-none">
                            {price}
                        </span>
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

                    {/* Right: buttons */}
                    <div className="flex flex-col gap-2 min-w-[150px]">
                        <button className="w-full h-[45px] bg-black-custom rounded-[20px] font-aeonik text-white-custom cursor-pointer text-[14px] hover:bg-gray-mint hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500">
                            ADD TO BAG
                        </button>
                        <button className="w-full h-[45px] bg-white-custom rounded-[20px] font-aeonik text-black-custom text-[14px] hover:bg-gray-mint cursor-pointer hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500">
                            VIEW DETAILS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BundleCard
