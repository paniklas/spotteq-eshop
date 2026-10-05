import Image from "next/image";
import { getTranslations } from "next-intl/server";

const ATHLETE_IMG = "/images/certified-quality.webp";


// Explicit locale: on the force-static home page next-intl has no request to
// read it from (see stories-that-move). Every page using this section passes it.
const QualitySection = async ({ locale }) => {
    const t = await getTranslations({ locale, namespace: "home.quality" });

    return (
        <section
            id="quality-section-section"
            className="w-full bg-gray-light overflow-hidden"
        >
            <div className="max-w-480 mx-auto grid grid-cols-1 xl:grid-cols-2 page-x">
                {/* Text side */}
                <div className="order-2 xl:order-1 py-10 xl:py-20 flex flex-col justify-center gap-6 xl:gap-8">
                    <h2 className="font-aeonik text-black text-[28px] xl:text-[35px] leading-[1.45]">
                        High-Standard Quality
                    </h2>

                    <p className="font-aeonik text-black text-[16px] xl:text-[20px] leading-[1.2] max-w-229.25">
                        {t("description")}
                    </p>

                    {/* Certification logos */}
                    <div className="flex items-center gap-4 xl:gap-6 mt-4 xl:mt-20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/gmp-logo.png" alt="GMP Certified" className="h-14 xl:h-20 w-auto" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/haccp-logo.png" alt="HACCP Certified" className="h-13.5 xl:h-19.5 w-auto" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/isoqar-logo.png" alt="ISOQAR Certified" className="h-13.75 xl:h-19.75 w-auto object-contain" />
                    </div>
                </div>

                {/* Athlete image — full-bleed on mobile */}
                <div className="order-1 xl:order-2 relative h-[340px] xl:h-[606px] -mx-4 xl:mx-0">
                    <Image
                        src={ATHLETE_IMG}
                        alt="SPOTTEQ athlete"
                        fill
                        sizes="(max-width: 1280px) 100vw, 50vw"
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </section>
    )
}

export default QualitySection