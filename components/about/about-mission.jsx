import Image from "next/image";
import { PortableText } from "@portabletext/react";

const AboutMission = ({ heading, body, imageUrl, imageAlt }) => {
    return (
        <section id="about-mission-section" className="w-full pt-14 xl:pt-25 pb-14 xl:pb-25">
            <div className="max-w-480 mx-auto page-x">

                {heading && (
                    <h2 className="font-aeonik text-black text-[28px] xl:text-[48px] leading-[1.25] whitespace-pre-line">
                        {heading}
                    </h2>
                )}

                <div className="mt-10 xl:mt-22 grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-10 xl:gap-16 items-start">

                    {/* Text column */}
                    {body?.length > 0 && (
                        <div className="font-aeonik text-black text-[16px] xl:text-[24px] leading-[1.5] max-w-[950px] [&_p:not(:first-child)]:mt-6 xl:[&_p:not(:first-child)]:mt-10">
                            <PortableText value={body} />
                        </div>
                    )}

                    {/* Section image */}
                    {imageUrl && (
                        <div className="relative w-full xl:w-[575px] h-[320px] xl:h-[500px]">
                            <Image
                                src={imageUrl}
                                alt={imageAlt || ""}
                                unoptimized={true}
                                fill
                                sizes="(max-width: 1536px) 100vw, 575px"
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default AboutMission
