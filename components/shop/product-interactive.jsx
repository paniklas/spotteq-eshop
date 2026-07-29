"use client"

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { ChevronDown, Plus, Minus, Heart, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useCartStore, makeCartId } from "@/store/cart-store";
import { useFavouritesStore } from "@/store/favourites-store";
import { useFavouritesHydrated } from "@/hooks/use-favourites-hydrated";
import { formatPrice } from "@/utils/formatPrice";
import { PortableText } from "@portabletext/react";


const AccordionItem = ({ label, children }) => {
    const [open, setOpen] = useState(false)
    return (
        <div
            className={`border border-gray-mint overflow-hidden ${open ? "rounded-3xl" : "rounded-full"}`}
            style={!open ? { transition: "border-radius 0ms 300ms" } : undefined}
        >
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between px-6 py-2 xl:py-4 font-aeonik text-[13px] xl:text-[16px] uppercase tracking-wide text-black-custom"
            >
                {label}
                <ChevronDown
                    size={18}
                    strokeWidth={1.5}
                    className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                />
            </button>
            <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                    <div className="px-6 pb-5 pt-2 border-t border-gray-mint/40 font-tt text-[14px] xl:text-[16px] text-gray-text leading-relaxed [&_p]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

const ProductInteractive = ({ product, relatedProducts = [], bundleCallouts = [] }) => {
    const router = useRouter()
    const [quantity, setQuantity] = useState(1)
    const [flavourOpen, setFlavourOpen] = useState(false)
    const [currentImage, setCurrentImage] = useState(0)
    const [isAdding, setIsAdding] = useState(false)
    const [isBuying, setIsBuying] = useState(false)
    const { addToCart, cartItems } = useCartStore()

    const { isLoaded, isSignedIn } = useUser()
    const favHydrated = useFavouritesHydrated()
    const isFav = useFavouritesStore((s) => s.ids.includes(product._id))
    const toggleFavourite = useFavouritesStore((s) => s.toggleFavourite)
    const favourited = favHydrated && isFav

    const handleToggleFavourite = async () => {
        if (!isLoaded) return
        if (!isSignedIn) {
            toast.error("Please sign in to save favourites.")
            return
        }
        const result = await toggleFavourite(product._id)
        if (result?.error === "unauthenticated") {
            toast.error("Please sign in to save favourites.")
        } else if (result && !result.ok) {
            toast.error("Could not update your wishlist. Please try again.")
        }
    }

    const displayImages = [
        ...(product.imageUrl ? [product.imageUrl] : []),
        ...(product.galleryImageUrls ?? []),
    ]

    const cartId = makeCartId(product._id)
    const cartQty = cartItems.find((i) => i.cartId === cartId)?.qty ?? 0
    const effectivePrice = product.salePrice ?? product.price
    const remaining = product.inventory != null ? product.inventory - cartQty : Infinity
    const atMax = remaining <= 0
    const incrementDisabled = quantity >= remaining

    const decrement = () => setQuantity((q) => Math.max(1, q - 1))
    const increment = () => setQuantity((q) => Math.min(q + 1, Math.max(1, remaining)))

    // Quick Buy: add this product (with the chosen quantity/flavour) then go
    // straight to checkout, where the cart shows in the order summary.
    const handleQuickBuy = async () => {
        if (atMax || isBuying) return
        setIsBuying(true)
        const result = await addToCart({
            id: product._id,
            type: "product",
            slug: product.slug,
            name: product.title,
            subtitle: product.subtitle,
            price: effectivePrice,
            image: displayImages[0] ?? "",
            flavour: product.flavourName ?? "",
        }, quantity, { openDrawer: false })
        if (result?.error === "out_of_stock") {
            toast.error("This product is out of stock.")
            setIsBuying(false)
        } else if (result?.error === "max_quantity") {
            toast.error(`Maximum available quantity reached (${product.inventory}).`)
            setIsBuying(false)
        } else if (result?.error === "failed") {
            toast.error("Failed to add to bag. Please try again.")
            setIsBuying(false)
        } else {
            // Success — navigate to checkout (leave isBuying set; the page unmounts).
            router.push("/checkout")
        }
    }

    const prevImage = () =>
        setCurrentImage((i) => (i === 0 ? displayImages.length - 1 : i - 1))
    const nextImage = () =>
        setCurrentImage((i) => (i === displayImages.length - 1 ? 0 : i + 1))

    return (
        <div className="bg-white-custom pt-20 xl:pt-40 pb-20">
            <div className="max-w-480 mx-auto page-x">
                <div className="flex flex-col md:flex-row gap-16 xl:gap-20 items-start">

                    <div className="hidden xl:block product-page-glow" style={{ top: '35%', right: '0px', transform: 'translateY(-50%)' }} />

                    {/* ── LEFT: Image + Certs + Tagline ── */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">

                        {/* Back button */}
                        <button onClick={() => router.back()} className="group flex items-center w-fit cursor-pointer">
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

                        {/* Image circle with navigation */}
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
                                        alt={product.title}
                                        width={420}
                                        height={420}
                                        unoptimized={true}
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

                        {/* Certification badges — desktop (moves under highlights on mobile) */}
                        <div className="hidden md:flex items-center gap-4">
                            <Image
                                src="/images/certification-badges.png"
                                alt="GMP Certified"
                                width={56}
                                height={56}
                                unoptimized={true}
                                className="xl:w-60 xl:h-60 object-contain"
                            />
                        </div>

                        {/* Additional information */}
                        {product.productDetails?.additionalInfo?.length > 0 && (
                            <div className="hidden xl:block font-aeonik text-[14px] xl:text-[35px] leading-snug xl:leading-normal text-black-custom [&_p]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
                                <PortableText value={product.productDetails.additionalInfo} />
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Product details ── */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4 xl:gap-6">

                        {/* Badge — desktop, above the name */}
                        {product.badge && (
                            <span className="hidden md:inline-flex w-fit bg-orange-accent text-white font-aeonik text-[12px] xl:text-[14px] uppercase px-4 py-1 rounded-full">
                                {product.badge}
                            </span>
                        )}

                        {/* Name + size */}
                        <div className="flex flex-col md:flex-row md:items-baseline md:gap-4 md:flex-wrap">
                            <div className="flex items-start justify-between gap-4">
                                <h1 className="font-aeonik text-[35px] xl:text-[50px] leading-none text-black-custom">
                                    {product.title}
                                </h1>
                                {/* Wishlist — mobile, beside the title */}
                                <button
                                    type="button"
                                    onClick={handleToggleFavourite}
                                    aria-label={favourited ? "Remove from wishlist" : "Add to wishlist"}
                                    aria-pressed={favourited}
                                    className="md:hidden w-9 h-9 shrink-0 flex items-center justify-center rounded-full border border-gray-mint hover:border-black-custom transition-colors duration-300 cursor-pointer"
                                >
                                    <Heart
                                        size={16}
                                        strokeWidth={1.5}
                                        className={`transition-colors duration-300 ${favourited ? "fill-orange-accent text-orange-accent" : "text-black-custom"}`}
                                    />
                                </button>
                            </div>
                            <div className="flex items-center justify-between gap-4 mt-2 md:mt-0">
                                <span className="font-tt text-[14px] xl:text-[18px] text-black-custom">
                                    {product.size} / {product.tagline}
                                </span>
                                {/* Badge — mobile, beside the size */}
                                {product.badge && (
                                    <span className="md:hidden inline-flex shrink-0 bg-orange-accent text-white font-aeonik text-[12px] uppercase px-4 py-1 rounded-full">
                                        {product.badge}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {product.description?.length > 0 && (
                            <div className="font-aeonik text-[16px] xl:text-[24px] text-black-custom leading-tight [&_p]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
                                <PortableText value={product.description} />
                            </div>
                        )}

                        {/* Highlights */}
                        {product.highlights?.length > 0 && (
                            <div className="font-aeonik text-[14px] xl:text-[18px] text-black-custom leading-none xl:leading-normal [&_p]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
                                <PortableText value={product.highlights} />
                            </div>
                        )}

                        {/* Certification badges — mobile only */}
                        <div className="flex md:hidden items-center gap-4">
                            <Image
                                src="/images/certification-badges.png"
                                alt="GMP Certified"
                                width={56}
                                height={56}
                                unoptimized={true}
                                className="w-40 xl:w-60 xl:h-60 object-contain"
                            />
                        </div>

                        {/* Flavour selector */}
                        {product.flavours?.length > 0 && (
                            <div
                                className={`border border-gray-mint overflow-hidden ${flavourOpen ? "rounded-3xl" : "rounded-full"}`}
                                style={!flavourOpen ? { transition: "border-radius 0ms 300ms" } : undefined}
                            >
                                <button
                                    onClick={() => setFlavourOpen((v) => !v)}
                                    className="w-full flex items-center justify-between px-6 py-2 xl:py-4 font-aeonik text-[13px] xl:text-[16px] uppercase tracking-wide text-black-custom"
                                >
                                    {product.flavourName || "FLAVOUR"}
                                    <ChevronDown
                                        size={18}
                                        strokeWidth={1.5}
                                        className={`shrink-0 transition-transform duration-300 ${flavourOpen ? "rotate-180" : ""}`}
                                    />
                                </button>
                                <div className={`grid transition-all duration-300 ${flavourOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                                    <div className="overflow-hidden">
                                        <div className="px-2 pb-2 pt-1 border-t border-gray-mint/40">
                                            {product.flavours.map((f) => {
                                                const isCurrent = f.slug === product.slug
                                                return (
                                                    <button
                                                        key={f._id}
                                                        onClick={() => {
                                                            setFlavourOpen(false)
                                                            if (!isCurrent) router.push(`/shop/product/${f.slug}`)
                                                        }}
                                                        className={`w-full text-left px-4 py-2.5 rounded-full font-aeonik text-[13px] xl:text-[16px] transition-colors duration-200 flex items-center justify-between ${isCurrent ? "bg-gray-soft text-black-custom font-semibold cursor-default" : "text-black-custom hover:bg-gray-soft cursor-pointer"}`}
                                                    >
                                                        {f.flavourName}
                                                        {isCurrent && <span className="w-2 h-2 rounded-full bg-black-custom shrink-0" />}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Price + Qty + Stock + Wishlist */}
                        <div className="flex items-center gap-4 flex-wrap">
                            <span className="flex items-baseline gap-2">
                                <span className="font-tt text-[32px] text-black-custom">
                                    {formatPrice(effectivePrice)}€
                                </span>
                                {product.salePrice && (
                                    <span className="font-tt text-[18px] text-black-custom/50 line-through">
                                        {formatPrice(product.price)}€
                                    </span>
                                )}
                            </span>

                            {/* Quantity stepper */}
                            <div className="flex items-center border border-black-custom rounded-full px-2">
                                <button
                                    onClick={decrement}
                                    aria-label="Decrease quantity"
                                    className="w-9 h-9 flex items-center justify-center text-black-custom hover:opacity-60 transition-opacity duration-200 cursor-pointer"
                                >
                                    <Minus size={14} strokeWidth={1.5} />
                                </button>
                                <span className="w-8 text-center font-aeonik text-[15px] text-black-custom">
                                    {quantity}
                                </span>
                                <button
                                    onClick={increment}
                                    disabled={incrementDisabled}
                                    aria-label="Increase quantity"
                                    className="w-9 h-9 flex items-center justify-center text-black-custom hover:opacity-60 transition-opacity duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Plus size={14} strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* Stock indicator */}
                            <div className="flex items-center gap-2 ml-auto">
                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${atMax ? "bg-red-400" : "bg-teal-accent"}`} />
                                <span className="font-aeonik text-[12px] uppercase tracking-wide text-black-custom">
                                    {atMax ? "Out of Stock" : "In Stock"}
                                </span>
                            </div>

                            {/* Wishlist — desktop (mobile version sits beside the title) */}
                            <button
                                type="button"
                                onClick={handleToggleFavourite}
                                aria-label={favourited ? "Remove from wishlist" : "Add to wishlist"}
                                aria-pressed={favourited}
                                className="hidden md:flex w-9 h-9 items-center justify-center rounded-full border border-gray-mint hover:border-black-custom transition-colors duration-300 cursor-pointer"
                            >
                                <Heart
                                    size={16}
                                    strokeWidth={1.5}
                                    className={`transition-colors duration-300 ${favourited ? "fill-orange-accent text-orange-accent" : "text-black-custom"}`}
                                />
                            </button>
                        </div>

                        {/* CTA buttons */}
                        <div className="flex flex-col md:flex-row gap-3">
                            <button
                                disabled={isAdding || atMax}
                                onClick={async () => {
                                    setIsAdding(true)
                                    const result = await addToCart({
                                        id: product._id,
                                        type: "product",
                                        slug: product.slug,
                                        name: product.title,
                                        subtitle: product.subtitle,
                                        price: effectivePrice,
                                        image: displayImages[0] ?? "",
                                        flavour: product.flavourName ?? "",
                                    }, quantity)
                                    setIsAdding(false)
                                    if (result?.error === "out_of_stock") {
                                        toast.error("This product is out of stock.")
                                    } else if (result?.error === "max_quantity") {
                                        toast.error(`Maximum available quantity reached (${product.inventory}).`)
                                    } else if (result?.error === "failed") {
                                        toast.error("Failed to add to bag. Please try again.")
                                    } else {
                                        setQuantity(1)
                                    }
                                }}
                                className="flex-1 flex items-center justify-center px-6 py-4 md:h-12 md:px-0 md:py-0 bg-black-custom rounded-full font-aeonik text-[16px] uppercase text-white-custom hover:bg-gray-text transition-colors duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {atMax ? "MAX QTY REACHED" : isAdding ? "ADDING..." : "ADD TO BAG"}
                            </button>
                            <button
                                onClick={handleQuickBuy}
                                disabled={isBuying || atMax}
                                className="flex-1 flex items-center justify-center px-6 py-4 md:h-12 md:px-0 md:py-0 bg-gray-mint rounded-full font-aeonik text-[16px] uppercase text-black-custom hover:bg-white-custom hover:border hover:border-black-custom transition-colors duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isBuying ? "..." : "QUICK BUY"}
                            </button>
                        </div>

                        <hr className="border-gray-mint mt-2" />

                        {/* Accordions */}
                        <div className="flex flex-col gap-3 pt-2">
                            {product.productDetails?.ingredients?.length > 0 && (
                                <AccordionItem label="Ingredients">
                                    <div className="[&_p]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 text-black-custom">
                                        <PortableText value={product.productDetails.ingredients} />
                                    </div>
                                </AccordionItem>
                            )}
                            {product.productDetails?.directions?.length > 0 && (
                                <AccordionItem label="Direction for Use">
                                    <div className="[&_p]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 text-black-custom">
                                        <PortableText value={product.productDetails.directions} />
                                    </div>
                                </AccordionItem>
                            )}
                        </div>

                        {/* Bundle Callouts */}
                        {bundleCallouts?.length > 0 && (
                            <div className="pt-4">
                                <p className="font-aeonik text-[11px] xl:text-[14px] uppercase text-black-custom mb-4">
                                    Also Available as a Bundle
                                </p>
                                <div className="flex flex-col gap-3">
                                    {bundleCallouts.map((bundle) => {
                                        const price = bundle.saleBundlePrice ?? bundle.bundlePrice
                                        const productSummary = bundle.products
                                            ?.map(item =>
                                                item.product?.title
                                                    ? `${item.quantity > 1 ? `${item.quantity}× ` : ""}${item.product.title}`
                                                    : null
                                            )
                                            .filter(Boolean)
                                            .join(" + ")

                                        return (
                                            <Link
                                                key={bundle._id}
                                                href={`/shop/bundle/${bundle.slug}`}
                                                className="group flex items-center gap-4 border border-gray-mint rounded-full px-5 py-3 hover:border-black-custom transition-colors duration-300"
                                            >
                                                {bundle.imageUrl && (
                                                    <Image
                                                        src={bundle.imageUrl}
                                                        alt={bundle.title}
                                                        width={40}
                                                        height={40}
                                                        unoptimized
                                                        className="w-10 h-10 object-contain shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-aeonik text-[13px] xl:text-[15px] text-black-custom truncate">
                                                        {bundle.title}
                                                    </p>
                                                    {productSummary && (
                                                        <p className="font-tt text-[11px] xl:text-[13px] text-gray-text truncate">
                                                            {productSummary}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="font-tt text-[16px] xl:text-[18px] text-black-custom">
                                                        {formatPrice(price)}€
                                                    </span>
                                                    {bundle.saleBundlePrice && (
                                                        <span className="font-tt text-[13px] text-black-custom/40 line-through">
                                                            {formatPrice(bundle.bundlePrice)}€
                                                        </span>
                                                    )}
                                                </div>
                                                <ArrowRight
                                                    size={16}
                                                    strokeWidth={1.5}
                                                    className="shrink-0 text-black-custom group-hover:translate-x-1 transition-transform duration-300"
                                                />
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Complete Your Routine */}
                        {relatedProducts?.length > 0 && (
                            <div className="pt-4">
                                <p className="font-aeonik text-[11px] xl:text-[14px] uppercase text-black-custom mb-5">
                                    Complete Your Routine
                                </p>
                                <div className="flex gap-4">
                                    {relatedProducts.map((rp) => {
                                        const rpEffectivePrice = rp.salePrice ?? rp.price
                                        return (
                                        <div key={rp._id} className="flex-1 flex flex-col gap-3">
                                            <div className="relative aspect-square flex flex-col items-center justify-end gap-1 pb-3 mt-4 xl:mt-0">
                                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[88%] md:w-[75%] xl:w-[65%] aspect-425/625 bg-gray-soft rounded-full z-0" />
                                                {rp.imageUrl && (
                                                    <Image
                                                        src={rp.imageUrl}
                                                        alt={rp.title}
                                                        width={200}
                                                        height={200}
                                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[82%] h-[82%] md:w-[70%] md:h-[70%] object-contain z-1"
                                                    />
                                                )}
                                                <div className="relative z-1 flex flex-col items-center gap-1 top-14 md:top-0">
                                                    <p className="font-aeonik text-[13px] xl:text-[16px] text-black-custom leading-tight text-center">
                                                        {rp.title}
                                                    </p>
                                                    {rp.flavourName && (
                                                        <p className="font-tt text-[12px] xl:text-[14px] text-black-custom/90 text-center">
                                                            {rp.flavourName}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-center items-center gap-3">
                                                {/* Price — desktop only, shown beside the button (as before) */}
                                                <span className="hidden md:flex items-baseline gap-1.5">
                                                    <span className="font-aeonik text-[15px] xl:text-[24px] text-black-custom">
                                                        {formatPrice(rpEffectivePrice)}€
                                                    </span>
                                                    {rp.salePrice && (
                                                        <span className="font-aeonik text-[11px] xl:text-[14px] text-black-custom/50 line-through">
                                                            {formatPrice(rp.price)}€
                                                        </span>
                                                    )}
                                                </span>
                                                <button
                                                    onClick={() => addToCart({ id: rp._id, type: "product", slug: rp.slug, name: rp.title, subtitle: rp.flavourName ? [rp.flavourName] : [], price: rpEffectivePrice, image: rp.imageUrl, flavour: rp.flavourName || "" })}
                                                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 md:px-8 h-9 xl:h-11 bg-black-custom rounded-full font-aeonik text-[11px] xl:text-[16px] mt-10 xl:mt-0 uppercase text-white-custom hover:bg-gray-text transition-colors duration-300 cursor-pointer"
                                                >
                                                    <span>Add to Bag</span>
                                                    {/* Price — mobile only, shown inside the button */}
                                                    <span className="md:hidden flex items-baseline gap-1.5">
                                                        <span>{formatPrice(rpEffectivePrice)}€</span>
                                                        {rp.salePrice && (
                                                            <span className="text-white-custom/50 line-through">
                                                                {formatPrice(rp.price)}€
                                                            </span>
                                                        )}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductInteractive
