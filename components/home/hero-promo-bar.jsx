"use client"

import { useState } from "react";
import FirstOrderAuthModal from "@/components/common/first-order-auth-modal";

const HeroPromoBar = ({ percent = 0 }) => {
    const [open, setOpen] = useState(false);

    // Promo switched off in Studio — advertise nothing rather than a discount
    // checkout would refuse to give.
    if (percent <= 0) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative z-20 w-full h-8 bg-gray-mint flex items-center justify-center cursor-pointer"
            >
                <span className="font-tt font-light text-[12px] text-black-custom uppercase tracking-wide">
                    {percent}% Off Your First Order
                </span>
            </button>
            <FirstOrderAuthModal isOpen={open} onClose={() => setOpen(false)} percent={percent} />
        </>
    );
};

export default HeroPromoBar;
