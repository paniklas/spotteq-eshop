"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";

const SpotteqImage = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    return (
        <section
            id="spotteq-image-section"
            ref={containerRef}
            className="w-full h-100 xl:h-180 relative overflow-hidden"
        >
            <motion.div style={{ y }} className="absolute inset-x-0 -inset-y-[15%]">
                <Image
                    src="/images/packs.webp"
                    alt="SPOTTEQ athlete"
                    fill
                    unoptimized={true}
                    quality={100}
                    sizes="100vw"
                    className="object-cover"
                />
            </motion.div>
        </section>
    );
};

export default SpotteqImage;
