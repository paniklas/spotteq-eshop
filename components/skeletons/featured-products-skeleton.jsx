import { Skeleton } from "@/components/ui/skeleton"

const bar = "bg-gray-soft"

const FeaturedProductsSkeleton = () => (
    <section className="w-full bg-white-custom py-10 xl:py-24">
        <div className="max-w-480 mx-auto page-x pt-10 xl:pt-20">
            {/* Header */}
            <div className="md:flex md:items-start md:justify-between mb-6">
                <Skeleton className={`h-8 xl:h-9 w-60 mb-4 md:mb-0 ${bar}`} />
                <Skeleton className={`hidden md:block h-16 w-163 md:mb-12 ${bar}`} />
                <Skeleton className={`hidden xl:block h-10.25 w-35 rounded-[20.5px] ${bar}`} />
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <Skeleton className={`w-full rounded-[25px] ${bar}`} style={{ aspectRatio: "3/4" }} />
                <Skeleton className={`hidden md:block w-full rounded-[25px] ${bar}`} style={{ aspectRatio: "3/4" }} />
                <Skeleton className={`hidden xl:block w-full rounded-[25px] ${bar}`} style={{ aspectRatio: "3/4" }} />
                <Skeleton className={`hidden xl:block w-full rounded-[25px] ${bar}`} style={{ aspectRatio: "3/4" }} />
            </div>
        </div>
    </section>
)

export default FeaturedProductsSkeleton
