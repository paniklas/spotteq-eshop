import Image from "next/image";
import { getTranslations } from "next-intl/server";
import ContactForm from "./contact-form";

// Contact page hero: the athlete image on the left half, the form on the right
// over the light-gray panel with the dot pattern at the edge. pt-24 keeps the
// whole section below the fixed navbar (h-24). From md (1024px) the image and
// form sit side by side; below md the image fills a full-width band above a
// centred form.
const ContactSection = async ({ locale }) => {
    const t = await getTranslations({ locale, namespace: "contact" });

    return (
        <section id="contact-section" className="relative w-full bg-gray-light overflow-hidden pt-24">
            <div className="flex flex-col md:flex-row">

                {/* Image column — from md a fixed 864px (the design's height, and
                    about the form column's), never stretched to the row
                    (self-start), so the form growing (e.g. when validation errors
                    appear) can't re-crop the image. Cover until lg: at md widths
                    the photo shown whole would be shorter than the form beside it. */}
                <div className="relative w-full h-105 sm:h-140 md:w-1/2 md:h-216 md:self-start">
                    <Image
                        src="/images/contact-spotteq.webp"
                        alt=""
                        unoptimized={true}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover lg:object-contain"
                        priority
                    />
                </div>

                {/* Form column — from lg no right padding, so the dots can reach
                    the viewport edge (they're hidden below lg) */}
                <div className="w-full md:w-1/2 px-6 md:pl-10 lg:pl-16 lg:pr-0 pt-10 md:pt-16 lg:pt-20 pb-16 md:pb-8">
                    {/* Exactly as tall as the form, so the dots centre on it */}
                    <div className="relative lg:pr-40 xl:pr-58">
                        {/* Centred below md; left-aligned beside the image from md */}
                        <div className="relative z-10 w-full max-w-145 mx-auto md:mx-0">
                            <h1 className="font-aeonik text-black-custom text-[24px] xl:text-[26px] leading-tight">
                                {t("heading")}
                            </h1>
                            <p className="mt-4 mb-10 lg:mb-12 font-aeonik text-gray-text text-[15px] xl:text-[16px] leading-[1.3] whitespace-pre-line">
                                {t("intro")}
                            </p>
                            <ContactForm />
                        </div>

                        {/* Same dot pattern as the about hero: its inner column of
                            circles whole, the next one cut by the viewport edge.
                            Scaled down below xl, natural size from xl. */}
                        <Image
                            src="/icons/dots.svg"
                            alt=""
                            width={315}
                            height={643}
                            unoptimized={true}
                            aria-hidden="true"
                            className="hidden lg:block absolute top-1/2 -translate-y-1/2 w-58.25 h-auto -right-22 xl:w-78.75 xl:-right-30 pointer-events-none"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
