import { Skeleton } from "@/components/ui/skeleton"

const bar = "bg-gray-mint"

const AboutPageSkeleton = () => (
    <>
        {/* Hero */}
        <section className="w-full pt-32 xl:pt-60">
            <div className="max-w-480 mx-auto page-x">
                <Skeleton className={`h-9 xl:h-14 w-4/5 xl:w-[620px] ${bar}`} />
                <Skeleton className={`h-9 xl:h-14 w-3/5 xl:w-[560px] mt-3 ${bar}`} />
                <Skeleton className={`mt-8 xl:mt-12 ml-auto w-full xl:w-[1140px] h-[220px] sm:h-[320px] xl:h-[523px] ${bar}`} />
            </div>
        </section>

        {/* Spotter section */}
        <section className="w-full pt-10 xl:pt-12">
            <div className="max-w-480 mx-auto page-x grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-10 xl:gap-16 items-start">
                <div className="max-w-[950px] w-full">
                    <Skeleton className={`h-5 xl:h-7 w-full ${bar}`} />
                    <Skeleton className={`h-5 xl:h-7 w-11/12 mt-3 ${bar}`} />
                    <Skeleton className={`h-5 xl:h-7 w-10/12 mt-3 ${bar}`} />

                    <div className="mt-8 xl:mt-15">
                        <Skeleton className={`h-4 xl:h-6 w-full ${bar}`} />
                        <Skeleton className={`h-4 xl:h-6 w-full mt-3 ${bar}`} />
                        <Skeleton className={`h-4 xl:h-6 w-2/3 mt-3 ${bar}`} />
                    </div>

                    <div className="mt-6 xl:mt-10">
                        <Skeleton className={`h-4 xl:h-6 w-full ${bar}`} />
                        <Skeleton className={`h-4 xl:h-6 w-full mt-3 ${bar}`} />
                        <Skeleton className={`h-4 xl:h-6 w-3/4 mt-3 ${bar}`} />
                    </div>
                </div>

                <Skeleton className={`w-full xl:w-[438px] h-[300px] xl:h-[450px] ${bar}`} />
            </div>
        </section>

        {/* Mission section */}
        <section className="w-full pt-14 xl:pt-25 pb-14 xl:pb-25">
            <div className="max-w-480 mx-auto page-x">
                <Skeleton className={`h-8 xl:h-12 w-full xl:w-[1330px] ${bar}`} />
                <Skeleton className={`h-8 xl:h-12 w-4/5 xl:w-[1180px] mt-3 ${bar}`} />

                <div className="mt-10 xl:mt-22 grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-10 xl:gap-16 items-start">
                    <div className="max-w-[950px] w-full">
                        <Skeleton className={`h-4 xl:h-6 w-full ${bar}`} />
                        <Skeleton className={`h-4 xl:h-6 w-full mt-3 ${bar}`} />
                        <Skeleton className={`h-4 xl:h-6 w-full mt-3 ${bar}`} />
                        <Skeleton className={`h-4 xl:h-6 w-1/2 mt-3 ${bar}`} />

                        <div className="mt-6 xl:mt-10">
                            <Skeleton className={`h-4 xl:h-6 w-full ${bar}`} />
                            <Skeleton className={`h-4 xl:h-6 w-full mt-3 ${bar}`} />
                            <Skeleton className={`h-4 xl:h-6 w-2/3 mt-3 ${bar}`} />
                        </div>

                        <div className="mt-6 xl:mt-10">
                            <Skeleton className={`h-4 xl:h-6 w-full ${bar}`} />
                            <Skeleton className={`h-4 xl:h-6 w-full mt-3 ${bar}`} />
                            <Skeleton className={`h-4 xl:h-6 w-full mt-3 ${bar}`} />
                            <Skeleton className={`h-4 xl:h-6 w-1/3 mt-3 ${bar}`} />
                        </div>
                    </div>

                    <Skeleton className={`w-full xl:w-[575px] h-[320px] xl:h-[500px] ${bar}`} />
                </div>
            </div>
        </section>
    </>
)

export default AboutPageSkeleton
