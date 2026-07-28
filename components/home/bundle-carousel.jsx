"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import BundleCard from "./bundle-card"

const Arrow = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30.5303 20.5303C30.8232 20.2374 30.8232 19.7626 30.5303 19.4697L25.7574 14.6967C25.4645 14.4038 24.9896 14.4038 24.6967 14.6967C24.4038 14.9896 24.4038 15.4645 24.6967 15.7574L28.9393 20L24.6967 24.2426C24.4038 24.5355 24.4038 25.0104 24.6967 25.3033C24.9896 25.5962 25.4645 25.5962 25.7574 25.3033L30.5303 20.5303ZM10 20L10 20.75L30 20.75L30 20L30 19.25L10 19.25L10 20Z" fill="currentColor" />
    </svg>
)

const BundleCarousel = ({ bundles = [] }) => {
    const [index, setIndex] = useState(0)
    const [trackHeight, setTrackHeight] = useState()
    const slideRefs = useRef([])
    const count = bundles.length

    // Size the track to the active card so shorter/taller bundles don't leave a gap.
    useEffect(() => {
        const measure = () => {
            const el = slideRefs.current[index]
            if (el) setTrackHeight(el.offsetHeight)
        }
        measure()
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [index])

    if (count === 0) return null

    const prev = () => setIndex((i) => (i - 1 + count) % count)
    const next = () => setIndex((i) => (i + 1) % count)

    return (
        <div className="relative">
            {/* Track — height follows the active card */}
            <div
                className="overflow-hidden transition-[height] duration-400 ease-out"
                style={{ height: trackHeight }}
            >
                <motion.div
                    className="flex items-start"
                    animate={{ transform: `translateX(${-index * 100}%)` }}
                    transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                >
                    {bundles.map((bundle, i) => (
                        <div
                            key={bundle._id}
                            ref={(el) => (slideRefs.current[i] = el)}
                            className="w-full shrink-0 px-10"
                        >
                            <BundleCard {...bundle} variant="mobile" />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Arrows — flank the card, sitting in the section gutter */}
            {count > 1 && (
                <>
                    <button
                        onClick={prev}
                        aria-label="Previous bundle"
                        className="absolute left-0 top-[38%] -translate-y-1/2 z-10 rotate-180 text-black-custom cursor-pointer"
                    >
                        <Arrow />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Next bundle"
                        className="absolute right-0 top-[38%] -translate-y-1/2 z-10 text-black-custom cursor-pointer"
                    >
                        <Arrow />
                    </button>
                </>
            )}

            {/* Dots */}
            {count > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    {bundles.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            aria-label={`Go to bundle ${i + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === index ? "w-6 bg-black-custom" : "w-2 bg-black-custom/25"}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default BundleCarousel
