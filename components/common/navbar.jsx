'use client';

import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import MenuOverlay from "./navbar-menu-overlay";
import { useHeaderStyles } from "@/hooks/use-header-styles";
import { getStylesForCurrentPage } from "@/hooks/get-header-styles-current-page";
import { useCartStore } from "@/store/cart-store";
import { useLocaleSwitch } from "@/hooks/use-locale-switch";

const AccountIcon = () => (
    <svg width="18" height="21" viewBox="0 0 18 21" fill="none">
        <path
            d="M16.8636 20.5V18.2778C16.8636 17.099 16.4039 15.9686 15.5856 15.1351C14.7672 14.3016 13.6573 13.8333 12.5 13.8333H4.86364C3.70633 13.8333 2.59642 14.3016 1.77808 15.1351C0.959739 15.9686 0.5 17.099 0.5 18.2778V20.5M13.0455 4.94444C13.0455 7.39904 11.0918 9.38889 8.68182 9.38889C6.27185 9.38889 4.31818 7.39904 4.31818 4.94444C4.31818 2.48985 6.27185 0.5 8.68182 0.5C11.0918 0.5 13.0455 2.48985 13.0455 4.94444Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);


const Navbar = ({ categoryGroups = [], navBundles = [] }) => {
    const locale = useLocale();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [burgerHovered, setBurgerHovered] = useState(false);
    const { openCart, cartItems } = useCartStore();
    const { isSignedIn, user } = useUser();
    const { otherLocale, switchLocale, isPending: isSwitchingLocale } = useLocaleSwitch();

    // Clerk email/password sign-up doesn't collect a name, so fall back gracefully.
    const displayName =
        user?.firstName ||
        user?.username ||
        user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
        "";
    const sectionStyles = useHeaderStyles(); // { color, scrollBg } | null — section-level (home page only)
    const pageStyles = getStylesForCurrentPage(pathname, locale); // page-level fallback

    // Hide the cart button on the checkout flow — the checkout page already
    // shows the order summary, and a cart drawer over it is redundant.
    const isCheckout = pathname.includes("/checkout");

    // The mobile 10% banner only exists on the home hero, so the extra top
    // padding that clears it should only apply there.
    const isHome = pathname === "/" || pathname === `/${locale}`;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    // Menu open → always dark icons (light gray overlay)
    // Otherwise → section observer color (home page) → page-level color → dark fallback
    const iconColor = isMenuOpen ? "#000000" : (sectionStyles?.color ?? pageStyles.color);
    const isLightIcons = iconColor === "#ffffff";

    // Full-width bg only when menu is open (matches overlay color)
    const headerBg = isMenuOpen ? "bg-gray-menu-overlay" : "bg-transparent";
    // Blur confined to the max-w container when scrolled
    const innerBg = !isMenuOpen && scrolled ? (sectionStyles?.scrollBg ?? 'backdrop-blur-md bg-white/20') : '';

    return (
        <>
            {/* Menu overlay */}
            <MenuOverlay isOpen={isMenuOpen} isOnClose={() => setIsMenuOpen(false)} categoryGroups={categoryGroups} navBundles={navBundles} />

            <header className={`fixed top-0 left-0 right-0 z-50 h-24 transition-all duration-300 pointer-events-none ${headerBg} ${innerBg}`}>
                <div className={`max-w-480 mx-auto h-full flex items-center justify-between page-x ${isMenuOpen ? "pt-0 md:pb-0" : (isHome ? "pt-10 xl:pb-0" : "")}`}>

                    {/* Logo — crossfade between black and white versions */}
                    <Link href="/" className="relative flex items-center pointer-events-auto" aria-label="SPOTTEQ home">
                        <div className="relative w-35 h-7.75 md:w-50 md:h-11">
                            <motion.div
                                animate={{ opacity: isLightIcons ? 0 : 1 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                            >
                                <svg viewBox="0 0 206 54" preserveAspectRatio="xMinYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    <path d="M15.2,41.5c-8.4,0-13.7-4.1-13.9-10.8l0-0.3H7l0,0.3c0.2,3.6,3.5,6,8.2,6c4.3,0,7.1-1.8,7.1-4.4c0-3.5-2.9-3.9-7.4-4.4l-0.3,0C8,27.1,2,25.8,2,19c0-5.6,5-9.5,12.2-9.5l0.2,0c7.6,0.1,12.4,3.8,12.8,10l0,0.3h-5.6l0-0.3c-0.4-3.1-3.3-5.2-7.2-5.2c-4.2,0-6.9,1.7-6.9,4.4c0,3,2.7,3.5,7.5,4.1c6.8,0.8,12.9,2.1,12.9,9.3C27.8,37.6,22.6,41.5,15.2,41.5z" fill="black"/>
                                    <path d="M45.7,9.8c-3.9,0-7.5,1.4-10.3,3.8v-3.5h-4.9v42.7h4.9V37.4c2.7,2.4,6.3,3.8,10.3,3.8c8.7,0,15.7-7.1,15.7-15.7S54.3,9.8,45.7,9.8z M45.7,35.8c-5.2,0-9.6-3.9-10.3-9c-0.1-0.5-0.1-0.9-0.1-1.4c0-0.5,0-0.9,0.1-1.4c0.7-5.1,5-9,10.3-9c5.7,0,10.4,4.6,10.4,10.4C56,31.2,51.4,35.8,45.7,35.8z" fill="black"/>
                                    <path d="M79,9.8c-8.7,0-15.7,7-15.7,15.7s7,15.7,15.7,15.7s15.7-7,15.7-15.7S87.7,9.8,79,9.8z M79,35.8c-5.7,0-10.3-4.6-10.3-10.3S73.3,15.2,79,15.2c5.7,0,10.3,4.6,10.3,10.3S84.7,35.8,79,35.8z" fill="black"/>
                                    <path d="M194.7,42.5l-5.3-6.2c2.7-2.8,4.4-6.6,4.4-10.9c0-8.7-7-15.7-15.7-15.7c-8.7,0-15.7,7-15.7,15.7s7,15.7,15.7,15.7c2.5,0,4.8-0.6,6.9-1.6l2.5,2.9H194.7z M178.1,35.8c-5.7,0-10.3-4.6-10.3-10.3s4.6-10.3,10.3-10.3c5.7,0,10.3,4.6,10.3,10.3c0,2.6-0.9,4.9-2.5,6.7l-2.1-2.5h-7.3l4.8,5.6C180.3,35.7,179.2,35.8,178.1,35.8z" fill="black"/>
                                    <path d="M144.3,9.8c-8.7,0-15.7,7.1-15.7,15.7s7,15.7,15.7,15.7c6.3,0,11.8-3.7,14.3-9.1h-6.3c-1.9,2.3-4.7,3.7-7.9,3.7c-5.1,0-9.4-3.7-10.2-8.6H160c0.1-0.6,0.1-1.2,0.1-1.7C160.1,16.8,153,9.8,144.3,9.8z M134.5,22.4c1.3-4.2,5.2-7.2,9.9-7.2c4.6,0,8.5,3,9.8,7.2H134.5z" fill="black"/>
                                    <path d="M122.9,41.2c-5.8,0-8.3-2.5-8.3-8.3V14.9V9.8V1.2h5.5v8.6h8v5.1h-8v17.9c0,2.5,0.8,3.3,3.3,3.3h5.2v5.1H122.9z" fill="black"/>
                                    <path d="M106.5,41.2c-5.8,0-8.3-2.5-8.3-8.3V14.9V9.8V1.2h5.5v8.6h8v5.1h-8v17.9c0,2.5,0.8,3.3,3.3,3.3h5.2v5.1H106.5z" fill="black"/>
                                    <path d="M204.1,10.7c-0.4-0.6-0.9-1.2-1.6-1.5c-0.7-0.4-1.4-0.6-2.2-0.6c-0.8,0-1.5,0.2-2.2,0.6c-0.6,0.4-1.2,0.9-1.5,1.5c-0.4,0.6-0.6,1.4-0.6,2.2c0,0.8,0.2,1.5,0.6,2.2c0.4,0.6,0.9,1.2,1.5,1.5c0.6,0.4,1.4,0.6,2.2,0.6c0.8,0,1.6-0.2,2.2-0.6c0.7-0.4,1.2-0.9,1.6-1.5c0.4-0.6,0.6-1.4,0.6-2.2S204.5,11.4,204.1,10.7z M200.3,16.4c-0.7,0-1.3-0.2-1.8-0.5c-0.5-0.3-1-0.7-1.3-1.3c-0.3-0.5-0.5-1.1-0.5-1.8c0-0.7,0.2-1.3,0.5-1.8c0.3-0.5,0.7-1,1.3-1.3c0.5-0.3,1.1-0.5,1.8-0.5c0.7,0,1.3,0.2,1.8,0.5c0.5,0.3,1,0.7,1.3,1.3c0.3,0.5,0.5,1.1,0.5,1.8s-0.2,1.3-0.5,1.8c-0.3,0.5-0.7,1-1.3,1.3C201.6,16.3,201,16.4,200.3,16.4z" fill="black"/>
                                    <path d="M201.1,13.3c0.3-0.1,0.6-0.2,0.7-0.4c0.2-0.2,0.3-0.5,0.3-0.9c0-0.4-0.2-0.8-0.5-1c-0.3-0.3-0.7-0.4-1.2-0.4h-1.8v4.7h0.8v-1.8h0.8l1.1,1.8h0.9L201.1,13.3z M199.5,11.2h1c0.3,0,0.5,0.1,0.7,0.2c0.2,0.1,0.2,0.3,0.2,0.6c0,0.3-0.1,0.4-0.2,0.6c-0.2,0.1-0.4,0.2-0.7,0.2h-1V11.2z" fill="black"/>
                                </svg>
                            </motion.div>
                            <motion.div
                                animate={{ opacity: isLightIcons ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                            >
                                <svg viewBox="0 0 206 54" preserveAspectRatio="xMinYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    <path d="M15.2,41.5c-8.4,0-13.7-4.1-13.9-10.8l0-0.3H7l0,0.3c0.2,3.6,3.5,6,8.2,6c4.3,0,7.1-1.8,7.1-4.4c0-3.5-2.9-3.9-7.4-4.4l-0.3,0C8,27.1,2,25.8,2,19c0-5.6,5-9.5,12.2-9.5l0.2,0c7.6,0.1,12.4,3.8,12.8,10l0,0.3h-5.6l0-0.3c-0.4-3.1-3.3-5.2-7.2-5.2c-4.2,0-6.9,1.7-6.9,4.4c0,3,2.7,3.5,7.5,4.1c6.8,0.8,12.9,2.1,12.9,9.3C27.8,37.6,22.6,41.5,15.2,41.5z" fill="white"/>
                                    <path d="M45.7,9.8c-3.9,0-7.5,1.4-10.3,3.8v-3.5h-4.9v42.7h4.9V37.4c2.7,2.4,6.3,3.8,10.3,3.8c8.7,0,15.7-7.1,15.7-15.7S54.3,9.8,45.7,9.8z M45.7,35.8c-5.2,0-9.6-3.9-10.3-9c-0.1-0.5-0.1-0.9-0.1-1.4c0-0.5,0-0.9,0.1-1.4c0.7-5.1,5-9,10.3-9c5.7,0,10.4,4.6,10.4,10.4C56,31.2,51.4,35.8,45.7,35.8z" fill="white"/>
                                    <path d="M79,9.8c-8.7,0-15.7,7-15.7,15.7s7,15.7,15.7,15.7s15.7-7,15.7-15.7S87.7,9.8,79,9.8z M79,35.8c-5.7,0-10.3-4.6-10.3-10.3S73.3,15.2,79,15.2c5.7,0,10.3,4.6,10.3,10.3S84.7,35.8,79,35.8z" fill="white"/>
                                    <path d="M194.7,42.5l-5.3-6.2c2.7-2.8,4.4-6.6,4.4-10.9c0-8.7-7-15.7-15.7-15.7c-8.7,0-15.7,7-15.7,15.7s7,15.7,15.7,15.7c2.5,0,4.8-0.6,6.9-1.6l2.5,2.9H194.7z M178.1,35.8c-5.7,0-10.3-4.6-10.3-10.3s4.6-10.3,10.3-10.3c5.7,0,10.3,4.6,10.3,10.3c0,2.6-0.9,4.9-2.5,6.7l-2.1-2.5h-7.3l4.8,5.6C180.3,35.7,179.2,35.8,178.1,35.8z" fill="white"/>
                                    <path d="M144.3,9.8c-8.7,0-15.7,7.1-15.7,15.7s7,15.7,15.7,15.7c6.3,0,11.8-3.7,14.3-9.1h-6.3c-1.9,2.3-4.7,3.7-7.9,3.7c-5.1,0-9.4-3.7-10.2-8.6H160c0.1-0.6,0.1-1.2,0.1-1.7C160.1,16.8,153,9.8,144.3,9.8z M134.5,22.4c1.3-4.2,5.2-7.2,9.9-7.2c4.6,0,8.5,3,9.8,7.2H134.5z" fill="white"/>
                                    <path d="M122.9,41.2c-5.8,0-8.3-2.5-8.3-8.3V14.9V9.8V1.2h5.5v8.6h8v5.1h-8v17.9c0,2.5,0.8,3.3,3.3,3.3h5.2v5.1H122.9z" fill="white"/>
                                    <path d="M106.5,41.2c-5.8,0-8.3-2.5-8.3-8.3V14.9V9.8V1.2h5.5v8.6h8v5.1h-8v17.9c0,2.5,0.8,3.3,3.3,3.3h5.2v5.1H106.5z" fill="white"/>
                                    <path d="M204.1,10.7c-0.4-0.6-0.9-1.2-1.6-1.5c-0.7-0.4-1.4-0.6-2.2-0.6c-0.8,0-1.5,0.2-2.2,0.6c-0.6,0.4-1.2,0.9-1.5,1.5c-0.4,0.6-0.6,1.4-0.6,2.2c0,0.8,0.2,1.5,0.6,2.2c0.4,0.6,0.9,1.2,1.5,1.5c0.6,0.4,1.4,0.6,2.2,0.6c0.8,0,1.6-0.2,2.2-0.6c0.7-0.4,1.2-0.9,1.6-1.5c0.4-0.6,0.6-1.4,0.6-2.2S204.5,11.4,204.1,10.7z M200.3,16.4c-0.7,0-1.3-0.2-1.8-0.5c-0.5-0.3-1-0.7-1.3-1.3c-0.3-0.5-0.5-1.1-0.5-1.8c0-0.7,0.2-1.3,0.5-1.8c0.3-0.5,0.7-1,1.3-1.3c0.5-0.3,1.1-0.5,1.8-0.5c0.7,0,1.3,0.2,1.8,0.5c0.5,0.3,1,0.7,1.3,1.3c0.3,0.5,0.5,1.1,0.5,1.8s-0.2,1.3-0.5,1.8c-0.3,0.5-0.7,1-1.3,1.3C201.6,16.3,201,16.4,200.3,16.4z" fill="white"/>
                                    <path d="M201.1,13.3c0.3-0.1,0.6-0.2,0.7-0.4c0.2-0.2,0.3-0.5,0.3-0.9c0-0.4-0.2-0.8-0.5-1c-0.3-0.3-0.7-0.4-1.2-0.4h-1.8v4.7h0.8v-1.8h0.8l1.1,1.8h0.9L201.1,13.3z M199.5,11.2h1c0.3,0,0.5,0.1,0.7,0.2c0.2,0.1,0.2,0.3,0.2,0.6c0,0.3-0.1,0.4-0.2,0.6c-0.2,0.1-0.4,0.2-0.7,0.2h-1V11.2z" fill="white"/>
                                </svg>
                            </motion.div>
                        </div>
                    </Link>

                    <div className="flex items-center space-x-4 md:space-x-32 pointer-events-auto">

                        {/* Right icons — color animates between white (hero) and dark (scrolled/open) */}
                        <motion.div
                            className="flex items-center gap-3 md:gap-6"
                            animate={{ color: iconColor }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* User account — first name + green check when signed in, sign-in otherwise */}
                            <Link
                                href={isSignedIn ? "/account" : "/sign-in"}
                                aria-label={isSignedIn ? "My account" : "Sign in"}
                                className={`${isSignedIn ? "flex" : "hidden md:flex"} items-center gap-2 cursor-pointer`}
                            >
                                <span className="relative flex items-center">
                                    <AccountIcon />
                                    {isSignedIn && (
                                        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-teal-accent flex items-center justify-center">
                                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 6 9 17l-5-5" />
                                            </svg>
                                        </span>
                                    )}
                                </span>
                                {isSignedIn && displayName && (
                                    <span className="hidden md:block font-aeonik text-[14px] leading-none">{displayName}</span>
                                )}
                            </Link>

                            {/* Search */}
                            <button aria-label="Search" className="hidden md:flex items-center cursor-pointer">
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                                    <circle
                                        cx="12.0208"
                                        cy="12.0208"
                                        r="8"
                                        transform="rotate(-45 12.0208 12.0208)"
                                        stroke="currentColor"
                                    />
                                    <line x1="18.0312" y1="18.0312" x2="21.5667" y2="21.5668" stroke="currentColor" />
                                </svg>
                            </button>

                            {/* Cart — hidden on the checkout flow */}
                            {!isCheckout && (
                                <button
                                    aria-label="Cart"
                                    onClick={openCart}
                                    className="relative flex items-center cursor-pointer"
                                >
                                    <span className="relative flex items-center">
                                        <svg viewBox="0 0 31 46" fill="none" className="w-[22px] md:w-[25px] h-auto">
                                            <path
                                                d="M23 18.5V7.5C23 3.63401 19.866 0.5 16 0.5C12.134 0.5 9 3.63401 9 7.5V18.5"
                                                stroke="currentColor"
                                            />
                                            <rect x="0.5" y="14" width="30" height="31" stroke="currentColor" />
                                        </svg>

                                        {/* Desktop — count inside the bag (text only) */}
                                        <span 
                                            className="hidden md:block absolute bottom-1 left-1/2 -translate-x-1/2 text-sm font-aeonik leading-none"
                                            style={{ color: "inherit" }}
                                        >
                                            {cartItems.reduce((sum, i) => sum + i.qty, 0)}
                                        </span>
                                        {/* Mobile — count inside the bag on a filled badge (white when closed, black when menu open) */}
                                        <span className="md:hidden absolute bottom-0.75 left-1/2 -translate-x-1/2 flex items-center justify-center min-w-3.25 h-3 px-0.75 leading-none">
                                            <span className="font-aeonik text-sm leading-none">
                                                {cartItems.reduce((sum, i) => sum + i.qty, 0)}
                                            </span>
                                        </span>
                                    </span>
                                </button>
                            )}

                            {/* Language toggle — shows the language you switch TO. Mobile uses the menu overlay switcher. */}
                            <button
                                type="button"
                                onClick={() => switchLocale()}
                                disabled={isSwitchingLocale}
                                lang={otherLocale}
                                aria-label={otherLocale === "en" ? "Switch to English" : "Αλλαγή σε Ελληνικά"}
                                className={`hidden md:flex items-center font-aeonik text-[14px] md:text-[16px] leading-none uppercase cursor-pointer transition-opacity ${isSwitchingLocale ? "opacity-50" : "hover:opacity-60"}`}
                            >
                                {otherLocale}
                            </button>
                        </motion.div>

                        {/* Burger — motion.span lines animate rotation + color + hover shrink.
                            Scaled down on mobile via this wrapper (not the button itself) so the
                            line transforms keep tweening cleanly through open/close. */}
                        <div className="scale-75 md:scale-100 origin-right">
                        <button
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isMenuOpen}
                            onClick={() => { setIsMenuOpen((prev) => !prev); setBurgerHovered(false); }}
                            onMouseEnter={() => !isMenuOpen && setBurgerHovered(true)}
                            onMouseLeave={() => setBurgerHovered(false)}
                            className="flex flex-col justify-between w-10.5 h-5.5 relative cursor-pointer"
                        >
                            {/* Line 1 — shrinks to the right */}
                            <motion.span
                                className="block h-px w-full"
                                style={{ transformOrigin: isMenuOpen ? 'center center' : 'right center' }}
                                animate={{
                                    rotate: isMenuOpen ? 45 : 0,
                                    y: isMenuOpen ? 10.5 : 0,
                                    backgroundColor: iconColor,
                                    scaleX: burgerHovered ? 0.5 : 1,
                                }}
                                transition={{
                                    rotate: { duration: 0.35, ease: [0.76, 0, 0.24, 1] },
                                    y: { duration: 0.35, ease: [0.76, 0, 0.24, 1] },
                                    backgroundColor: { duration: 0.3 },
                                    scaleX: { duration: 0.3, delay: 0, ease: 'easeInOut' },
                                }}
                            />
                            {/* Line 2 — shrinks to the left */}
                            <motion.span
                                className="block h-px w-full"
                                style={{ transformOrigin: isMenuOpen ? 'center center' : 'left center' }}
                                animate={{
                                    opacity: isMenuOpen ? 0 : 1,
                                    backgroundColor: iconColor,
                                    scaleX: burgerHovered ? 0.5 : 1,
                                }}
                                transition={{
                                    opacity: { duration: 0.35 },
                                    backgroundColor: { duration: 0.3 },
                                    scaleX: { duration: 0.3, delay: burgerHovered ? 0.06 : 0, ease: 'easeInOut' },
                                }}
                            />
                            {/* Line 3 — shrinks to the right */}
                            <motion.span
                                className="block h-px w-full"
                                style={{ transformOrigin: isMenuOpen ? 'center center' : 'right center' }}
                                animate={{
                                    rotate: isMenuOpen ? -45 : 0,
                                    y: isMenuOpen ? -10.5 : 0,
                                    backgroundColor: iconColor,
                                    scaleX: burgerHovered ? 0.5 : 1,
                                }}
                                transition={{
                                    rotate: { duration: 0.35, ease: [0.76, 0, 0.24, 1] },
                                    y: { duration: 0.35, ease: [0.76, 0, 0.24, 1] },
                                    backgroundColor: { duration: 0.3 },
                                    scaleX: { duration: 0.3, delay: burgerHovered ? 0.12 : 0, ease: 'easeInOut' },
                                }}
                            />
                        </button>
                        </div>

                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;
