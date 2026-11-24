import { SITE_NAME } from "@/lib/seo";

// Web app manifest only — deliberately no service worker (user's choice: cached
// prices/stock and Stripe/Clerk flows aren't worth the risk). It gives "Add to
// Home Screen" a proper name and icon and Android the brand colour.
// display "browser": a home-screen launch opens a normal tab, so the browser's
// back button and URL bar stay (iOS standalone mode has no back button).
// Icons are the logo's seven-dot mark, generated from public/icons/logo-white.svg.
export default function manifest() {
    return {
        name: SITE_NAME,
        short_name: SITE_NAME,
        start_url: "/",
        display: "browser",
        background_color: "#000000",
        theme_color: "#000000",
        icons: [
            { src: "/icons/app-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "/icons/app-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
            { src: "/icons/app-icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
    };
}
