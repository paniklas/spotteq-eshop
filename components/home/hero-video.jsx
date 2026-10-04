"use client";

import { useSyncExternalStore } from "react";

// The poster is the home page's Largest Contentful Paint on mobile. With the
// sources in the markup, autoPlay starts the 2.5 MB video download alongside it
// (autoPlay overrides preload), which pushed LCP past 8 s on slow 4G. The sources
// are rendered only once the page has loaded; the poster shows until then.
// Inserting a <source> into a <video> without one starts the browser's normal
// source selection, so WebM still falls back to MP4 if it fails to load or decode.
//
// useSyncExternalStore (as in use-cart-hydrated): the server snapshot keeps the
// hydration render source-free, and it avoids react-hooks/set-state-in-effect.
const subscribe = (onStoreChange) => {
    window.addEventListener("load", onStoreChange);
    return () => window.removeEventListener("load", onStoreChange);
};
const getSnapshot = () => document.readyState === "complete";
const getServerSnapshot = () => false;

export default function HeroVideo({ className }) {
    const pageLoaded = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return (
        <video
            className={className}
            autoPlay
            loop
            muted
            playsInline
            poster="/videos/hero-poster.webp"
        >
            {pageLoaded && (
                <>
                    <source src="/videos/hero-video.webm" type="video/webm" />
                    <source src="/videos/hero-video.mp4" type="video/mp4" />
                </>
            )}
        </video>
    );
}
