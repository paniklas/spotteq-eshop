"use client"

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { useCartStore, makeCartId } from "@/store/cart-store";

const LOVE_ICON = "/icons/love-icon.svg";

const BundleShopCard = ({ bundle }) => {
    const [isAdding, setIsAdding] = useState(false)
    const { addToCart, cartItems } = useCartStore()

    const effectivePrice = bundle.saleBundlePrice ?? bundle.bundlePrice

    const cartId = makeCartId(bundle._id)
    const cartItem = cartItems.find((i) => i.cartId === cartId)
    const cartQty = cartItem?.qty ?? 0

    const maxBundleQty = bundle.products?.reduce((min, item) => {
        if (!item.product || item.product.inventory == null) return min
        return Math.min(min, Math.floor(item.product.inventory / item.quantity))
    }, Infinity) ?? Infinity
    const atMax = maxBundleQty !== Infinity && cartQty >= maxBundleQty

    const handleAddToCart = async () => {
        setIsAdding(true)
        const result = await addToCart({
            id: bundle._id,
            type: "bundle",
            slug: bundle.slug,
            name: bundle.title,
            subtitle: bundle.products
                .map(item => item.product?.title ? `${item.quantity}x ${item.product.title}` : null)
                .filter(Boolean),
            price: effectivePrice,
            image: bundle.imageUrl ?? "",
            flavour: "",
        })
        setIsAdding(false)
        if (result?.error === "out_of_stock" || result?.error === "max_quantity") {
            toast.error("Maximum available quantity reached.")
        } else if (result?.error === "failed") {
            toast.error("Failed to add to bag. Please try again.")
        }
    }

    return (
        <div className="group/card flex flex-col gap-4 relative">
            {/* Image area */}
            <div className="relative bg-white rounded-sm overflow-hidden" style={{ aspectRatio: "1/1.2" }}>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] aspect-375/572 bg-gray-soft rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ease-in-out z-0" />
                {bundle.imageUrl && (
                    <Image
                        src={bundle.imageUrl}
                        alt={bundle.title}
                        width={300}
                        height={380}
                        unoptimized
                        sizes="(min-width: 1536px) 533px, (min-width: 768px) 50vw, 100vw"
                        className="relative z-1 w-full h-full object-contain p-24"
                    />
                )}
            </div>

            <div className="flex justify-between items-center relative">
                {bundle.badge && (
                    <span className="absolute -top-10 right-0 bg-orange-accent text-white text-[12px] xl:text-[14px] font-aeonik px-3 py-1 rounded-full leading-none">
                        {bundle.badge}
                    </span>
                )}
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${atMax ? "bg-red-400" : "bg-teal-accent"}`} />
                    <span className="font-aeonik text-[13px] text-black">{atMax ? "OUT OF STOCK" : "IN STOCK"}</span>
                </div>
                <button aria-label="Add to wishlist">
                    <Image src={LOVE_ICON} alt="Love icon" width={36} height={36} sizes="36px" className="w-full h-full" />
                </button>
            </div>

            <div className="flex justify-between items-center gap-4">
                <h3 className="font-aeonik text-[20px] text-black-custom leading-[1.45]">
                    {bundle.title}
                </h3>
                <div className="flex items-baseline gap-2 shrink-0">
                    <span className="font-tt text-[24px] text-black-custom font-semibold">{effectivePrice}€</span>
                    {bundle.saleBundlePrice && (
                        <span className="font-tt text-[16px] text-black-custom/40 line-through">{bundle.bundlePrice}€</span>
                    )}
                </div>
            </div>

            <hr className="border-black-custom" />

            {/* Details + Button */}
            <div className="relative">
                {/* Bundle description — visible at rest */}
                <div className="opacity-100 transition-opacity duration-500 ease-in-out group-hover/card:opacity-0 group-hover/card:pointer-events-none">
                    <p className="font-tt font-light text-[16px] text-black-custom leading-[1.4] line-clamp-3">
                        {bundle.description}
                    </p>
                </div>

                {/* Buttons — visible on hover */}
                <div className="absolute inset-0 flex gap-3 opacity-0 translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-500 ease-in-out">
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding || atMax}
                        className="flex-1 h-11.25 bg-black-custom rounded-[20px] font-aeonik text-white-custom text-[16px] cursor-pointer hover:bg-white-custom hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {atMax ? "MAX QTY REACHED" : isAdding ? "ADDING..." : "ADD TO BAG"}
                    </button>
                    <Link
                        href={`/shop/bundle/${bundle.slug}`}
                        className="flex-1 h-11.25 bg-gray-soft rounded-[20px] font-aeonik text-black-custom text-[16px] cursor-pointer hover:bg-white-custom hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 ease-in-out flex items-center justify-center"
                    >
                        VIEW DETAILS
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default BundleShopCard
