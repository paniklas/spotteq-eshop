"use client";

import { PortableText } from "@portabletext/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const answerComponents = {
    block: {
        normal: ({ children }) => <p className="mt-2 first:mt-0">{children}</p>,
    },
    list: {
        bullet: ({ children }) => <ul className="mt-2 first:mt-0 list-disc pl-5 space-y-1">{children}</ul>,
    },
    marks: {
        link: ({ value, children }) => {
            const href = value?.href || "";
            const external = /^https?:/.test(href);
            return (
                <a href={href} className="underline underline-offset-2" {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
                    {children}
                </a>
            );
        },
    },
};

// Thin + that animates into − while its question is open: the whole icon turns
// half a turn as the vertical bar rotates flat onto the horizontal one, and back
// on close. Driven by the trigger's aria-expanded, so no state of its own.
// transform-fill (fill-box) makes the bar rotate around its own centre.
const PlusMinusIcon = ({ className }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        aria-hidden="true"
        className={`${className} shrink-0 transition-transform duration-300 ease-out group-aria-expanded/accordion-trigger:rotate-180 motion-reduce:transition-none`}
    >
        <path d="M5 12h14" />
        <path
            d="M12 5v14"
            className="origin-center transform-fill transition-transform duration-300 ease-out group-aria-expanded/accordion-trigger:rotate-90 motion-reduce:transition-none"
        />
    </svg>
);

// Type sizes and spacing per size: "default" for the FAQ page, "large" for the
// ambassador interview, whose design draws the same boxes bigger.
const SIZES = {
    default: {
        list: "mt-5 gap-3",
        trigger: "px-4 xl:px-5 py-1.5 text-[14px] xl:text-[15px]",
        icon: "size-5.5",
        content: "px-4 xl:px-5 pb-4 text-[14px] xl:text-[15px]",
    },
    large: {
        list: "gap-3 lg:gap-6 xl:gap-7",
        trigger: "px-4 lg:px-6 xl:px-7 py-2.5 lg:py-4 xl:py-5 text-[14px] lg:text-[19px] xl:text-[23px]",
        icon: "size-6 lg:size-8 xl:size-9",
        content: "px-4 lg:px-6 xl:px-7 pb-4 lg:pb-6 text-[14px] lg:text-[17px] xl:text-[20px]",
    },
};

// One section's questions: white rounded boxes with the animated +/−. Uses the
// shadcn Accordion; its chevrons are hidden in favour of the design's icon.
const FaqAccordion = ({ items, size = "default" }) => {
    const s = SIZES[size] ?? SIZES.default;
    return (
        <Accordion type="single" collapsible className={s.list}>
            {items.map((item) => (
                <AccordionItem
                    key={item._key}
                    value={item._key}
                    className="bg-white-custom border border-black-custom/10 rounded-md"
                >
                    <AccordionTrigger
                        className={`items-center gap-4 rounded-md ${s.trigger} font-aeonik font-normal leading-snug text-black-custom hover:no-underline cursor-pointer [&>[data-slot=accordion-trigger-icon]]:hidden`}
                    >
                        <span>{item.question}</span>
                        <PlusMinusIcon className={s.icon} />
                    </AccordionTrigger>
                    {item.answer?.length > 0 && (
                        <AccordionContent className={`${s.content} font-aeonik leading-[1.45] text-black-custom`}>
                            <PortableText value={item.answer} components={answerComponents} />
                        </AccordionContent>
                    )}
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default FaqAccordion;
