"use client"

import { useState } from "react";
import FirstOrderAuthModal from "@/components/common/first-order-auth-modal";

const HeroPromoBar = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative z-20 w-full h-8 bg-gray-mint flex items-center justify-center cursor-pointer"
            >
                <span className="font-tt font-light text-[12px] text-black-custom uppercase tracking-wide">
                    15% Off Your First Order
                </span>
            </button>
            <FirstOrderAuthModal isOpen={open} onClose={() => setOpen(false)} />
        </>
    );
};

export default HeroPromoBar;
