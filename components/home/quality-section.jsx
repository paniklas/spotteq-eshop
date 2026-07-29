import Image from "next/image";

const ATHLETE_IMG = "/images/certified-quality.webp";


const QualitySection = () => {
    return (
        <section
            id="quality-section-section"
            className="w-full bg-gray-light overflow-hidden"
        >
            <div className="max-w-480 mx-auto grid grid-cols-1 xl:grid-cols-2 page-x">
                {/* Text side */}
                <div className="order-2 xl:order-1 py-10 xl:py-20 flex flex-col justify-center gap-6 xl:gap-8">
                    <h2 className="font-aeonik text-black text-[28px] xl:text-[35px] leading-[1.45]">
                        Built on certified quality
                    </h2>

                    <p className="font-aeonik text-black text-[16px] xl:text-[20px] leading-[1.2] max-w-229.25">
                        SPOTTEQ products are manufactured in the European Union, in GMP- and
                        HACCP-certified facilities that comply with EU food and food
                        supplement standards. Each batch is produced under strict quality
                        controls, so you know exactly what goes into every scoop.
                    </p>

                    {/* Certification logos */}
                    <div className="flex items-center gap-4 xl:gap-6 mt-4 xl:mt-20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/gmp-logo.png" alt="GMP Certified" className="h-14 xl:h-20 w-auto" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/haccp-logo.png" alt="HACCP Certified" className="h-[54px] xl:h-[78px] w-auto" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/isoqar-logo.png" alt="ISOQAR Certified" className="h-[55px] xl:h-[79px] w-auto object-contain" />
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