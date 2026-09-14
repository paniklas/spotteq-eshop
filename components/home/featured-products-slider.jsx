"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import ProductCard from "./product-card"

const GAP = 32 // px — keep in sync with the gap-8 class (8 * 4 = 32px)
const SWIPE_DISTANCE = 50 // px of pointer travel that counts as a swipe
const SWIPE_VELOCITY = 500 // px/s — a short, fast flick also counts

const Carousel = ({ products, visible, pagination = "bars" }) => {
    const [index, setIndex] = useState(0)
    const maxIndex = Math.max(0, products.length - visible)
    const viewportRef = useRef(null)
    // Set once a drag actually starts, so releasing over a card button/link doesn't click it.
    const draggedRef = useRef(false)

    const goTo = (i) => setIndex(Math.max(0, Math.min(maxIndex, i)))
    const prev = () => goTo(index - 1)
    const next = () => goTo(index + 1)

    const handleDragEnd = (_, { offset, velocity }) => {
        const slideWidth = ((viewportRef.current?.offsetWidth ?? 0) + GAP) / visible
        // A long drag moves as many cards as were dragged past; a short swipe or flick moves one.
        let steps = slideWidth ? Math.round(Math.abs(offset.x) / slideWidth) : 0
        if (steps === 0 && (Math.abs(offset.x) > SWIPE_DISTANCE || Math.abs(velocity.x) > SWIPE_VELOCITY)) {
            steps = 1
        }
        if (steps === 0) return

        const direction = (offset.x || velocity.x) < 0 ? 1 : -1
        goTo(index + direction * steps)
    }

    return (
        <>
            {/* container-type lets us use 100cqw = viewport width inside children,
                eliminating the need for ResizeObserver + JS measurement.
                onDragStartCapture blocks the browser's native image/link drag, which
                would otherwise cancel the pointer drag on desktop. */}
            <div
                ref={viewportRef}
                className="overflow-hidden"
                style={{ containerType: "inline-size" }}
                onDragStartCapture={(e) => e.preventDefault()}
            >
                <motion.div
                    className="flex"
                    animate={{
                        transform: `translateX(calc(${-index} * (100cqw + ${GAP}px) / ${visible}))`,
                    }}
                    transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
                >
                    {/* Drag lives on an inner wrapper: an explicit `transform` on the element
                        above overrides framer's drag `x`, so the cards wouldn't follow the pointer. */}
                    <motion.div
                        className={`flex ${maxIndex > 0 ? "cursor-grab active:cursor-grabbing" : ""}`}
                        style={{ gap: `${GAP}px` }}
                        drag={maxIndex > 0 ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        // Stiffer at the ends so there's clear resistance with nothing left to show.
                        dragElastic={{ left: index === maxIndex ? 0.1 : 0.5, right: index === 0 ? 0.1 : 0.5 }}
                        onPointerDownCapture={() => { draggedRef.current = false }}
                        onDragStart={() => { draggedRef.current = true }}
                        onDragEnd={handleDragEnd}
                        onClickCapture={(e) => {
                            // detail 0 = keyboard-activated click; never swallow those.
                            if (!draggedRef.current || e.detail === 0) return
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                    >
                        {products.map((product, i) => (
                            <div
                                key={product._id}
                                style={{ flex: `0 0 calc((100cqw - ${GAP * (visible - 1)}px) / ${visible})` }}
                            >
                                <ProductCard product={product} priority={i === 0 && index === 0} />
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {maxIndex > 0 && (
                pagination === "dots" ? (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === index ? "w-6 bg-black-custom" : "w-2 bg-black-custom/25"}`}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={prev}
                            disabled={index === 0}
                            aria-label="Previous"
                            className="w-10 h-10 flex items-center justify-center shrink-0 rotate-180 rounded-full hover:bg-gray-mint transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M30.5303 20.5303C30.8232 20.2374 30.8232 19.7626 30.5303 19.4697L25.7574 14.6967C25.4645 14.4038 24.9896 14.4038 24.6967 14.6967C24.4038 14.9896 24.4038 15.4645 24.6967 15.7574L28.9393 20L24.6967 24.2426C24.4038 24.5355 24.4038 25.0104 24.6967 25.3033C24.9896 25.5962 25.4645 25.5962 25.7574 25.3033L30.5303 20.5303ZM10 20L10 20.75L30 20.75L30 20L30 19.25L10 19.25L10 20Z" fill="black"/>
                            </svg>
                        </button>
                        <button
                            onClick={next}
                            disabled={index === maxIndex}
                            aria-label="Next"
                            className="w-10 h-10 flex items-center justify-center shrink-0 rounded-full hover:bg-gray-mint transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M30.5303 20.5303C30.8232 20.2374 30.8232 19.7626 30.5303 19.4697L25.7574 14.6967C25.4645 14.4038 24.9896 14.4038 24.6967 14.6967C24.4038 14.9896 24.4038 15.4645 24.6967 15.7574L28.9393 20L24.6967 24.2426C24.4038 24.5355 24.4038 25.0104 24.6967 25.3033C24.9896 25.5962 25.4645 25.5962 25.7574 25.3033L30.5303 20.5303ZM10 20L10 20.75L30 20.75L30 20L30 19.25L10 19.25L10 20Z" fill="black"/>
                            </svg>
                        </button>
                        <div className="flex items-center">
                            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-22.25 border-t transition-all duration-300 ${i === index ? "border-t-[3px] border-black" : "border-black/50"}`}
                                />
                            ))}
                        </div>
                    </div>
                )
            )}
        </>
    )
}

const FeaturedProductsSlider = ({ products }) => {
    return (
        <>
            {/* Mobile — one card per view, dot pagination */}
            <div className="md:hidden">
                <Carousel products={products} visible={1} pagination="dots" />
            </div>

            {/* Tablet / desktop — three cards per view, arrows + bar pagination */}
            <div className="hidden md:block">
                <Carousel products={products} visible={3} pagination="bars" />
            </div>
        </>
    )
}

export default FeaturedProductsSlider
