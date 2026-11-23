import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Link } from "@/i18n/navigation";

// Section headings are H2 blocks in Studio, shown underlined at body size;
// their casing is as typed.
const components = {
    block: {
        normal: ({ children }) => <p className="mt-3">{children}</p>,
        h2: ({ children }) => <h2 className="mt-10 xl:mt-12 underline underline-offset-2">{children}</h2>,
        h3: ({ children }) => <h3 className="mt-8 underline underline-offset-2">{children}</h3>,
    },
    list: {
        bullet: ({ children }) => <ul className="mt-3 list-disc pl-6">{children}</ul>,
        // Numbered steps (Shipping & Payments) are spaced apart like paragraphs.
        number: ({ children }) => <ol className="mt-3 list-decimal pl-6 space-y-3">{children}</ol>,
    },
    marks: {
        // Site paths (/contact) stay in the current language via the i18n Link;
        // mailto opens in place; anything else is external, in a new tab.
        link: ({ value, children }) => {
            const href = value?.href || "";
            if (href.startsWith("/")) {
                return <Link href={href} className="underline">{children}</Link>;
            }
            if (href.startsWith("mailto:")) {
                return <a href={href} className="underline">{children}</a>;
            }
            return (
                <a href={href} target="_blank" rel="noopener noreferrer" className="underline">
                    {children}
                </a>
            );
        },
    },
};

// Privacy / Terms / Cookies / Shipping & Payments / Returns page body: heading, then the
// Sanity text. pt keeps it below the fixed navbar (h-24). The dot pattern sits
// at the viewport edge as on the contact page, so from lg the text keeps clear
// of it, and the min-height keeps a short page (Cookies) tall enough for the
// whole pattern: top-40 + 476px at lg, top-50 + 643px at xl, plus a gap.
const LegalPage = ({ heading, body }) => {
    return (
        <section id="legal-page-section" className="relative w-full bg-white-custom overflow-hidden pt-36 xl:pt-44 pb-20 xl:pb-32 lg:min-h-180 xl:min-h-235">
            <div className="max-w-480 mx-auto page-x">
                <div className="max-w-312.5 lg:pr-48 xl:pr-60 2xl:pr-0">
                    {heading && (
                        <h1 className="font-aeonik text-black text-[24px] xl:text-[26px] leading-tight">
                            {heading}
                        </h1>
                    )}

                    {body?.length > 0 && (
                        <div className="mt-8 xl:mt-10 font-aeonik text-black text-[14px] xl:text-[15px] leading-[1.45] *:first:mt-0">
                            <PortableText value={body} components={components} />
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

export default LegalPage;
