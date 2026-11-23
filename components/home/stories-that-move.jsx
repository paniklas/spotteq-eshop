import Image from "next/image";
import { getTranslations } from "next-intl/server";

const AMBASSADOR_IMG = "/images/ghavelas.webp";

// The home page is force-static: there is no request at build time, so the
// locale must be passed explicitly — without it next-intl falls back to the
// default (el) and /en would render the Greek copy.
const StoriesThatMove = async ({ locale }) => {
    const t = await getTranslations({ locale, namespace: "home.storiesThatMove" });

    return (
        <section
            id="stories-that-move-section"
            className="w-full bg-white-custom"
        >
            <div className="max-w-480 mx-auto page-x">
                {/* Mobile layout — heading, image, then testimonial */}
                <div className="md:hidden py-8">
                    <span className="font-aeonik text-[18px] text-black">
                        Stories that move
                    </span>

                    <div className="relative w-full h-57.5 overflow-hidden mt-4">
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
                </div>

                {/* Tablet / desktop layout */}
                <div className="hidden md:block pt-16 xl:pt-24">
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
                                <p className="font-tt text-[16px] xl:text-[20px] text-black-custom leading-[1.45] mb-2">
                                    {t("role")}
                                </p>
                            </div>

                            <blockquote className="font-tt text-[16px] xl:text-[18px] text-black-custom leading-[1.6] max-w-[653px]">
                                {t("quote")}
                            </blockquote>
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