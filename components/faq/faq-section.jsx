import Image from "next/image";
import { PortableText } from "@portabletext/react";
import FaqAccordion from "./faq-accordion";

// Closing line under the sections: plain text with the sales@ mailto.
const closingComponents = {
    block: {
        normal: ({ children }) => <p>{children}</p>,
    },
    marks: {
        link: ({ value, children }) => (
            <a href={value?.href} className="underline underline-offset-2">{children}</a>
        ),
    },
};

// FAQ page body on the contact page's light gray: heading, then each section's
// title over its questions. pt keeps it below the fixed navbar (h-24). The dot
// pattern sits at the viewport edge as on the legal pages, so from lg the
// questions keep clear of it.
const FaqSection = ({ heading, sections, closing }) => {
    return (
        <section id="faq-section" className="relative w-full bg-gray-light overflow-hidden pt-36 xl:pt-44 pb-20 xl:pb-32">
            <div className="max-w-480 mx-auto page-x">
                <div className="max-w-196">
                    {heading && (
                        <h1 className="font-aeonik text-black-custom text-[24px] xl:text-[26px] leading-tight">
                            {heading}
                        </h1>
                    )}

                    {sections?.map((section) => (
                        <div key={section._key} className="mt-14 xl:mt-18">
                            {section.title && (
                                <h2 className="font-aeonik text-gray-text text-[16px] xl:text-[17px] leading-tight">
                                    {section.title}
                                </h2>
                            )}
                            <FaqAccordion items={section.items ?? []} />
                        </div>
                    ))}

                    {closing?.length > 0 && (
                        <div className="mt-14 xl:mt-18 font-aeonik text-black-custom text-[14px] xl:text-[15px] leading-[1.45]">
                            <PortableText value={closing} components={closingComponents} />
                        </div>
                    )}
                </div>
            </div>

            <Image
                src="/icons/dots.svg"
                alt=""
                width={315}
                height={643}
                unoptimized={true}
                aria-hidden="true"
                className="hidden lg:block absolute top-40 xl:top-50 w-58.25 h-auto -right-22 xl:w-78.75 xl:-right-30 pointer-events-none"
            />
        </section>
    );
};

export default FaqSection;
