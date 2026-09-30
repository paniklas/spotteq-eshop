"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// color    — hex for icons/logo: "#ffffff" (light icons) | "#000000" (dark icons)
// scrollBg — Tailwind classes applied to the navbar inner container when scrolled
const SECTION_CONFIGS = [
    {
        id: 'hero-section',
        color: '#ffffff',
        scrollBg: 'backdrop-blur-md bg-black/20',
    },
    {
        id: 'announcement-bar-section',
        color: '#000000',
        scrollBg: 'backdrop-blur-md bg-white/30',
    },
    {
        id: 'about-section',
        color: '#000000',
        scrollBg: 'backdrop-blur-md bg-white/30',
    },
    {
        id: 'shop-by-series-section',
        color: '#000000',
        scrollBg: 'backdrop-blur-md bg-white/30',
    },
    {
        id: 'bundle-section',
        color: '#000000',
        scrollBg: 'backdrop-blur-md bg-white/20',
    },
    {
        id: 'featured-products-section',
        color: '#000000',
        scrollBg: 'backdrop-blur-md bg-white/30',
    },
    {
        id: 'stories-that-move-section',
        color: '#000000',
        scrollBg: 'backdrop-blur-md bg-white/20',
    },
    {
        id: 'training-banner-section',
        color: '#000000',
        scrollBg: 'backdrop-blur-md bg-white/30',
    },
    {
        id: 'quality-section-section',
        color: '#000000',
        scrollBg: 'backdrop-blur-md bg-white/20',
    },
    {
        id: 'spotteq-image-section',
        color: '#ffffff',
        scrollBg: 'backdrop-blur-md bg-black/20',
    },
    // Footer follows the dark spotteq image on most pages — without an entry the
    // header keeps the image's white icons over the light footer.
    {
        id: 'footer-section',
        color: '#000000',
        scrollBg: 'backdrop-blur-md bg-white/30',
    },
];

// Returns { color, scrollBg } for the section currently at the top of the viewport,
// or null when no section is detected.
export const useHeaderStyles = () => {
    const [currentStyles, setCurrentStyles] = useState(null);
    const pathname = usePathname();

    // Reset stale styles during render when the pathname changes — this is the
    // canonical React pattern for derived state and avoids a cascading effect render.
    const [prevPathname, setPrevPathname] = useState(pathname);
    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        setCurrentStyles(null);
    }

    // Persists across callbacks — tracks all sections currently inside the detection zone.
    // Keyed by element id, value is the latest intersectionRatio.
    const intersectingMap = useRef(new Map());

    useEffect(() => {
        const map = intersectingMap.current;
        map.clear();

        const pickStyles = () => {
            // Walk configs in page order, pick the one with the highest ratio.
            // Start at -1 so ratio === 0 (exact boundary entry) is still accepted.
            let bestConfig = null;
            let bestRatio = -1;

            for (const config of SECTION_CONFIGS) {
                const ratio = map.get(config.id);
                if (ratio !== undefined && ratio > bestRatio) {
                    bestRatio = ratio;
                    bestConfig = config;
                }
            }

            if (bestConfig) setCurrentStyles({ color: bestConfig.color, scrollBg: bestConfig.scrollBg });
        };

        let observer = null;

        // Detection zone: a fixed band from 80px to 100px below the top of the
        // viewport, just under the header. Set in px from the viewport height because
        // a percentage bottom margin (the previous -90%) left no zone at all on
        // screens shorter than 800px — most phones — so the header never changed.
        const observe = () => {
            observer?.disconnect();
            map.clear();
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            map.set(entry.target.id, entry.intersectionRatio);
                        } else {
                            map.delete(entry.target.id);
                        }
                    });
                    pickStyles();
                },
                {
                    rootMargin: `-80px 0px -${Math.max(0, window.innerHeight - 100)}px 0px`,
                    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
                }
            );

            SECTION_CONFIGS.forEach(({ id }) => {
                const el = document.getElementById(id);
                if (el) observer.observe(el);
            });
        };

        observe();
        // The viewport height changes on rotation and when mobile browser toolbars
        // show or hide, which would move the band; rebuild the observer with it.
        window.addEventListener('resize', observe);

        return () => {
            window.removeEventListener('resize', observe);
            observer?.disconnect();
            map.clear();
        };
    }, [pathname]);

    return currentStyles; // { color, scrollBg } | null
};
