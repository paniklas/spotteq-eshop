"use client"

import { useState, useMemo } from "react";
import Image from "next/image";
import { Heart, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useCartStore, makeCartId, bundleVariantKey } from "@/store/cart-store";
import { useFavouritesStore } from "@/store/favourites-store";
import { useFavouritesHydrated } from "@/hooks/use-favourites-hydrated";
import { formatPrice } from "@/utils/formatPrice";
import { PortableText } from "@portabletext/react";
import { Link } from "@/i18n/navigation";

// The selectable flavours for a slot: the admin's default product plus any active
// sibling variants, deduped (the default may or may not appear in its own flavours list).
function buildOptions(item) {
    const map = new Map()
    if (item.product?._id) {
        map.set(item.product._id, {
            _id: item.product._id,
            flavourName: item.product.flavourName,
            inventory: item.product.inventory,
            imageUrl: item.product.imageUrl,
        })
    }
    for (const f of item.flavours ?? []) {
        if (f?._id && !map.has(f._id)) map.set(f._id, f)
    }
    return [...map.values()]
}

// One slot's flavour picker. Local open state so slots expand independently.
const FlavourDropdown = ({ options, selectedId, onSelect }) => {
    const [open, setOpen] = useState(false)
    const selected = options.find((o) => o._id === selectedId) ?? options[0]
    return (
        <div
            className={`border border-gray-mint overflow-hidden ${open ? "rounded-2xl" : "rounded-full"}`}
            style={!open ? { transition: "border-radius 0ms 300ms" } : undefined}
        >
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-3 font-aeonik text-[13px] xl:text-[15px] text-black-custom cursor-pointer"
            >
                <span className="truncate">{selected?.flavourName || "Choose flavour"}</span>
                <ChevronDown size={16} strokeWidth={1.5} className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>
            <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                    <div className="px-2 pb-2 pt-1 border-t border-gray-mint/40">
                        {options.map((o) => {
                            const isCurrent = o._id === selectedId
                            const soldOut = o.inventory != null && o.inventory <= 0
                            return (
                                <button
                                    key={o._id}
                                    type="button"
                                    disabled={soldOut}
                                    onClick={() => { if (!soldOut) { onSelect(o._id); setOpen(false) } }}
                                    className={`w-full text-left px-4 py-2.5 rounded-full font-aeonik text-[13px] xl:text-[15px] flex items-center justify-between transition-colors duration-200 ${isCurrent ? "bg-gray-soft text-black-custom font-semibold" : "text-black-custom hover:bg-gray-soft cursor-pointer"} ${soldOut ? "opacity-40 cursor-not-allowed" : ""}`}
                                >
                                    <span className="truncate">{o.flavourName}{soldOut ? " — out of stock" : ""}</span>
                                    {isCurrent && <span className="w-2 h-2 rounded-full bg-black-custom shrink-0" />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}


const BundleInteractive = ({ bundle }) => {
    const [isAdding, setIsAdding] = useState(false)
    const [currentImage, setCurrentImage] = useState(0)
    const { addToCart, cartItems } = useCartStore()

    const { isLoaded, isSignedIn } = useUser()
    const favHydrated = useFavouritesHydrated()
    const isFav = useFavouritesStore((s) => s.ids.includes(bundle._id))
    const toggleFavourite = useFavouritesStore((s) => s.toggleFavourite)
    const favourited = favHydrated && isFav

    const handleToggleFavourite = async () => {
        if (!isLoaded) return
        if (!isSignedIn) {
            toast.error("Please sign in to save favourites.")
            return
        }
        const result = await toggleFavourite(bundle._id)
        if (result?.error === "unauthenticated") {
            toast.error("Please sign in to save favourites.")
        } else if (result && !result.ok) {
            toast.error("Could not update your wishlist. Please try again.")
        }
    }

    // Chosen variant _id per slot (keyed by slot index — a bundle may repeat a base
    // product). Defaults to the admin's referenced product for each slot.
    const [selections, setSelections] = useState(() =>
        Object.fromEntries((bundle.products ?? []).map((item, i) => [i, item.product?._id]))
    )

    const slots = useMemo(() =>
        (bundle.products ?? []).map((item, i) => {
            const options = buildOptions(item)
            const selected = options.find((o) => o._id === selections[i]) ?? options[0] ?? null
            const canChoose = !!item.allowFlavourChange && options.length > 1
            return { item, index: i, options, selected, canChoose }
        }), [bundle.products, selections])

    // The customer's chosen variant per slot — drives cart identity, inventory, and
    // order storage. slotProductId is the admin default (slot identity); variantId is
    // what the customer actually gets.
    const selectedFlavours = slots.map((s) => ({
        slotProductId: s.item.product?._id ?? "",
        variantId: s.selected?._id ?? "",
        flavourName: s.selected?.flavourName ?? "",
        productTitle: s.item.product?.title ?? "",
        quantity: s.item.quantity,
    }))

    const effectivePrice = bundle.saleBundlePrice ?? bundle.bundlePrice
    // Include the flavour selection so each distinct choice is its own cart line.
    const cartId = makeCartId(bundle._id, bundleVariantKey(selectedFlavours))
    const cartQty = cartItems.find((i) => i.cartId === cartId)?.qty ?? 0

    // Stock is bounded by the *selected* variant of each slot, not the admin default.
    const maxBundleQty = slots.reduce((min, s) => {
        const inv = s.selected?.inventory
        if (inv == null) return min
        return Math.min(min, Math.floor(inv / s.item.quantity))
    }, Infinity)
    const atMax = maxBundleQty !== Infinity && cartQty >= maxBundleQty

    const ownImages = [
        ...(bundle.imageUrl ? [bundle.imageUrl] : []),
        ...(bundle.galleryImageUrls ?? []),
    ].filter(Boolean)
    const displayImages = ownImages.length > 0
        ? ownImages
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
            subtitle: slots
                .map((s) => s.item.product?.title
                    ? `${s.item.quantity}x ${s.item.product.title}${s.selected?.flavourName ? ` – ${s.selected.flavourName}` : ""}`
                    : null)
                .filter(Boolean),
            price: effectivePrice,
            image: bundle.imageUrl ?? "",
            flavour: "",
            selectedFlavours,
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

                        {/* Constituent products — with per-slot flavour pickers */}
                        {slots.length > 0 && (
                            <div className="flex flex-col gap-3">
                                {slots.map((s) => (
                                    s.item.product?.title && (
                                        <div key={s.index} className="flex flex-col gap-1.5">
                                            <div className="flex justify-between items-center">
                                                <span className="font-aeonik text-[16px] xl:text-[24px] text-black-custom leading-tight">
                                                    {s.item.product.title}
                                                </span>
                                                <span className="font-aeonik text-[16px] xl:text-[18px] text-black-custom/60">
                                                    <span className="text-[14px]">Quantity: </span>x{s.item.quantity}
                                                </span>
                                            </div>
                                            {s.canChoose ? (
                                                <FlavourDropdown
                                                    options={s.options}
                                                    selectedId={s.selected?._id}
                                                    onSelect={(id) => setSelections((prev) => ({ ...prev, [s.index]: id }))}
                                                />
                                            ) : (
                                                s.selected?.flavourName && (
                                                    <span className="font-aeonik text-[13px] xl:text-[15px] text-gray-text">
                                                        {s.selected.flavourName}
                                                    </span>
                                                )
                                            )}
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
                                    {formatPrice(effectivePrice)}€
                                </span>
                                {bundle.saleBundlePrice && (
                                    <span className="font-tt text-[20px] text-black-custom/40 line-through">
                                        {formatPrice(bundle.bundlePrice)}€
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
                                type="button"
                                onClick={handleToggleFavourite}
                                aria-label={favourited ? "Remove from wishlist" : "Add to wishlist"}
                                aria-pressed={favourited}
                                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-mint hover:border-black-custom transition-colors duration-300 cursor-pointer"
                            >
                                <Heart
                                    size={16}
                                    strokeWidth={1.5}
                                    className={`transition-colors duration-300 ${favourited ? "fill-orange-accent text-orange-accent" : "text-black-custom"}`}
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
                            width={240}
                            height={240}
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
