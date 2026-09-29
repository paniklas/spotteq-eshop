"use client"

import { useState } from "react";
import Image from "next/image";

const PrevArrow = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.46967 19.4697C9.17678 19.7626 9.17678 20.2374 9.46967 20.5303L14.2426 25.3033C14.5355 25.5962 15.0104 25.5962 15.3033 25.3033C15.5962 25.0104 15.5962 24.5355 15.3033 24.2426L11.0607 20L15.3033 15.7574C15.5962 15.4645 15.5962 14.9896 15.3033 14.6967C15.0104 14.4038 14.5355 14.4038 14.2426 14.6967L9.46967 19.4697ZM30 20L30 19.25L10 19.25L10 20L10 20.75L30 20.75L30 20Z" fill="white"/>
    </svg>
);

const NextArrow = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30.5303 20.5303C30.8232 20.2374 30.8232 19.7626 30.5303 19.4697L25.7574 14.6967C25.4645 14.4038 24.9896 14.4038 24.6967 14.6967C24.4038 14.9896 24.4038 15.4645 24.6967 15.7574L28.9393 20L24.6967 24.2426C24.4038 24.5355 24.4038 25.0104 24.6967 25.3033C24.9896 25.5962 25.4645 25.5962 25.7574 25.3033L30.5303 20.5303ZM10 20L10 20.75L30 20.75L30 20L30 19.25L10 19.25L10 20Z" fill="white"/>
    </svg>
);

// Hero product images with prev/next arrows. `variant` picks the mobile layout
// (arrows flanking the product) or the desktop one (arrows at its bottom-right).
const HeroProductSlider = ({ images, variant = "mobile" }) => {
    const [index, setIndex] = useState(0);
    const count = images.length;

    const prev = () => setIndex((i) => (i - 1 + count) % count);
    const next = () => setIndex((i) => (i + 1) % count);

    const isMobile = variant === "mobile";
    // Nothing to cycle through with a single image, so no arrows.
    const hasArrows = count > 1;

    const imageClass = isMobile
        ? "w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
        : "w-100 xl:w-140 aspect-380/520 object-contain drop-shadow-[0_0_60px_rgba(255,255,255,0.25)]";

    // All slides share one grid cell, so they stack and crossfade without a layout shift.
    const slides = (
        <div className={`grid ${isMobile ? "w-full max-w-82.5" : ""}`}>
            {images.map((image, i) => (
                <Image
                    key={i}
                    src={image.url}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes={isMobile ? "330px" : "(min-width: 1536px) 560px, 400px"}
                    unoptimized={true}
                    quality={100}
                    aria-hidden={i !== index}
                    className={`[grid-area:1/1] transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"} ${imageClass}`}
                    priority={i === 0}
                />
            ))}
        </div>
    );

    if (isMobile) {
        return (
            <div className="relative z-20 -mt-42.5 flex items-center justify-center">
                {hasArrows && (
                    <button
                        aria-label="Previous"
                        onClick={prev}
                        className="absolute left-8 top-1/2 -translate-y-1/2 z-10 text-white-custom cursor-pointer"
                    >
                        <PrevArrow />
                    </button>
                )}

                {slides}

                {hasArrows && (
                    <button
                        aria-label="Next"
                        onClick={next}
                        className="absolute right-8 top-1/2 -translate-y-1/2 z-10 text-white-custom cursor-pointer"
                    >
                        <NextArrow />
                    </button>
                )}
            </div>
        );
    }

    // Arrows sit side by side at the product's bottom-right. The image is
    // object-contain in a 380:520 box, so the product's bottom edge sits above the
    // box bottom by an amount that depends on the image's shape — measured from the
    // first image so the arrows stay put while cycling. The 140px floor keeps them
    // inside the hero, whose bottom edge crops the box 120px up.
    const first = images[0];
    const productBottom = Math.max(0, (1 - (first.height / first.width) * (380 / 520)) / 2) * 100;

    return (
        <div className="relative">
            {slides}

            {hasArrows && (
                <div
                    className="absolute right-0 z-10 flex items-center gap-1.5"
                    style={{ bottom: `max(${productBottom.toFixed(2)}%, 140px)` }}
                >
                    <button aria-label="Previous" onClick={prev} className="text-white-custom cursor-pointer">
                        <PrevArrow />
                    </button>
                    <button aria-label="Next" onClick={next} className="text-white-custom cursor-pointer">
                        <NextArrow />
                    </button>
                </div>
            )}
        </div>
    );
};

export default HeroProductSlider;
