import { Skeleton } from "@/components/ui/skeleton"

const ShopBySeriesSkeleton = () => (
    <section className="w-full bg-white-custom py-10 xl:py-14">
        <div className="max-w-480 mx-auto page-x">
            <Skeleton className="h-9 w-48 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="w-full rounded-[25px]" style={{ aspectRatio: "787/518" }} />
                <Skeleton className="w-full rounded-[25px]" style={{ aspectRatio: "787/518" }} />
            </div>
        </div>
    </section>
)

export default ShopBySeriesSkeleton
