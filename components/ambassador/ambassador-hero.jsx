import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { ArrowDown } from "lucide-react";

const bodyComponents = {
    block: {
        normal: ({ children }) => <p className="mt-4 first:mt-0">{children}</p>,
    },
};

const achievementComponents = {
    list: {
        bullet: ({ children }) => <ul className="list-disc pl-5 xl:pl-6 marker:text-[0.7em]">{children}</ul>,
    },
};

// Ambassador page, first (light gray) section: the label, the hero card with the
// name over the photo, then the journey text and achievements. The medal photo
// sits at the bottom right: from md it is taken out of the flow and centred on
// the section's bottom edge, so it straddles the white story section below
// (z-10 keeps it above that section) without pushing the achievements down.
// pt keeps the label below the fixed navbar (h-24). Sizes were measured off the
// design at lg (1280px+) and scaled up for xl (1536px+).
const AmbassadorHero = ({ page }) => {
    const { label, heroImageUrl, heroImageAlt, name, subtitle, tagline, journeyHeading, journeyBody, achievements, medalImageUrl, medalImageAlt } = page;

    return (
        <section id="ambassador-hero-section" className="relative w-full bg-gray-light pt-32 lg:pt-36 xl:pt-44">
            {/* The bottom padding lives on the inner wrapper so the medal photo can
                anchor to the section's bottom edge at the content's right edge */}
            <div className="max-w-480 mx-auto page-x">
                <div className="relative pb-14 md:pb-20 lg:pb-28 xl:pb-36">
                    {label && (
                        <p className="font-aeonik text-black-custom text-[20px] lg:text-[28px] xl:text-[34px] leading-tight">{label}</p>
                    )}

                    {/* Hero card — taller than wide on phones so the text fits over the photo */}
                    <div className="relative mt-5 lg:mt-7 xl:mt-9 w-full h-140 md:h-auto md:aspect-[2.24/1] rounded-[14px] overflow-hidden bg-gray-text">
                        {heroImageUrl && (
                            <Image
                                src={heroImageUrl}
                                alt={heroImageAlt || ""}
                                unoptimized={true}
                                fill
                                priority
                                sizes="(min-width: 1920px) 1872px, 100vw"
                                className="object-cover object-[72%_center] md:object-center"
                            />
                        )}
                        {/* Light shade on the left so the white text stays readable */}
                        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-black/30 via-black/10 to-transparent md:from-black/15 md:via-transparent" />

                        <div className="absolute inset-0 flex flex-col px-6 md:px-[3.7%] pt-10 md:pt-[11%] pb-6 md:pb-[3.5%] text-white-custom">
                            {name && (
                                <h1 className="font-aeonik text-[30px] md:text-[36px] lg:text-[46px] xl:text-[58px] leading-tight">{name}</h1>
                            )}
                            {subtitle && (
                                <p className="mt-3 lg:mt-5 font-aeonik text-[18px] md:text-[22px] lg:text-[30px] xl:text-[38px] leading-[1.25] whitespace-pre-line">{subtitle}</p>
                            )}
                            <div className="mt-auto">
                                {tagline && (
                                    <p className="font-aeonik text-[15px] md:text-[17px] lg:text-[24px] xl:text-[30px] leading-[1.35] whitespace-pre-line">{tagline}</p>
                                )}
                                <a
                                    href="#ambassador-journey"
                                    aria-label={journeyHeading || undefined}
                                    className="mt-6 lg:mt-12 xl:mt-14 inline-flex hover:opacity-70 transition-opacity"
                                >
                                    <ArrowDown strokeWidth={1} className="size-7 lg:size-9 xl:size-11" aria-hidden="true" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Journey — the hero arrow scrolls here; scroll-mt clears the fixed navbar */}
                    <div id="ambassador-journey" className="scroll-mt-28 mt-16 lg:mt-28 xl:mt-36 md:max-w-[75%] font-aeonik text-black-custom">
                        {journeyHeading && (
                            <h2 className="text-[24px] md:text-[28px] lg:text-[34px] xl:text-[44px] leading-tight">{journeyHeading}</h2>
                        )}
                        {journeyBody?.length > 0 && (
                            <div className="mt-6 lg:mt-12 xl:mt-14 text-[15px] lg:text-[20px] xl:text-[24px] leading-normal">
                                <PortableText value={journeyBody} components={bodyComponents} />
                            </div>
                        )}
                    </div>

                    {achievements?.length > 0 && (
                        <div className="mt-12 lg:mt-24 xl:mt-30 md:pl-4 xl:pl-6 font-aeonik text-black-custom text-[16px] lg:text-[20px] xl:text-[26px] leading-[1.75]">
                            <PortableText value={achievements} components={achievementComponents} />
                        </div>
                    )}

                    {medalImageUrl && (
                        <div className="relative z-10 mt-10 md:mt-0 w-full md:w-[36%] aspect-[3/2] rounded-[14px] overflow-hidden md:absolute md:right-0 md:bottom-0 md:translate-y-1/2">
                            <Image
                                src={medalImageUrl}
                                alt={medalImageAlt || ""}
                                unoptimized={true}
                                fill
                                sizes="(min-width: 1024px) 36vw, 100vw"
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AmbassadorHero;
