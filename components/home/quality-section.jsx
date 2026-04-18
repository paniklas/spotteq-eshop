import Image from "next/image";

const ATHLETE_IMG = "/images/certified-quality.webp";


const QualitySection = () => {
    return (
        <section className="w-full bg-gray-light overflow-hidden">
            <div className="max-w-[1920px] mx-auto grid grid-cols-1 xl:grid-cols-2 page-x">
                {/* Text side */}
                <div className="py-16 xl:py-20 flex flex-col justify-center gap-8">
                    <h2 className="font-aeonik text-black text-[28px] xl:text-[35px] leading-[1.45]">
                        Built on certified quality
                    </h2>

                    <p className="font-aeonik text-black text-[16px] xl:text-[20px] leading-[1.2] max-w-[917px]">
                        SPOTTEQ products are manufactured in the European Union, in GMP- and
                        HACCP-certified facilities that comply with EU food and food
                        supplement standards. Each batch is produced under strict quality
                        controls, so you know exactly what goes into every scoop.
                    </p>

                    {/* Certification logos */}
                    <div className="flex items-center gap-6 mt-20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/gmp-logo.png" alt="GMP Certified" className="h-20 w-auto" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/haccp-logo.png" alt="HACCP Certified" className="h-[78px] w-auto" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/isoqar-logo.png" alt="ISOQAR Certified" className="h-[79px] w-auto object-contain" />
                    </div>
                </div>

                {/* Athlete image */}
                <div className="relative h-[400px] xl:h-[606px]">
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