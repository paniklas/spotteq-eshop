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
];

// Returns { color, scrollBg } for the section currently at the top of the viewport,
// or null when no section is detected.
export const useHeaderStyles = () => {
    const [currentStyles, setCurrentStyles] = useState(null);
    const pathname = usePathname();

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

        const observer = new IntersectionObserver(
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
                rootMargin: '-80px 0px -90% 0px',
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
            }
        );

        SECTION_CONFIGS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => {
            observer.disconnect();
            map.clear();
        };
    }, [pathname]);

    return currentStyles; // { color, scrollBg } | null
};
