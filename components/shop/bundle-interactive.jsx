"use client"

import { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useCartStore, makeCartId } from "@/store/cart-store";
import { PortableText } from "@portabletext/react";
import { Link } from "@/i18n/navigation";


const BundleInteractive = ({ bundle }) => {
    const [isAdding, setIsAdding] = useState(false)
    const [wishlisted, setWishlisted] = useState(false)
    const [currentImage, setCurrentImage] = useState(0)
    const { addToCart, cartItems } = useCartStore()

    const effectivePrice = bundle.saleBundlePrice ?? bundle.bundlePrice
    const cartId = makeCartId(bundle._id, "")
    const cartQty = cartItems.find((i) => i.cartId === cartId)?.qty ?? 0

    const maxBundleQty = bundle.products?.reduce((min, item) => {
        if (!item.product || item.product.inventory == null) return min
        return Math.min(min, Math.floor(item.product.inventory / item.quantity))
    }, Infinity) ?? Infinity
    const atMax = maxBundleQty !== Infinity && cartQty >= maxBundleQty

const galleryImages = bundle.galleryImageUrls ?? []
    const displayImages = [
        ...(bundle.imageUrl ? [bundle.imageUrl] : []),
        ...galleryImages,
    ].filter(Boolean).length > 0
        ? [...(bundle.imageUrl ? [bundle.imageUrl] : []), ...galleryImages].filter(Boolean)
        : bundle.products?.map(p => p.product?.imageUrl).filter(Boolean) ?? []

    const prevImage = () =>
        setCurrentImage((i) => (i === 0 ? displayImages.length - 1 : i - 1))
    const nextImage = () =>
        setCurrentImage((i) => (i === displayImages.length - 1 ? 0 : i + 1))

    const handleAddToCart = async () => {
        setIsAdding(true)
        const result = await addToCart({
            id: bundle._id,
            type: "bundle",
            slug: bundle.slug,
            name: bundle.title,
            subtitle: bundle.products
                ?.map(item => item.product?.title ? `${item.quantity}x ${item.product.title}` : null)
                .filter(Boolean) ?? [],
            price: effectivePrice,
            image: bundle.imageUrl ?? "",
            flavour: "",
        })
        setIsAdding(false)
        if (result?.error === "failed") {
            toast.error("Failed to add to bag. Please try again.")
        }
    }

    return (
        <div className="bg-white-custom pt-40 pb-20">
            <div className="max-w-480 mx-auto page-x">

                {/* Back button — above the two columns */}
                <Link href="/shop/shop-all">
                    <button className="group flex items-center w-fit cursor-pointer mb-6">
                        <Image
                            src="/icons/arrow-left.svg"
                            alt=""
                            width={36}
                            height={36}
                            className="transition-transform duration-300 group-hover:-translate-x-1"
                        />
                        <span className="relative font-aeonik text-[14px] xl:text-[16px] text-black-custom">
                            Back
                            <span className="absolute bottom-0 left-0 h-px w-0 bg-black-custom group-hover:w-full transition-all duration-500 ease-out" />
                        </span>
                    </button>
                </Link>

                <div className="product-page-glow" style={{ top: "35%", right: "-120px", transform: "translateY(-50%)" }} />

                {/* Two columns — image height only drives alignment */}
                <div className="flex flex-col md:flex-row gap-12 xl:gap-20 items-center relative">

                    {/* Left: image circle only */}
                    <div className="w-full md:w-1/2">
                        <div className="relative flex items-center justify-center">
                            {displayImages.length > 1 && (
                                <button
                                    onClick={prevImage}
                                    aria-label="Previous image"
                                    className="absolute left-0 z-10 p-2 text-black-custom cursor-pointer hover:opacity-60 transition-opacity duration-200"
                                >
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.46967 19.4697C9.17678 19.7626 9.17678 20.2374 9.46967 20.5303L14.2426 25.3033C14.5355 25.5962 15.0104 25.5962 15.3033 25.3033C15.5962 25.0104 15.5962 24.5355 15.3033 24.2426L11.0607 20L15.3033 15.7574C15.5962 15.4645 15.5962 14.9896 15.3033 14.6967C15.0104 14.4038 14.5355 14.4038 14.2426 14.6967L9.46967 19.4697ZM30 20L30 19.25L10 19.25L10 20L10 20.75L30 20.75L30 20Z" fill="black"/>
                                    </svg>
                                </button>
                            )}

                            <div className="relative w-full aspect-square mx-auto flex items-center justify-center">
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] aspect-375/572 bg-gray-soft rounded-full z-0" />
                                {displayImages.length > 0 && (
                                    <Image
                                        key={currentImage}
                                        src={displayImages[currentImage]}
                                        alt={bundle.title}
                                        width={420}
                                        height={420}
                                        unoptimized
                                        priority
                                        className="w-[72%] h-[72%] object-contain relative z-1"
                                    />
                                )}
                            </div>

                            {displayImages.length > 1 && (
                                <button
                                    onClick={nextImage}
                                    aria-label="Next image"
                                    className="absolute right-0 z-10 p-2 text-black-custom cursor-pointer hover:opacity-60 transition-opacity duration-200"
                                >
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M30.5303 20.5303C30.8232 20.2374 30.8232 19.7626 30.5303 19.4697L25.7574 14.6967C25.4645 14.4038 24.9896 14.4038 24.6967 14.6967C24.4038 14.9896 24.4038 15.4645 24.6967 15.7574L28.9393 20L24.6967 24.2426C24.4038 24.5355 24.4038 25.0104 24.6967 25.3033C24.9896 25.5962 25.4645 25.5962 25.7574 25.3033L30.5303 20.5303ZM10 20L10 20.75L30 20.75L30 20L30 19.25L10 19.25L10 20Z" fill="black"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: details */}
                    <div className="w-full md:w-1/2 flex flex-col gap-6">

                        {bundle.badge && (
                            <span className="inline-flex w-fit bg-orange-accent text-white font-aeonik text-[12px] xl:text-[14px] uppercase px-4 py-1 rounded-full">
                                {bundle.badge}
                            </span>
                        )}

                        <h1 className="font-aeonik text-[40px] xl:text-[50px] leading-none text-black-custom">
                            {bundle.title}
                        </h1>

                        {/* Constituent products */}
                        {bundle.products?.length > 0 && (
                            <div className="flex flex-col gap-1">
                                {bundle.products.map((item, i) => (
                                    item.product?.title && (
                                        <div key={item.product._id ?? i} className="flex justify-between items-center">
                                            <span className="font-aeonik text-[16px] xl:text-[24px] text-black-custom leading-tight">
                                                {item.product.title}
                                            </span>
                                            <span className="font-aeonik text-[16px] xl:text-[18px] text-black-custom/60">
                                                <span className="text-[14px]">Quantity:</span>x{item.quantity}
                                            </span>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}

                        {bundle.description && (
                            <p className="font-aeonik text-[14px] xl:text-[18px] text-black-custom leading-tight">
                                {bundle.description}
                            </p>
                        )}

                        {/* Price + stock + wishlist */}
                        <div className="flex items-center gap-4 flex-wrap border-t border-gray-mint pt-4">
                            <div className="flex items-baseline gap-2">
                                <span className="font-tt text-[32px] text-black-custom">
                                    {effectivePrice}€
                                </span>
                                {bundle.saleBundlePrice && (
                                    <span className="font-tt text-[20px] text-black-custom/40 line-through">
                                        {bundle.bundlePrice}€
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 ml-auto">
                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${atMax ? "bg-red-400" : "bg-teal-accent"}`} />
                                <span className="font-aeonik text-[12px] uppercase tracking-wide text-black-custom">
                                    {atMax ? "Out of Stock" : "In Stock"}
                                </span>
                            </div>

                            <button
                                onClick={() => setWishlisted((v) => !v)}
                                aria-label="Add to wishlist"
                                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-mint hover:border-black-custom transition-colors duration-300 cursor-pointer"
                            >
                                <Heart
                                    size={16}
                                    strokeWidth={1.5}
                                    className={wishlisted ? "fill-black-custom" : ""}
                                />
                            </button>
                        </div>

                        {/* CTA */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding || atMax}
                                className="flex-1 h-12 bg-black-custom rounded-full font-aeonik text-[12px] xl:text-[16px] uppercase text-white-custom hover:bg-gray-text transition-colors duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {atMax ? "MAX QTY REACHED" : isAdding ? "ADDING..." : "ADD TO BAG"}
                            </button>
                            <button className="flex-1 h-12 bg-gray-mint rounded-full font-aeonik text-[12px] xl:text-[16px] uppercase text-black-custom hover:bg-white-custom hover:border hover:border-black-custom transition-colors duration-300 cursor-pointer">
                                QUICK BUY
                            </button>
                        </div>
                    </div>
                </div>

                {/* Certification badges + additional info — left half only */}
                <div className="w-full md:w-1/2 flex flex-col gap-4 mt-4">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/images/certification-badges.png"
                            alt="GMP Certified"
                            width={56}
                            height={56}
                            unoptimized={true}
                            className="w-60 h-60 object-contain"
                        />
                    </div>

                    {bundle.productDetails?.additionalInfo?.length > 0 && (
                        <div className="font-aeonik text-[28px] xl:text-[35px] leading-normal text-black-custom [&_p]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
                            <PortableText value={bundle.productDetails.additionalInfo} />
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default BundleInteractive
