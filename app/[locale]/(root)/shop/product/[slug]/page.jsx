"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, Plus, Minus, Heart, ChevronLeft, ChevronRight } from "lucide-react"

const product = {
    name: "Hyperfuel®",
    size: "390g / 1 - Month Supply",
    badge: "BESTSELLER",
    subtitle: ["Advanced Intra-Workout", "All-in-One Performance Formula"],
    highlights: [
        "4000mg BCAAs 4:1:1",
        "3000mg L-Alanine · 1500mg L-Glutamine",
        "Energy · Focus · Endurance",
        "With Caffeine, Green Tea & Vitamins",
    ],
    price: 40,
    flavours: ["Green Apple", "Orange", "Tropical"],
    images: [
        "/images/products/group-84.png",
        "/images/products/group-87.png",
    ],
    inStock: true,
    ingredients:
        "BCAAs (L-Leucine, L-Isoleucine, L-Valine 4:1:1), L-Alanine, L-Glutamine, Caffeine Anhydrous, Green Tea Extract (50% EGCG), Vitamin B6, Vitamin B12, Vitamin C, Natural & Artificial Flavours, Sucralose, Citric Acid.",
    directions:
        "Mix 1 scoop (13g) with 300–400ml cold water. Shake well and consume 20–30 minutes before training. Do not exceed 1 serving per day.",
    tagline:
        "Ολοκληρωμένη φόρμουλα ενέργειας και αποκατάστασης, ειδικά σχεδιασμένη για αθλητές με υψηλές απαιτήσεις.",
}

const relatedProducts = [
    {
        id: "whey-protein-chocolate",
        name: "Pure Whey Protein",
        variant: "Chocolate",
        price: 40,
        image: "/images/products/group-86.png",
    },
    {
        id: "creatine-200mesh",
        name: "Creatine Monohydrate",
        variant: "200 mesh",
        price: 40,
        image: "/images/products/liposomal-magnesium-1.png",
    },
]

const certifications = [
    { src: "/images/gmp-logo.png", alt: "GMP Certified" },
    { src: "/images/haccp-logo.png", alt: "HACCP Certified" },
    { src: "/images/isoqar-logo.png", alt: "ISOQAR Certified" },
]

