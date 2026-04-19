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

    const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

    return (
        <section
            id="spotteq-image-section"
            ref={containerRef}
            className="w-full h-[400px] xl:h-[650px] relative overflow-hidden"
        >
            <motion.div style={{ y }} className="absolute inset-0 scale-[1.35]">
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
