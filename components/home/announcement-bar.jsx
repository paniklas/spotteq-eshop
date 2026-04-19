"use client";

import { useState } from "react";
import FirstOrderModal from "../common/first-order-modal";

const PROMO_TEXT = "15% Off Your First Order";
const items = Array(10).fill(PROMO_TEXT);

const AnnouncementBar = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                id="announcement-bar-section"
                className="block w-full bg-gray-mint h-[52px] overflow-hidden cursor-pointer"
                aria-label={PROMO_TEXT}
                onClick={() => setIsModalOpen(true)}
            >
                <div className="flex items-center h-full overflow-hidden">
                    <div className="flex animate-marquee whitespace-nowrap">
                        {items.concat(items).map((text, i) => (
                            <span
                                key={i}
                                className="font-tt font-light text-[18px] text-black uppercase mx-[60px]"
                            >
                                {text}
                            </span>
                        ))}
                    </div>
                </div>
            </button>
            <FirstOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}

export default AnnouncementBar;