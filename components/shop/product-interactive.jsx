"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ChevronDown, Plus, Minus, Heart } from "lucide-react";
import { toast } from "sonner";
import { useCartStore, makeCartId } from "@/store/cart-store";
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
                className="w-full flex items-center justify-between px-6 py-4 font-aeonik text-[13px] xl:text-[16px] uppercase tracking-wide text-black-custom"
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

const ProductInteractive = ({ product, relatedProducts = [] }) => {
    const router = useRouter()
    const [quantity, setQuantity] = useState(1)
    const [flavourOpen, setFlavourOpen] = useState(false)
    const [wishlisted, setWishlisted] = useState(false)
    const [currentImage, setCurrentImage] = useState(0)
    const [isAdding, setIsAdding] = useState(false)
    const { addToCart, cartItems } = useCartStore()

    const displayImages = [
        ...(product.imageUrl ? [product.imageUrl] : []),
        ...(product.galleryImageUrls ?? []),
    ]

    const cartId = makeCartId(product._id, product.flavourName ?? "")
    const cartQty = cartItems.find((i) => i.cartId === cartId)?.qty ?? 0
    const remaining = product.inventory != null ? product.inventory - cartQty : Infinity
    const atMax = remaining <= 0
    const incrementDisabled = quantity >= remaining

    const decrement = () => setQuantity((q) => Math.max(1, q - 1))
    const increment = () => setQuantity((q) => Math.min(q + 1, Math.max(1, remaining)))

    const prevImage = () =>
        setCurrentImage((i) => (i === 0 ? displayImages.length - 1 : i - 1))
    const nextImage = () =>
        setCurrentImage((i) => (i === displayImages.length - 1 ? 0 : i + 1))

    return (
        <div className="bg-white-custom pt-40 pb-20">
            <div className="max-w-480 mx-auto page-x">
                <div className="flex flex-col md:flex-row gap-12 xl:gap-20 items-start">

                    <div className="product-page-glow" style={{ top: '35%', right: '0px', transform: 'translateY(-50%)' }} />

                    {/* ── LEFT: Image + Certs + Tagline ── */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">

                        {/* Back button */}
                        <Link href="/shop/shop-all">
                            <button className="group flex items-center w-fit cursor-pointer">
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

                        {/* Certification badges */}
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

                        {/* Additional information */}
                        {product.productDetails?.additionalInfo?.length > 0 && (
                            <div className="font-aeonik text-[28px] xl:text-[35px] leading-normal text-black-custom [&_p]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
                                <PortableText value={product.productDetails.additionalInfo} />
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Product details ── */}
                    <div className="w-full md:w-1/2 flex flex-col gap-6">

                        {/* Badge */}
                        {product.badge && (
                            <span className="inline-flex w-fit bg-orange-accent text-white font-aeonik text-[12px] xl:text-[14px] uppercase px-4 py-1 rounded-full">
                                {product.badge}
                            </span>
                        )}

                        {/* Name + size */}
                        <div className="flex items-baseline gap-4 flex-wrap">
                            <h1 className="font-aeonik text-[48px] xl:text-[50px] leading-none text-black-custom">
                                {product.title}
                            </h1>
                            <span className="font-tt text-[14px] xl:text-[18px] text-black-custom">
                                {product.size} / {product.tagline}
                            </span>
                        </div>

                        {/* Description */}
                        {product.description?.length > 0 && (
                            <div className="font-aeonik text-[16px] xl:text-[24px] text-black-custom leading-tight [&_p]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
                                <PortableText value={product.description} />
                            </div>
                        )}

                        {/* Highlights */}
                        {product.highlights?.length > 0 && (
                            <div className="font-aeonik text-[14px] xl:text-[18px] text-black-custom leading-normal [&_p]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
                                <PortableText value={product.highlights} />
                            </div>
                        )}

                        {/* Flavour selector */}
                        {product.flavours?.length > 0 && (
                            <div
                                className={`border border-gray-mint overflow-hidden ${flavourOpen ? "rounded-3xl" : "rounded-full"}`}
                                style={!flavourOpen ? { transition: "border-radius 0ms 300ms" } : undefined}
                            >
                                <button
                                    onClick={() => setFlavourOpen((v) => !v)}
                                    className="w-full flex items-center justify-between px-6 py-4 font-aeonik text-[13px] xl:text-[16px] uppercase tracking-wide text-black-custom"
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
                            <span className="font-tt text-[32px] text-black-custom">
                                {product.price}€
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

                            {/* Wishlist */}
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

                        {/* CTA buttons */}
                        <div className="flex gap-3">
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
                                        price: product.price,
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
                                className="flex-1 h-12 bg-black-custom rounded-full font-aeonik text-[12px] xl:text-[16px] uppercase text-white-custom hover:bg-gray-text transition-colors duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {atMax ? "MAX QTY REACHED" : isAdding ? "ADDING..." : "ADD TO BAG"}
                            </button>
                            <button className="flex-1 h-12 bg-gray-mint rounded-full font-aeonik text-[12px] xl:text-[16px] uppercase text-black-custom hover:bg-white-custom hover:border hover:border-black-custom transition-colors duration-300 cursor-pointer">
                                QUICK BUY
                            </button>
                        </div>

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

                        {/* Complete Your Routine */}
                        {relatedProducts?.length > 0 && (
                            <div className="pt-4">
                                <p className="font-aeonik text-[11px] xl:text-[14px] uppercase text-black-custom mb-5">
                                    Complete Your Routine
                                </p>
                                <div className="flex gap-4">
                                    {relatedProducts.map((rp) => (
                                        <div key={rp._id} className="flex-1 flex flex-col gap-3">
                                            <div className="relative aspect-square flex flex-col items-center justify-end gap-1 pb-3">
                                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] aspect-375/572 bg-gray-soft rounded-full z-0" />
                                                {rp.imageUrl && (
                                                    <Image
                                                        src={rp.imageUrl}
                                                        alt={rp.title}
                                                        width={200}
                                                        height={200}
                                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[58%] h-[58%] object-contain z-1"
                                                    />
                                                )}
                                                <p className="relative z-1 font-aeonik text-[13px] xl:text-[16px] text-black-custom leading-tight text-center">
                                                    {rp.title}
                                                </p>
                                                {rp.flavourName && (
                                                    <p className="relative z-1 font-tt text-[12px] xl:text-[14px] text-black-custom/90 text-center">
                                                        {rp.flavourName}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex justify-center items-center gap-3">
                                                <span className="font-aeonik text-[15px] xl:text-[24px] text-black-custom">
                                                    {rp.price}€
                                                </span>
                                                <button
                                                    onClick={() => addToCart({ id: rp._id, slug: rp.slug, name: rp.title, subtitle: rp.flavourName ? [rp.flavourName] : [], price: rp.price, image: rp.imageUrl, flavour: rp.flavourName || "" })}
                                                    className="px-8 h-9 bg-black-custom rounded-full font-aeonik text-[12px] xl:text-[16px] uppercase text-white-custom hover:bg-gray-text transition-colors duration-300 cursor-pointer"
                                                >
                                                    ADD TO BAG
                                                </button>
                                            </div>
                                        </div>
                                    ))}
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