const AccordionItem = ({ label, children }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="border border-gray-mint rounded-full overflow-hidden">
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between px-6 py-4 font-aeonik text-[13px] uppercase tracking-wide text-black-custom"
            >
                {label}
                <Plus
                    size={18}
                    strokeWidth={1.5}
                    className={`shrink-0 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                />
            </button>
            {open && (
                <div className="px-6 pb-5 font-tt text-[14px] text-gray-text leading-relaxed rounded-b-[24px]">
                    {children}
                </div>
            )}
        </div>
    )
}

const ProductPage = () => {
    const [quantity, setQuantity] = useState(1)
    const [selectedFlavour, setSelectedFlavour] = useState("")
    const [flavourOpen, setFlavourOpen] = useState(false)
    const [wishlisted, setWishlisted] = useState(false)
    const [currentImage, setCurrentImage] = useState(0)

    const decrement = () => setQuantity((q) => Math.max(1, q - 1))
    const increment = () => setQuantity((q) => q + 1)

    const prevImage = () =>
        setCurrentImage((i) => (i === 0 ? product.images.length - 1 : i - 1))
    const nextImage = () =>
        setCurrentImage((i) => (i === product.images.length - 1 ? 0 : i + 1))

    return (
        <div className="bg-white-custom pt-24 pb-20">
            <div className="max-w-[1920px] mx-auto page-x">
                <div className="flex flex-col md:flex-row gap-12 xl:gap-20 items-start py-10">

                    {/* ── LEFT: Image + Certs + Tagline ── */}
                    <div className="w-full md:w-1/2 flex flex-col gap-10">

                        {/* Image circle with navigation */}
                        <div className="relative flex items-center justify-center">
                            {/* Prev arrow */}
                            <button
                                onClick={prevImage}
                                aria-label="Previous image"
                                className="absolute left-0 z-10 p-2 text-black-custom hover:opacity-60 transition-opacity duration-200"
                            >
                                <ChevronLeft size={22} strokeWidth={1.5} />
                            </button>

                            {/* Circle background */}
                            <div className="relative w-full max-w-[540px] aspect-square rounded-full bg-gray-soft mx-auto overflow-hidden flex items-center justify-center">
                                <Image
                                    src={product.images[currentImage]}
                                    alt={product.name}
                                    width={420}
                                    height={420}
                                    unoptimized
                                    priority
                                    className="w-[72%] h-[72%] object-contain relative z-[1]"
                                />
                            </div>

                            {/* Next arrow */}
                            <button
                                onClick={nextImage}
                                aria-label="Next image"
                                className="absolute right-0 z-10 p-2 text-black-custom hover:opacity-60 transition-opacity duration-200"
                            >
                                <ChevronRight size={22} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Certification badges */}
                        <div className="flex items-center gap-4">
                            {certifications.map((cert) => (
                                <Image
                                    key={cert.alt}
                                    src={cert.src}
                                    alt={cert.alt}
                                    width={56}
                                    height={56}
                                    unoptimized
                                    className="w-14 h-14 object-contain"
                                />
                            ))}
                        </div>

                        {/* Greek tagline */}
                        <p className="font-aeonik text-[28px] xl:text-[32px] leading-[1.25] text-black-custom max-w-[480px]">
                            {product.tagline}
                        </p>
                    </div>

                    {/* ── RIGHT: Product details ── */}
                    <div className="w-full md:w-1/2 flex flex-col gap-6">

                        {/* Badge */}
                        <span className="inline-flex w-fit bg-orange-accent text-white font-aeonik text-[12px] uppercase tracking-widest px-4 py-1.5 rounded-full">
                            {product.badge}
                        </span>

                        {/* Name + size */}
                        <div className="flex items-baseline gap-4 flex-wrap">
                            <h1 className="font-aeonik text-[48px] xl:text-[50px] leading-none text-black-custom">
                                {product.name}
                            </h1>
                            <span className="font-tt text-[14px] xl:text-[18px] text-black-custom">
                                {product.size}
                            </span>
                        </div>

                        {/* Subtitle */}
                        <div className="font-aeonik text-[16px] xl:text-[24px] text-black-custom leading-[1.5]">
                            {product.subtitle.map((line) => (
                                <p key={line}>{line}</p>
                            ))}
                        </div>

                        {/* Highlights */}
                        <div className="font-aeonik text-[14px] xl:text-[18px] text-black-custom leading-[1.8] ">
                            {product.highlights.map((line) => (
                                <p key={line}>{line}</p>
                            ))}
                        </div>

                        {/* Flavour selector */}
                        <div className="relative">
                            <button
                                onClick={() => setFlavourOpen((v) => !v)}
                                className="w-full flex items-center justify-between border border-gray-mint rounded-full px-6 py-4 font-aeonik text-[13px] uppercase tracking-wide text-black-custom"
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
                                            key={f}
                                            onClick={() => {
                                                setSelectedFlavour(f)
                                                setFlavourOpen(false)
                                            }}
                                            className="w-full text-left px-6 py-3 font-aeonik text-[13px] text-black-custom hover:bg-gray-soft transition-colors duration-200"
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

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
                            <button className="flex-1 h-[50px] bg-black-custom rounded-full font-aeonik text-[13px] uppercase tracking-widest text-white-custom hover:bg-gray-text transition-colors duration-300 cursor-pointer">
                                ADD TO BAG
                            </button>
                            <button className="flex-1 h-[50px] bg-gray-soft rounded-full font-aeonik text-[13px] uppercase tracking-widest text-black-custom hover:bg-gray-mint transition-colors duration-300 cursor-pointer">
                                QUICK BUY
                            </button>
                        </div>

                        {/* Accordions */}
                        <div className="flex flex-col gap-3 pt-2">
                            <AccordionItem label="Ingredients">
                                {product.ingredients}
                            </AccordionItem>
                            <AccordionItem label="Direction for Use">
                                {product.directions}
                            </AccordionItem>
                        </div>

                        {/* Complete Your Routine */}
                        <div className="pt-4">
                            <p className="font-aeonik text-[11px] uppercase tracking-widest text-gray-text mb-5">
                                Complete Your Routine
                            </p>
                            <div className="flex gap-4">
                                {relatedProducts.map((rp) => (
                                    <div key={rp.id} className="flex-1 flex flex-col gap-3">
                                        <div className="relative aspect-square rounded-full bg-gray-soft flex items-center justify-center overflow-hidden">
                                            <Image
                                                src={rp.image}
                                                alt={rp.name}
                                                width={200}
                                                height={200}
                                                unoptimized
                                                className="w-[68%] h-[68%] object-contain"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-aeonik text-[13px] text-black-custom leading-tight">
                                                {rp.name}
                                            </p>
                                            <p className="font-tt text-[12px] text-gray-text">
                                                {rp.variant}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-aeonik text-[15px] text-black-custom">
                                                {rp.price}€
                                            </span>
                                            <button className="flex-1 h-[36px] bg-black-custom rounded-full font-aeonik text-[11px] uppercase tracking-widest text-white-custom hover:bg-gray-text transition-colors duration-300 cursor-pointer">
                                                ADD TO BAG
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductPage
