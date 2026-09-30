"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import ProductCard from "./product-card"

const ProductCarousel = ({ products = [] }) => {
    const [index, setIndex] = useState(0)
    const count = products.length
    // Set once a drag actually starts, so releasing a swipe over a card link/button doesn't click it.
    const draggedRef = useRef(false)

    if (count === 0) return null

    const goTo = (i) => setIndex(Math.max(0, Math.min(count - 1, i)))

    return (
        <div className="relative">
            <div className="overflow-hidden">
                <motion.div
                    className="flex"
                    animate={{ transform: `translateX(${-index * 100}%)` }}
                    transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onPointerDownCapture={() => { draggedRef.current = false }}
                    onDragStart={() => { draggedRef.current = true }}
                    onClickCapture={(e) => {
                        // detail 0 = keyboard-activated click; never swallow those.
                        if (!draggedRef.current || e.detail === 0) return
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    onDragEnd={(_, info) => {
                        const threshold = 50
                        if (info.offset.x < -threshold) goTo(index + 1)
                        else if (info.offset.x > threshold) goTo(index - 1)
                    }}
                >
                    {products.map((product) => (
                        <div key={product._id} className="w-full shrink-0 px-1">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </motion.div>
            </div>

            {count > 1 && (
                <div className="flex items-center justify-center gap-2 mt-2">
                    {products.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`Go to product ${i + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === index ? "w-6 bg-black-custom" : "w-2 bg-black-custom/25"}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductCarousel
