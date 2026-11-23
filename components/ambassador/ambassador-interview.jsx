import Image from "next/image";
import FaqAccordion from "@/components/faq/faq-accordion";

// Ambassador page, last (light gray) section: photo on the left, the short
// interview on the right as the FAQ page's accordion, in its large size.
const AmbassadorInterview = ({ page }) => {
    const { interviewImageUrl, interviewImageAlt, interviewHeading, interviewIntro, interviewItems } = page;
    if (!interviewItems?.length) return null;

    return (
        <section id="ambassador-interview-section" className="relative w-full bg-gray-light py-16 lg:py-20 xl:py-24">
            <div className="max-w-480 mx-auto page-x grid grid-cols-1 md:grid-cols-[38%_1fr] gap-10 md:gap-12 lg:gap-16 xl:gap-20 items-start">
                {interviewImageUrl && (
                    <div className="relative w-full aspect-[1512/1565] rounded-[14px] overflow-hidden">
                        <Image
                            src={interviewImageUrl}
                            alt={interviewImageAlt || ""}
                            unoptimized={true}
                            fill
                            sizes="(min-width: 1024px) 38vw, 100vw"
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="font-aeonik text-black-custom">
                    {interviewHeading && (
                        <h2 className="text-[24px] md:text-[28px] lg:text-[34px] xl:text-[44px] leading-tight">{interviewHeading}</h2>
                    )}
                    {interviewIntro && (
                        <p className="mt-2 lg:mt-4 text-[14px] lg:text-[18px] xl:text-[22px] leading-snug">{interviewIntro}</p>
                    )}
                    <div className="mt-8 lg:mt-20 xl:mt-24">
                        <FaqAccordion items={interviewItems} size="large" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AmbassadorInterview;
