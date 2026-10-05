import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";

const AMBASSADOR_IMG = "/images/ghavelas.webp";
const STORY_DATE = new Date("2026-02-06T00:00:00Z");

// The home page is force-static: there is no request at build time, so the
// locale must be passed explicitly — without it next-intl falls back to the
// default (el) and /en would render the Greek copy.
const StoriesThatMove = async ({ locale }) => {
    const [t, format] = await Promise.all([
        getTranslations({ locale, namespace: "home.storiesThatMove" }),
        getFormatter({ locale }),
    ]);
    // "6 Φεβ 2026" / "Feb 6, 2026"
    const storyDate = format.dateTime(STORY_DATE, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

    return (
        <section
            id="stories-that-move-section"
            className="w-full bg-gray-light"
        >
            <div className="max-w-480 mx-auto page-x">
                {/* Mobile layout — heading, image, then testimonial + dots */}
                <div className="md:hidden py-8">
                    <span className="font-aeonik text-[18px] text-black">
                        Stories that move
                    </span>

                    <div className="relative w-full h-[230px] overflow-hidden mt-4">
                        <Image
                            src={AMBASSADOR_IMG}
                            alt={t("imageAlt")}
                            fill
                            // Full width minus the page-x gutters (px-6) on mobile
                            sizes="calc(100vw - 48px)"
                            className="object-cover"
                        />
                    </div>

                    <h3 className="font-aeonik text-[26px] text-black-custom leading-[1.3] mt-8">
                        {t("name")}
                    </h3>
                    <p className="font-tt text-[16px] text-black-custom leading-[1.45] mt-1">
                        {t("role")}
                    </p>

                    <blockquote className="font-tt text-[14px] text-black-custom leading-[1.6] mt-8">
                        {t("quote")}
                    </blockquote>

                    <div className="flex items-center justify-center gap-2 mt-8">
                        <span className="w-6 h-2 rounded-full bg-black-custom" />
                        <span className="w-2 h-2 rounded-full bg-black-custom/25" />
                        <span className="w-2 h-2 rounded-full bg-black-custom/25" />
                        <span className="w-2 h-2 rounded-full bg-black-custom/25" />
                    </div>
                </div>

                {/* Tablet / desktop layout */}
                <div className="hidden md:block">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
                    {/* Text */}
                    <div className="flex flex-col justify-between h-full py-6 xl:py-12">
                        <span className="font-aeonik text-[18px] xl:text-[20px] text-black">
                            Stories that move
                        </span>

                        <div className="flex flex-col gap-10 mt-4">
                            <div>
                                <h3 className="font-aeonik text-[26px] xl:text-[30px] text-black-custom leading-[1.45]">
                                    {t("name")}
                                </h3>
                                <div className="flex justify-between items-center gap-4 mb-2">
                                    <p className="font-tt text-[16px] xl:text-[20px] text-black-custom leading-[1.45]">
                                        {t("role")}
                                    </p>
                                    <p className="font-tt text-[14px] text-black-custom">
                                        {storyDate}
                                    </p>
                                </div>
                            </div>

                            <blockquote className="font-tt text-[16px] xl:text-[18px] text-black-custom leading-[1.6] max-w-[653px]">
                                {t("quote")}
                            </blockquote>
                        </div>

                        {/* Carousel controls */}
                        <div className="flex items-center gap-3 mt-20">
                            {/* Left arrow */}
                            <button aria-label={t("previous")} className="w-10 h-10 flex items-center justify-center shrink-0 rotate-180 rounded-full hover:bg-gray-mint cursor-pointer transition-colors duration-300">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M30.5303 20.5303C30.8232 20.2374 30.8232 19.7626 30.5303 19.4697L25.7574 14.6967C25.4645 14.4038 24.9896 14.4038 24.6967 14.6967C24.4038 14.9896 24.4038 15.4645 24.6967 15.7574L28.9393 20L24.6967 24.2426C24.4038 24.5355 24.4038 25.0104 24.6967 25.3033C24.9896 25.5962 25.4645 25.5962 25.7574 25.3033L30.5303 20.5303ZM10 20L10 20.75L30 20.75L30 20L30 19.25L10 19.25L10 20Z" fill="black"/>
                                </svg>

                            </button>
                            {/* Right arrow */}
                            <button aria-label={t("next")} className="w-10 h-10 flex items-center justify-center shrink-0 rounded-full hover:bg-gray-mint cursor-pointer transition-colors duration-300">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M30.5303 20.5303C30.8232 20.2374 30.8232 19.7626 30.5303 19.4697L25.7574 14.6967C25.4645 14.4038 24.9896 14.4038 24.6967 14.6967C24.4038 14.9896 24.4038 15.4645 24.6967 15.7574L28.9393 20L24.6967 24.2426C24.4038 24.5355 24.4038 25.0104 24.6967 25.3033C24.9896 25.5962 25.4645 25.5962 25.7574 25.3033L30.5303 20.5303ZM10 20L10 20.75L30 20.75L30 20L30 19.25L10 19.25L10 20Z" fill="black"/>
                                </svg>
                            </button>
                            {/* Progress line */}
                            <div className="flex items-center">
                                <div className="w-[89px] border-t-[3px] border-black" />
                                <div className="w-[89px] border-t border-black/50" />
                                <div className="w-[89px] border-t border-black/50" />
                            </div>
                        </div>
                    </div>

                    {/* Ambassador image */}
                    <div className="relative h-[500px] xl:h-[606px] overflow-hidden">
                        <Image
                            src={AMBASSADOR_IMG}
                            alt={t("imageAlt")}
                            fill
                            sizes="(max-width: 1280px) 100vw, 50vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
                </div>
            </div>
        </section>
    )
}

export default StoriesThatMove