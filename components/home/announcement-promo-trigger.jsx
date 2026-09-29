"use client"

import { useState } from "react";
import FirstOrderAuthModal from "@/components/common/first-order-auth-modal";

// Makes the desktop announcement marquee open the first-order modal — the same
// modal the mobile HeroPromoBar opens. The marquee itself is rendered on the server
// and passed in as children.
const AnnouncementPromoTrigger = ({ percent, className, label, children }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                id="announcement-bar-section"
                onClick={() => setOpen(true)}
                className={`${className} cursor-pointer`}
                aria-label={label}
            >
                {children}
            </button>
            <FirstOrderAuthModal isOpen={open} onClose={() => setOpen(false)} percent={percent} />
        </>
    );
};

export default AnnouncementPromoTrigger;
