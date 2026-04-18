import Image from "next/image";

const LOVE_ICON = "/icons/love-icon.svg";

const ProductCard = ({ product, priority = false }) => {
    return (
        <div className="group/card flex flex-col gap-4 relative">

            {/* Image area */}
            <div className="relative bg-white rounded-sm overflow-hidden" style={{ aspectRatio: "1/1.2" }}>

                {/* Hover oval background */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] aspect-[375/572] bg-gray-soft rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ease-in-out z-0" />

                <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={380}
                    unoptimized={true}
                    priority={priority}
                    sizes="(min-width: 1536px) 533px, (min-width: 768px) 50vw, 100vw"
                    quality={100}
                    className="relative z-[1] w-full h-full object-contain p-24"
                />

                {product.badge && (
                    <span className="absolute bottom-40 right-4 z-10 bg-orange-accent text-white text-[13px] font-aeonik px-3 py-1 rounded-full">
                        {product.badge}
                    </span>
                )}
            </div>
            
            <div className="flex justify-between items-center">
                {/* Stock indicator */}
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-accent shrink-0" />
                    <span className="font-aeonik text-[13px] text-black">IN STOCK</span>
                </div>

                {/* Wishlist */}
                <button
                    aria-label="Add to wishlist"
                >
                    <Image
                        src={LOVE_ICON}
                        alt="Love icon"
                        width={36}
                        height={36}
                        sizes="36px"
                        className="w-full h-full"
                    />
                </button>
            </div>

            <div className="flex justify-between items-center">
                {/* Product name */}
                <h3 className="font-aeonik text-[20px] text-black-custom leading-[1.45]">
                    {product.name}
                </h3>
                {/* Price */}
                <span className="font-tt text-[24px] text-black-custom font-semibold">{product.price}</span>
            </div>

            {/* Divider */}
            <hr className="border-black-custom" />

            {/* Details + Buttons */}
            <div className="relative">
                {/* Details */}
                <div className="flex justify-between opacity-100 transition-opacity duration-500 ease-in-out group-hover/card:opacity-0 group-hover/card:pointer-events-none">
                    <div className="font-tt font-light text-[18px] text-black-custom leading-[1.2]">
                        <p>{product.detail1}</p>
                        <p>{product.detail2}</p>
                    </div>
                    <div className="font-tt font-light text-[18px] text-black-custom text-right leading-[1.2]">
                        <p>{product.detail3}</p>
                        <p>{product.detail4}</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="absolute inset-0 flex gap-3 opacity-0 translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-500 ease-in-out">
                    <button className="flex-1 h-[45px] bg-black-custom rounded-[20px] font-aeonik text-white-custom text-[16px] cursor-pointer hover:bg-white-custom hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 ease-in-out">
                        ADD TO BAG
                    </button>
                    <button className="flex-1 h-[45px] bg-gray-soft rounded-[20px] font-aeonik text-black-custom text-[16px] cursor-pointer hover:bg-white-custom hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 ease-in-out">
                        VIEW DETAILS
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
