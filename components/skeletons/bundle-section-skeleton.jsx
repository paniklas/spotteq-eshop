import { Skeleton } from "@/components/ui/skeleton"

const inner = "bg-black/10"

const HorizontalCardSkeleton = () => (
    <div className="rounded-[190px] bg-gray-mint p-8 xl:p-18 flex flex-row min-h-[420px] gap-6 xl:gap-10 animate-pulse">
        {/* Image */}
        <div className="flex items-center justify-center shrink-0">
            <div className={`w-28 h-72 rounded-full ${inner}`} />
        </div>
        {/* Content */}
        <div className="flex-1 flex flex-col justify-between py-6">
            <div className="flex flex-col gap-3">
                <div className={`h-7 w-3/4 rounded-md ${inner}`} />
                <div className={`h-5 w-1/2 rounded-md ${inner}`} />
                <div className={`h-5 w-2/3 rounded-md ${inner}`} />
                <div className={`h-4 w-full rounded-md mt-2 ${inner}`} />
                <div className={`h-4 w-5/6 rounded-md ${inner}`} />
            </div>
            <div className="flex items-end justify-between mt-6">
                <div className="flex flex-col gap-2">
                    <div className={`h-12 w-24 rounded-md ${inner}`} />
                    <div className={`h-4 w-20 rounded-md ${inner}`} />
                </div>
                <div className="flex flex-col gap-2 min-w-[150px]">
                    <div className={`h-11 w-full rounded-full ${inner}`} />
                    <div className={`h-11 w-full rounded-full ${inner}`} />
                </div>
            </div>
        </div>
    </div>
)

const VerticalCardSkeleton = () => (
    <div className="rounded-[190px] bg-gray-mint p-8 xl:p-10 flex flex-col min-h-[520px] animate-pulse">
        {/* Image */}
        <div className="flex items-end justify-center pt-10 px-8">
            <div className={`w-32 h-60 rounded-full ${inner}`} />
        </div>
        {/* Content */}
        <div className="flex flex-col flex-1 p-8 gap-3">
            <div className={`h-7 w-3/4 rounded-md ${inner}`} />
            <div className={`h-5 w-1/2 rounded-md ${inner}`} />
            <div className={`h-5 w-2/3 rounded-md ${inner}`} />
            <div className={`h-4 w-full rounded-md mt-2 ${inner}`} />
            <div className={`h-4 w-5/6 rounded-md ${inner}`} />
            <div className="flex items-center justify-between mt-auto pt-4">
                <div className={`h-12 w-20 rounded-md ${inner}`} />
            </div>
            <div className="flex gap-3">
                <div className={`h-10 flex-1 rounded-full ${inner}`} />
                <div className={`h-10 flex-1 rounded-full ${inner}`} />
            </div>
        </div>
    </div>
)

const BundleSectionSkeleton = () => (
    <section className="w-full bg-gray-light py-16 xl:py-24">
        <div className="max-w-480 mx-auto page-x">
            {/* Header */}
            <div className="flex items-center justify-between mb-20">
                <Skeleton className="h-9 w-44 bg-gray-mint" />
                <Skeleton className="h-5 w-[500px] bg-gray-mint hidden md:block" />
                <Skeleton className="h-10 w-40 rounded-full bg-gray-mint hidden xl:block" />
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HorizontalCardSkeleton />
                <HorizontalCardSkeleton />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 mt-6">
                <VerticalCardSkeleton />
                <HorizontalCardSkeleton />
            </div>
        </div>
    </section>
)

export default BundleSectionSkeleton
