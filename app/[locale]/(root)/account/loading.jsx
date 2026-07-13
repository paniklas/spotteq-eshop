import { Skeleton } from "@/components/ui/skeleton";

// Streamed while the (force-dynamic) account pages fetch their data. It renders
// inside account/layout.jsx (the sidebar is already shown), so this only fills
// the content column — mirroring the overview page so the post-login / handshake
// redirect lands on the dashboard shape instead of a blank screen.
export default function AccountLoading() {
    return (
        <div className="flex flex-col gap-6">
            {/* Welcome card */}
            <div className="bg-white-custom rounded-2xl p-6 xl:p-8 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-8 w-56" />
                    <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="w-16 h-16 rounded-full shrink-0" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white-custom rounded-2xl p-5 xl:p-6 flex flex-col gap-3">
                        <Skeleton className="w-5 h-5 rounded" />
                        <Skeleton className="h-7 w-16" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                ))}
            </div>

            {/* Recent orders */}
            <div className="bg-white-custom rounded-2xl p-6 xl:p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-lg" />
                                <div className="flex flex-col gap-1.5">
                                    <Skeleton className="h-3.5 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="bg-white-custom rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                        <Skeleton className="w-5 h-5 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}
