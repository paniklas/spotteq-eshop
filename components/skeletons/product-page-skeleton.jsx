import { Skeleton } from "@/components/ui/skeleton"

export default function ProductPageSkeleton() {
    return (
        <div className="bg-white-custom pt-40 pb-20">
            <div className="max-w-480 mx-auto page-x">
                <div className="flex flex-col md:flex-row gap-12 xl:gap-20 items-start">

                    {/* Left: image + tagline */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <div className="relative w-full aspect-square flex items-center justify-center">
                            <Skeleton className="w-[75%] aspect-square rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-48 rounded" />
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-9 w-3/4 rounded" />
                            <Skeleton className="h-9 w-1/2 rounded" />
                        </div>
                    </div>

                    {/* Right: details */}
                    <div className="w-full md:w-1/2 flex flex-col gap-6 pt-4">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <div className="flex items-baseline gap-4">
                            <Skeleton className="h-12 w-48 rounded" />
                            <Skeleton className="h-5 w-24 rounded" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-6 w-56 rounded" />
                            <Skeleton className="h-6 w-44 rounded" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-5 w-full rounded" />
                            <Skeleton className="h-5 w-full rounded" />
                            <Skeleton className="h-5 w-3/4 rounded" />
                            <Skeleton className="h-5 w-5/6 rounded" />
                        </div>
                        <Skeleton className="h-12 w-full rounded-full" />
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-20 rounded" />
                            <Skeleton className="h-10 w-28 rounded-full" />
                        </div>
                        <div className="flex gap-3">
                            <Skeleton className="h-12 flex-1 rounded-full" />
                            <Skeleton className="h-12 flex-1 rounded-full" />
                        </div>
                        <div className="flex flex-col gap-3 pt-2">
                            <Skeleton className="h-14 w-full rounded-full" />
                            <Skeleton className="h-14 w-full rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
