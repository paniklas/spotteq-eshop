"use client";

import { useEffect, useRef } from "react";

const WEBM = "/videos/hero-video.webm";
const MP4 = "/videos/hero-video.mp4";

// The poster is the home page's Largest Contentful Paint on mobile. With the
// sources in the markup, autoPlay starts the 2.5 MB video download alongside it
// (autoPlay overrides preload), which pushed LCP past 8 s on slow 4G. The source
// is set only once the page has loaded; the poster shows until then.
export default function HeroVideo({ className }) {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const start = () => {
            if (video.getAttribute("src")) return;
            video.src = video.canPlayType("video/webm") ? WEBM : MP4;
            // Autoplay can still be refused (e.g. iOS Low Power Mode); the poster stays.
            video.play().catch(() => {});
        };

        if (document.readyState === "complete") {
            start();
            return;
        }
        window.addEventListener("load", start, { once: true });
        return () => window.removeEventListener("load", start);
    }, []);

    return (
        <video
            ref={videoRef}
            className={className}
            autoPlay
            loop
            muted
            playsInline
            poster="/videos/hero-poster.webp"
        />
    );
}
