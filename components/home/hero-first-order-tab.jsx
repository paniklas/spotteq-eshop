"use client"

import { useState } from "react";
import { useTranslations } from "next-intl";
import FirstOrderAuthModal from "@/components/common/first-order-auth-modal";

// Desktop counterpart of HeroPromoBar: a vertical tab on the hero's right edge
// that opens the same first-order modal.
// className sets display and position (the caller decides where it shows).
const HeroFirstOrderTab = ({ percent = 0, className = "" }) => {
    const t = useTranslations("firstOrder");
    const [open, setOpen] = useState(false);

    // Promo switched off in Studio — advertise nothing rather than a discount
    // checkout would refuse to give.
    if (percent <= 0) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={`w-12 py-7 items-center justify-center bg-gray-mint rounded-l-[10px] cursor-pointer hover:bg-white-custom transition-colors duration-700 ${className}`}
            >
                {/* Vertical text reading bottom to top */}
                <span className="font-tt font-light text-[14px] text-black-custom uppercase tracking-wide whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
                    {t("heroTab", { percent })}
                </span>
            </button>
            <FirstOrderAuthModal isOpen={open} onClose={() => setOpen(false)} percent={percent} />
        </>
    );
};

export default HeroFirstOrderTab;
