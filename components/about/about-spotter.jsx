import Image from "next/image";
import { PortableText } from "@portabletext/react";

const AboutSpotter = ({ lines, body, imageUrl, imageAlt }) => {
    return (
        <section id="about-spotter-section" className="w-full pt-10 xl:pt-12">
            <div className="max-w-480 mx-auto page-x grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-10 xl:gap-16 items-start">

                {/* Text column */}
                <div className="font-aeonik text-black text-[16px] xl:text-[24px] leading-[1.5] max-w-[950px]">
                    {lines?.length > 0 && (
                        <div>
                            <PortableText value={lines} />
                        </div>
                    )}

                    {body?.length > 0 && (
                        <div className="mt-8 xl:mt-15 [&_p:not(:first-child)]:mt-6 xl:[&_p:not(:first-child)]:mt-10">
                            <PortableText value={body} />
                        </div>
                    )}
                </div>

                {/* Section image */}
                {imageUrl && (
                    <div className="relative w-full xl:w-[438px] h-[300px] xl:h-[450px]">
                        <Image
                            src={imageUrl}
                            alt={imageAlt || ""}
                            unoptimized={true}
                            fill
                            sizes="(max-width: 1536px) 100vw, 438px"
                            className="object-cover"
                        />
                    </div>
                )}
            </div>
        </section>
    )
}

export default AboutSpotter
