import { PortableText } from "@portabletext/react";

const bodyComponents = {
    block: {
        normal: ({ children }) => <p className="mt-5 lg:mt-8 xl:mt-10 first:mt-0">{children}</p>,
    },
};

// Ambassador page, white section: the story paragraphs (kept left of the medal
// photo that overlaps from the section above) and the large SPOTTEQ quote.
const AmbassadorStory = ({ body, quote }) => {
    if (!body?.length && !quote) return null;

    return (
        <section id="ambassador-story-section" className="relative w-full bg-white-custom pt-14 md:pt-20 xl:pt-24 pb-20 xl:pb-28">
            <div className="max-w-480 mx-auto page-x font-aeonik text-black-custom">
                {body?.length > 0 && (
                    <div className="md:max-w-[56%] text-[14px] lg:text-[17px] xl:text-[21px] leading-normal">
                        <PortableText value={body} components={bodyComponents} />
                    </div>
                )}
                {quote && (
                    <p className="mt-16 md:mt-28 xl:mt-32 max-w-[92%] text-[22px] md:text-[30px] lg:text-[38px] xl:text-[48px] leading-[1.3] whitespace-pre-line">
                        {quote}
                    </p>
                )}
            </div>
        </section>
    );
};

export default AmbassadorStory;
