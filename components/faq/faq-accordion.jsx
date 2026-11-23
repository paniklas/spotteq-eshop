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
const PlusMinusIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        aria-hidden="true"
        className="size-5.5 shrink-0 transition-transform duration-300 ease-out group-aria-expanded/accordion-trigger:rotate-180 motion-reduce:transition-none"
    >
        <path d="M5 12h14" />
        <path
            d="M12 5v14"
            className="origin-center transform-fill transition-transform duration-300 ease-out group-aria-expanded/accordion-trigger:rotate-90 motion-reduce:transition-none"
        />
    </svg>
);

// One section's questions: white rounded boxes with the animated +/−. Uses the
// shadcn Accordion; its chevrons are hidden in favour of the design's icon.
const FaqAccordion = ({ items }) => {
    return (
        <Accordion type="single" collapsible className="mt-5 gap-3">
            {items.map((item) => (
                <AccordionItem
                    key={item._key}
                    value={item._key}
                    className="bg-white-custom border border-black-custom/10 rounded-md"
                >
                    <AccordionTrigger
                        className="items-center gap-4 rounded-md px-4 xl:px-5 py-1.5 font-aeonik font-normal text-[14px] xl:text-[15px] leading-snug text-black-custom hover:no-underline cursor-pointer [&>[data-slot=accordion-trigger-icon]]:hidden"
                    >
                        <span>{item.question}</span>
                        <PlusMinusIcon />
                    </AccordionTrigger>
                    {item.answer?.length > 0 && (
                        <AccordionContent className="px-4 xl:px-5 pb-4 font-aeonik text-[14px] xl:text-[15px] leading-[1.45] text-black-custom">
                            <PortableText value={item.answer} components={answerComponents} />
                        </AccordionContent>
                    )}
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default FaqAccordion;
