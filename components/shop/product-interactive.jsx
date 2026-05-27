"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, Plus, Minus, Heart } from "lucide-react";
import { useCart } from "@/context/cart-context";
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
    const [selectedFlavour, setSelectedFlavour] = useState(
        product.flavours?.find(f => f.slug === product.slug)?.flavourName ?? ""
    )
    const [flavourOpen, setFlavourOpen] = useState(false)
    const [wishlisted, setWishlisted] = useState(false)
    const [currentImage, setCurrentImage] = useState(0)
    const { addToCart } = useCart()

    const decrement = () => setQuantity((q) => Math.max(1, q - 1))
    const increment = () => setQuantity((q) => q + 1)

    const prevImage = () =>
        setCurrentImage((i) => (i === 0 ? product.images.length - 1 : i - 1))
    const nextImage = () =>
        setCurrentImage((i) => (i === product.images.length - 1 ? 0 : i + 1))

    return (
        <div className="bg-white-custom pt-40 pb-20">
            <div className="max-w-480 mx-auto page-x">
                <div className="flex flex-col md:flex-row gap-12 xl:gap-20 items-start">

                    <div className="product-page-glow" style={{ top: '35%', right: '0px', transform: 'translateY(-50%)' }} />

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
                            <button
                                onClick={prevImage}
                                aria-label="Previous image"
                                className="absolute left-0 z-10 p-2 text-black-custom hover:opacity-60 transition-opacity duration-200"
                            >
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.46967 19.4697C9.17678 19.7626 9.17678 20.2374 9.46967 20.5303L14.2426 25.3033C14.5355 25.5962 15.0104 25.5962 15.3033 25.3033C15.5962 25.0104 15.5962 24.5355 15.3033 24.2426L11.0607 20L15.3033 15.7574C15.5962 15.4645 15.5962 14.9896 15.3033 14.6967C15.0104 14.4038 14.5355 14.4038 14.2426 14.6967L9.46967 19.4697ZM30 20L30 19.25L10 19.25L10 20L10 20.75L30 20.75L30 20Z" fill="black"/>
                                </svg>

                            </button>

                            <div className="relative w-full aspect-square mx-auto flex items-center justify-center">
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] aspect-375/572 bg-gray-soft rounded-full z-0" />
                                <Image
                                    src={product.images[currentImage]}
                                    alt={product.title}
                                    width={420}
                                    height={420}
                                    unoptimized={true}
                                    priority
                                    className="w-[72%] h-[72%] object-contain relative z-1"
                                />
                            </div>

                            <button
                                onClick={nextImage}
                                aria-label="Next image"
                                className="absolute right-0 z-10 p-2 text-black-custom hover:opacity-60 transition-opacity duration-200"
                            >
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M30.5303 20.5303C30.8232 20.2374 30.8232 19.7626 30.5303 19.4697L25.7574 14.6967C25.4645 14.4038 24.9896 14.4038 24.6967 14.6967C24.4038 14.9896 24.4038 15.4645 24.6967 15.7574L28.9393 20L24.6967 24.2426C24.4038 24.5355 24.4038 25.0104 24.6967 25.3033C24.9896 25.5962 25.4645 25.5962 25.7574 25.3033L30.5303 20.5303ZM10 20L10 20.75L30 20.75L30 20L30 19.25L10 19.25L10 20Z" fill="black"/>
                                </svg>
                            </button>
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
                            <div className="relative">
                                <button
                                    onClick={() => setFlavourOpen((v) => !v)}
                                    className="w-full flex items-center justify-between border border-gray-mint rounded-full px-6 py-2 font-aeonik text-[13px] xl:text-[16px] tracking-wide text-black-custom"
                                >
                                    {selectedFlavour || "FLAVOUR"}
                                    <ChevronDown
                                        size={18}
                                        strokeWidth={1.5}
                                        className={`shrink-0 transition-transform duration-300 ${flavourOpen ? "rotate-180" : ""}`}
                                    />
                                </button>
                                {flavourOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white-custom border border-gray-mint rounded-2xl z-20 overflow-hidden shadow-sm">
                                        {product.flavours.map((f) => (
                                            <button
                                                key={f._id}
                                                onClick={() => {
                                                    setSelectedFlavour(f.flavourName)
                                                    setFlavourOpen(false)
                                                    router.push(`/shop/product/${f.slug}`)
                                                }}
                                                className="w-full text-left px-6 py-3 font-aeonik text-[13px] text-black-custom hover:bg-gray-soft transition-colors duration-200"
                                            >
                                                {f.flavourName}
                                            </button>
                                        ))}
                                    </div>
                                )}
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
                                    aria-label="Increase quantity"
                                    className="w-9 h-9 flex items-center justify-center text-black-custom hover:opacity-60 transition-opacity duration-200 cursor-pointer"
                                >
                                    <Plus size={14} strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* Stock indicator */}
                            <div className="flex items-center gap-2 ml-auto">
                                <span className="w-2.5 h-2.5 rounded-full bg-teal-accent shrink-0" />
                                <span className="font-aeonik text-[12px] uppercase tracking-wide text-black-custom">
                                    In Stock
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
                                onClick={() => {
                                    addToCart({
                                        id: product._id,
                                        name: product.title,
                                        subtitle: product.subtitle,
                                        price: product.price,
                                        image: product.images[0],
                                        flavour: selectedFlavour,
                                    }, quantity)
                                    setQuantity(1)
                                }}
                                className="flex-1 h-12 bg-black-custom rounded-full font-aeonik text-[12px] xl:text-[16px] uppercase text-white-custom hover:bg-gray-text transition-colors duration-300 cursor-pointer"
                            >
                                ADD TO BAG
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
                                            <div className="relative aspect-square flex flex-col items-center justify-center gap-1">
                                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] aspect-375/572 bg-gray-soft rounded-full z-0" />
                                                {rp.imageUrl && (
                                                    <Image
                                                        src={rp.imageUrl}
                                                        alt={rp.title}
                                                        width={200}
                                                        height={200}
                                                        className="w-[58%] h-[58%] object-contain relative z-1"
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
                                                    onClick={() => addToCart({ id: rp._id, name: rp.title, subtitle: rp.flavourName ? [rp.flavourName] : [], price: rp.price, image: rp.imageUrl })}
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
