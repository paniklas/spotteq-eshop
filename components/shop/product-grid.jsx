"use client"

import { useState, useTransition } from "react"
import ProductCard from "@/components/home/product-card"
import { loadMoreProducts } from "@/app/actions/products"

const ProductGrid = ({ initialProducts, total, locale, categoryIds = [], productIds = [] }) => {
    const [extraProducts, setExtraProducts] = useState([])
    const [isPending, startTransition] = useTransition()
    const products = [...initialProducts, ...extraProducts]
    const hasMore = products.length < total

    const handleLoadMore = () => {
        startTransition(async () => {
            const more = await loadMoreProducts(locale, products.length, categoryIds, productIds)
            setExtraProducts(prev => [...prev, ...more])
        })
    }

    if (products.length === 0) {
        return (
            <p className="font-aeonik text-[18px] text-black-custom">
                No products found.
            </p>
        )
    }

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16">
                {products.map((product, i) => (
                    <ProductCard key={product._id} product={product} priority={i < 2} />
                ))}
            </div>

            {hasMore && (
                <div className="mt-16 flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={isPending}
                        className="h-12 px-10 bg-black-custom rounded-[21px] font-aeonik text-white-custom text-[14px] tracking-wide hover:bg-white-custom hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProductGrid
