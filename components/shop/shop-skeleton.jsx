import { Skeleton } from "@/components/ui/skeleton"

const ProductCardSkeleton = () => (
    <div className="flex flex-col gap-4">
        <Skeleton className="w-full aspect-[1/1.2] rounded-sm" />
        <Skeleton className="h-3 w-20" />
        <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-6 w-14" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="flex justify-between">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex flex-col gap-2 items-end">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
            </div>
        </div>
    </div>
)

const ShopSkeleton = () => (
    <section className="pt-24 min-h-screen bg-white-custom pb-10 xl:pb-42">
        <div className="max-w-480 mx-auto page-x">
            <div className="flex flex-col md:flex-row gap-16 xl:gap-24 py-16">

                {/* Sidebar skeleton */}
                <aside className="w-full md:w-60 xl:w-105 shrink-0">
                    <Skeleton className="h-10 w-48 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-4/5 mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-16" />
                    <Skeleton className="h-6 w-28 mb-12" />

                    <div className="mt-8">
                        <Skeleton className="h-3 w-32 mb-4" />
                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    </div>

                    <div className="mt-12">
                        <Skeleton className="h-3 w-24 mb-4" />
                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-44" />
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </div>
                </aside>

                {/* Product grid skeleton */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    </section>
)

export default ShopSkeleton
