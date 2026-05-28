"use client"

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/lib/image";
import { toast } from "sonner";
import { useCartStore, makeCartId } from "@/store/cart-store";


const LOVE_ICON = "/icons/love-icon.svg";

const ProductCard = ({ product, priority = false }) => {
    const [isAdding, setIsAdding] = useState(false)
    const { addToCart, cartItems } = useCartStore()

    const attrs = product.attributes ?? [
        { label: product.subtitleLine1, value: product.size },
        { label: product.flavourName, value: product.tagline },
    ].filter(a => a.label || a.value);

    const imageSrc = typeof product.image === 'string'
        ? product.image
        : product.image ? urlFor(product.image).width(600).url() : null

    const productName = product.name ?? product.title
    const productSlug = product.slug ?? product.id

    const cartId = makeCartId(product._id)
    const cartQty = cartItems.find((i) => i.cartId === cartId)?.qty ?? 0
    const atMax = product.inventory != null && cartQty >= product.inventory

    const handleAddToCart = async () => {
        if (atMax) return
        setIsAdding(true)
        const result = await addToCart({
            id: product._id,
            name: productName,
            slug: product.slug ?? productSlug,
            subtitle: [product.subtitleLine1].filter(Boolean),
            price: product.price,
            image: imageSrc,
            flavour: product.flavourName || "",
        })
        setIsAdding(false)
        if (result?.error === "out_of_stock") {
            toast.error("This product is out of stock.")
        } else if (result?.error === "max_quantity") {
            toast.error("Maximum available quantity reached.")
        } else if (result?.error === "failed") {
            toast.error("Failed to add to bag. Please try again.")
        }
    }

    return (
        <div className="group/card flex flex-col gap-4 relative">
            {/* Image area */}
            <div className="relative bg-white rounded-sm overflow-hidden" style={{ aspectRatio: "1/1.2" }}>

                {/* Hover oval background */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] aspect-375/572 bg-gray-soft rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ease-in-out z-0" />
                <Image
                    src={imageSrc}
                    alt={productName}
                    width={300}
                    height={380}
                    unoptimized={true}
                    priority={priority}
                    sizes="(min-width: 1536px) 533px, (min-width: 768px) 50vw, 100vw"
                    quality={100}
                    className="relative z-1 w-full h-full object-contain p-24"
                />
            </div>

            <div className="flex justify-between items-center relative">
                {product.badge && (
                    <span className="absolute -top-10 right-0 bg-orange-accent text-white text-[12px] xl:text-[14px] font-aeonik px-3 py-1 rounded-full leading-none">
                        {product.badge}
                    </span>
                )}
                {/* Stock indicator */}
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-accent shrink-0" />
                    <span className="font-aeonik text-[13px] text-black">IN STOCK</span>
                </div>

                {/* Wishlist */}
                <button aria-label="Add to wishlist">
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
                    {productName}
                </h3>
                {/* Price */}
                <span className="font-tt text-[24px] text-black-custom font-semibold">{product.price}€</span>
            </div>

            {/* Divider */}
            <hr className="border-black-custom" />

            {/* Details + Buttons */}
            <div className="relative">
                {/* Details */}
                <div className="flex justify-between opacity-100 transition-opacity duration-500 ease-in-out group-hover/card:opacity-0 group-hover/card:pointer-events-none">
                    <div className="font-tt font-light text-[18px] text-black-custom leading-[1.2]">
                        {attrs.map((attr, i) => (
                            <p key={i}>{attr.label}</p>
                        ))}
                    </div>
                    <div className="font-tt font-light text-[18px] text-black-custom text-right leading-[1.2]">
                        {attrs.map((attr, i) => (
                            <p key={i}>{attr.value}</p>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="absolute inset-0 flex gap-3 opacity-0 translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-500 ease-in-out">
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding || atMax}
                        className="flex-1 h-11.25 bg-black-custom rounded-[20px] font-aeonik text-white-custom text-[16px] cursor-pointer hover:bg-white-custom hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {atMax ? "MAX QTY REACHED" : isAdding ? "ADDING..." : "ADD TO BAG"}
                    </button>
                    <Link
                        href={`/shop/product/${productSlug}`}
                        className="flex-1 h-11.25 bg-gray-soft rounded-[20px] font-aeonik text-black-custom text-[16px] cursor-pointer hover:bg-white-custom hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 ease-in-out flex items-center justify-center"
                    >
                        VIEW DETAILS
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
