"use client"

import { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Link } from "@/i18n/navigation";
import { useCartStore, makeCartId } from "@/store/cart-store";
import { useFavouritesStore } from "@/store/favourites-store";
import { useFavouritesHydrated } from "@/hooks/use-favourites-hydrated";
import { formatPrice } from "@/utils/formatPrice";

const BundleCard = ({
    _id,
    slug,
    title,
    products = [],
    description,
    bundlePrice,
    saleBundlePrice,
    imageUrl,
    variant = "horizontal",
}) => {
    const [isAdding, setIsAdding] = useState(false)
    const { addToCart, cartItems } = useCartStore()

    const { isLoaded, isSignedIn } = useUser()
    const favHydrated = useFavouritesHydrated()
    const isFav = useFavouritesStore((s) => s.ids.includes(_id))
    const toggleFavourite = useFavouritesStore((s) => s.toggleFavourite)
    const favourited = favHydrated && isFav

    const handleToggleFavourite = async () => {
        if (!isLoaded) return
        if (!isSignedIn) {
            toast.error("Please sign in to save favourites.")
            return
        }
        const result = await toggleFavourite(_id)
        if (result?.error === "unauthenticated") {
            toast.error("Please sign in to save favourites.")
        } else if (result && !result.ok) {
            toast.error("Could not update your wishlist. Please try again.")
        }
    }

    const favouriteButton = (
        <button
            type="button"
            onClick={handleToggleFavourite}
            aria-label={favourited ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={favourited}
            className="ml-1 w-7 h-7 rounded-full border border-black-custom/25 flex items-center justify-center shrink-0 cursor-pointer transition-transform duration-300 hover:scale-110"
        >
            <Heart
                size={14}
                strokeWidth={1.5}
                className={`transition-colors duration-300 ${favourited ? "fill-orange-accent text-orange-accent" : "text-black-custom"}`}
            />
        </button>
    )

    const effectivePrice = saleBundlePrice ?? bundlePrice

    const cartId = makeCartId(_id)
    const cartQty = cartItems.find((i) => i.cartId === cartId)?.qty ?? 0
    const maxBundleQty = products.reduce((min, item) => {
        if (!item.product || item.product.inventory == null) return min
        return Math.min(min, Math.floor(item.product.inventory / item.quantity))
    }, Infinity)
    const atMax = maxBundleQty !== Infinity && cartQty >= maxBundleQty

    const displayImages = imageUrl
        ? [imageUrl]
        : products.map(p => p.product?.imageUrl).filter(Boolean)

    const handleAddToCart = async () => {
        if (!_id || !effectivePrice) return
        setIsAdding(true)
        const result = await addToCart({
            id: _id,
            type: "bundle",
            slug,
            name: title,
            subtitle: products
                .map(item => item.product?.title ? `${item.quantity}x ${item.product.title}` : null)
                .filter(Boolean),
            price: effectivePrice,
            image: imageUrl ?? displayImages[0] ?? "",
            flavour: "",
        })
        setIsAdding(false)
        if (result?.error === "out_of_stock" || result?.error === "max_quantity") {
            toast.error("Maximum available quantity reached.")
        } else if (result?.error === "failed") {
            toast.error("Failed to add to bag. Please try again.")
        }
    }

    const priceBlock = (
        <div className="flex items-end gap-2">
            <span className="font-tt font-light text-[42px] xl:text-[48px] text-black-custom leading-none">
                {saleBundlePrice ? `€${formatPrice(saleBundlePrice)}` : `€${formatPrice(bundlePrice)}`}
            </span>
            {saleBundlePrice && (
                <span className="font-tt text-[20px] text-black-custom/50 line-through leading-none mb-2">
                    €{formatPrice(bundlePrice)}
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
                        height: variant === "mobile" ? "220px" : variant === "vertical" ? "clamp(280px, 25vw, 380px)" : "clamp(300px, 28vw, 420px)",
                        marginLeft: i > 0 ? "-2rem" : 0,
                        zIndex: displayImages.length - i,
                    }}
                />
            ))}
        </div>
    )

    if (variant === "mobile") {
        return (
            <div className="relative bg-gray-mint rounded-[150px] px-5 pt-9 pb-20 flex flex-col">
                <div className="mb-2">
                    {imageStack}
                </div>

                <h3 className="font-aeonik text-[24px] text-black-custom leading-[1.15] mb-3">
                    {title}
                </h3>
                {productNames}
                <p className="font-aeonik text-[13px] text-black-custom leading-[1.4] opacity-70 mt-4">
                    {description}
                </p>

                <div className="flex items-end justify-between mt-6">
                    <span className="font-tt font-light text-[42px] text-black-custom leading-none">
                        {formatPrice(effectivePrice).replace(",00", "")}€
                    </span>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${atMax ? "bg-red-400" : "bg-teal-accent"}`} />
                        <span className="font-aeonik text-[13px] text-black-custom">{atMax ? "OUT OF STOCK" : "IN STOCK"}</span>
                        {favouriteButton}
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding || atMax}
                        className="flex-1 h-7 xl:h-11 bg-black-custom rounded-[21px] font-aeonik text-white-custom cursor-pointer text-[13px] hover:bg-white-custom hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {atMax ? "MAX QTY REACHED" : isAdding ? "ADDING..." : "ADD TO BAG"}
                    </button>
                    <Link
                        href={`/shop/bundle/${slug}`}
                        className="flex-1 h-7 xl:h-11 bg-white-custom rounded-[21px] font-aeonik text-black-custom text-[13px] hover:bg-gray-soft transition-colors duration-500 flex items-center justify-center"
                    >
                        VIEW DETAILS
                    </Link>
                </div>
            </div>
        )
    }

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
                        <p className="font-aeonik text-[13px] xl:text-[18px] text-black-custom leading-[1.4] max-w-72.5 opacity-90">
                            {description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        {priceBlock}
                        <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${atMax ? "bg-red-400" : "bg-teal-accent"}`} />
                            <span className="font-aeonik text-[13px] text-black-custom">{atMax ? "OUT OF STOCK" : "IN STOCK"}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-3">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding || atMax}
                            className="flex-1 h-10 bg-black-custom rounded-[21px] font-aeonik text-white-custom cursor-pointer text-[14px] hover:bg-gray-mint hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {atMax ? "MAX QTY REACHED" : isAdding ? "ADDING..." : "ADD TO BAG"}
                        </button>
                        <Link
                            href={`/shop/bundle/${slug}`}
                            className="flex-1 h-10 bg-white-custom rounded-[21px] font-aeonik text-black-custom text-[14px] hover:bg-gray-mint hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 flex items-center justify-center"
                        >
                            VIEW DETAILS
                        </Link>
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
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${atMax ? "bg-red-400" : "bg-teal-accent"}`} />
                            <span className="font-aeonik text-[13px] text-black-custom">{atMax ? "OUT OF STOCK" : "IN STOCK"}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-37.5">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding || atMax}
                            className="w-full h-11.25 bg-black-custom rounded-[20px] font-aeonik text-white-custom cursor-pointer text-[14px] hover:bg-gray-mint hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {atMax ? "MAX QTY REACHED" : isAdding ? "ADDING..." : "ADD TO BAG"}
                        </button>
                        <Link
                            href={`/shop/bundle/${slug}`}
                            className="w-full h-11.25 bg-white-custom rounded-[20px] font-aeonik text-black-custom text-[14px] hover:bg-gray-mint hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 flex items-center justify-center"
                        >
                            VIEW DETAILS
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BundleCard
