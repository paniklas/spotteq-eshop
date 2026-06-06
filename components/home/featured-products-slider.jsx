"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ProductCard from "./product-card"

const VISIBLE = 3
const GAP = 32 // px — keep in sync with the gap-8 class (8 * 4 = 32px)

const FeaturedProductsSlider = ({ products }) => {
    const [index, setIndex] = useState(0)
    const maxIndex = Math.max(0, products.length - VISIBLE)

    const prev = () => setIndex((i) => Math.max(0, i - 1))
    const next = () => setIndex((i) => Math.min(maxIndex, i + 1))


    return (
        <>
            {/* container-type lets us use 100cqw = viewport width inside children,
                eliminating the need for ResizeObserver + JS measurement */}
            <div className="overflow-hidden" style={{ containerType: "inline-size" }}>
                <motion.div
                    className="flex"
                    style={{ gap: `${GAP}px` }}
                    animate={{
                        transform: `translateX(calc(${-index} * (100cqw + ${GAP}px) / ${VISIBLE}))`,
                    }}
                    transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
                >
                    {products.map((product, i) => (
                        <div
                            key={product._id}
                            style={{ flex: `0 0 calc((100cqw - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})` }}
                        >
                            <ProductCard product={product} priority={i === 0 && index === 0} />
                        </div>
                    ))}
                </motion.div>
            </div>

            {maxIndex > 0 && (
                <div className="flex items-center gap-3 mt-20">
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
            )}
        </>
    )
}

export default FeaturedProductsSlider
