'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MenuOverlay from "./navbar-menu-overlay";
import { useHeaderStyles } from "@/hooks/use-header-styles";


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [burgerHovered, setBurgerHovered] = useState(false);
    const sectionStyles = useHeaderStyles(); // { color, scrollBg } | null

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
    // Otherwise → use the section observer color, fall back to dark
    const iconColor = isMenuOpen ? "#000000" : (sectionStyles?.color ?? "#000000");
    const isLightIcons = iconColor === "#ffffff";

    // Full-width bg only when menu is open (matches overlay color)
    const headerBg = isMenuOpen ? "bg-gray-light" : "bg-transparent";
    // Blur confined to the max-w container when scrolled
    const innerBg = !isMenuOpen && scrolled ? (sectionStyles?.scrollBg ?? 'backdrop-blur-md bg-white/20') : '';

    return (
        <>
            {/* Menu overlay */}
            <MenuOverlay isOpen={isMenuOpen} isOnClose={() => setIsMenuOpen(false)} />

            <header className={`fixed top-0 left-0 right-0 z-50 h-24 transition-all duration-300 ${headerBg}`}>
                <div className={`max-w-[1920px] mx-auto h-full flex items-center justify-between page-x transition-all duration-300 ${innerBg}`}>

                    {/* Logo — crossfade between black and white versions */}
                    <Link href="/" className="relative flex items-center" aria-label="SPOTTEQ home">
                        <div className="relative" style={{ width: 185, height: 40 }}>
                            <motion.div
                                animate={{ opacity: isLightIcons ? 0 : 1 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                            >
                                <svg width="200" height="44" viewBox="0 0 200 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.2801 8.92771C15.7578 8.92771 17.7663 6.92917 17.7663 4.46385C17.7663 1.99854 15.7578 0 13.2801 0C10.8025 0 8.79395 1.99854 8.79395 4.46385C8.79395 6.92917 10.8025 8.92771 13.2801 8.92771Z" fill="black"/>
                                    <path d="M13.2801 26.4579C15.7578 26.4579 17.7663 24.4594 17.7663 21.9941C17.7663 19.5288 15.7578 17.5302 13.2801 17.5302C10.8025 17.5302 8.79395 19.5288 8.79395 21.9941C8.79395 24.4594 10.8025 26.4579 13.2801 26.4579Z" fill="black"/>
                                    <path d="M13.286 44C15.7636 44 17.7721 42.0015 17.7721 39.5362C17.7721 37.0708 15.7636 35.0723 13.286 35.0723C10.8083 35.0723 8.7998 37.0708 8.7998 39.5362C8.7998 42.0015 10.8083 44 13.286 44Z" fill="black"/>
                                    <path d="M4.51595 17.7372C6.9936 17.7372 9.00212 15.7386 9.00212 13.2733C9.00212 10.808 6.9936 8.80945 4.51595 8.80945C2.03831 8.80945 0.0297852 10.808 0.0297852 13.2733C0.0297852 15.7386 2.03831 17.7372 4.51595 17.7372Z" fill="black"/>
                                    <path d="M22.1336 17.7372C24.6113 17.7372 26.6198 15.7386 26.6198 13.2733C26.6198 10.808 24.6113 8.80945 22.1336 8.80945C19.656 8.80945 17.6475 10.808 17.6475 13.2733C17.6475 15.7386 19.656 17.7372 22.1336 17.7372Z" fill="black"/>
                                    <path d="M4.48617 35.2437C6.96381 35.2437 8.97234 33.2452 8.97234 30.7799C8.97234 28.3146 6.96381 26.316 4.48617 26.316C2.00853 26.316 0 28.3146 0 30.7799C0 33.2452 2.00853 35.2437 4.48617 35.2437Z" fill="black"/>
                                    <path d="M22.0682 35.2437C24.5458 35.2437 26.5544 33.2452 26.5544 30.7799C26.5544 28.3146 24.5458 26.316 22.0682 26.316C19.5906 26.316 17.582 28.3146 17.582 30.7799C17.582 33.2452 19.5906 35.2437 22.0682 35.2437Z" fill="black"/>
                                    <path d="M193.755 14.0655V10.9793H192.62V10.3703H195.567V10.9793H194.432V14.0655H193.761H193.755ZM196.185 14.0655V10.3703H196.797L198.093 12.1322L199.388 10.3703H200V14.0655H199.329V11.5469L198.093 13.1787L196.857 11.5469V14.0655H196.185Z" fill="black"/>
                                    <path d="M52.5742 34.416C46.0143 34.416 41.8787 31.2174 41.7896 26.0677V25.8431H46.1688L46.1806 26.05C46.3173 28.8288 48.8902 30.703 52.5801 30.703C55.9017 30.703 58.1358 29.3255 58.1358 27.2798C58.1358 24.5601 55.8482 24.2881 52.3959 23.8861L52.1345 23.8565C46.959 23.2239 42.3124 22.2188 42.3124 16.9567C42.3124 12.617 46.2104 9.58399 51.7958 9.58399H51.9265C57.815 9.6372 61.5525 12.5224 61.9149 17.3115L61.9328 17.548H57.5535L57.5298 17.3529C57.2505 14.9288 54.9985 13.297 51.9265 13.297C48.6644 13.297 46.5609 14.6213 46.5609 16.6729C46.5609 19.0024 48.6644 19.369 52.3781 19.8183C57.6546 20.451 62.3843 21.4797 62.3843 27.0019C62.3843 31.3711 58.3557 34.416 52.5861 34.416H52.5742Z" fill="black"/>
                                    <path d="M76.2645 9.81457C73.2103 9.81457 70.4176 10.932 68.2785 12.7649V10.0865H64.4697V43.1427H68.2785V31.2352C70.4176 33.068 73.2103 34.1854 76.2645 34.1854C83.0264 34.1854 88.5108 28.7283 88.5108 22C88.5108 15.2717 83.0264 9.80866 76.2645 9.80866V9.81457ZM76.2645 30.0054C72.1824 30.0054 68.8074 26.9782 68.2785 23.0642C68.231 22.7154 68.2132 22.3666 68.2132 22.0059C68.2132 21.6453 68.231 21.2964 68.2785 20.9476C68.8074 17.0218 72.1824 13.9946 76.2645 13.9946C80.7031 13.9946 84.3158 17.5775 84.3158 22.0059C84.3158 26.4343 80.7031 30.0113 76.2645 30.0113V30.0054Z" fill="black"/>
                                    <path d="M102.189 9.81458C95.4273 9.81458 89.9429 15.2717 89.9429 22C89.9429 28.7283 95.4273 34.1854 102.189 34.1854C108.951 34.1854 114.436 28.7283 114.436 22C114.436 15.2717 108.951 9.81458 102.189 9.81458ZM102.189 30.0113C97.7446 30.0113 94.1438 26.4284 94.1438 22C94.1438 17.5716 97.7446 13.9887 102.189 13.9887C106.634 13.9887 110.235 17.5716 110.235 22C110.235 26.4284 106.634 30.0113 102.189 30.0113Z" fill="black"/>
                                    <path d="M192.258 35.2024L188.134 30.4133C190.237 28.2258 191.533 25.2696 191.533 22C191.533 15.2717 186.048 9.81458 179.286 9.81458C172.524 9.81458 167.04 15.2717 167.04 22C167.04 28.7283 172.524 34.1854 179.286 34.1854C181.218 34.1854 183.036 33.7302 184.658 32.9379L186.607 35.1965H192.264L192.258 35.2024ZM179.28 30.0113C174.836 30.0113 171.235 26.4284 171.235 22C171.235 17.5716 174.836 13.9887 179.28 13.9887C183.725 13.9887 187.326 17.5716 187.326 22C187.326 23.9925 186.589 25.8135 185.377 27.2207L183.713 25.2873H178.056L181.782 29.6093C180.992 29.8635 180.154 30.0113 179.28 30.0113Z" fill="black"/>
                                    <path d="M153.035 9.81458C146.261 9.81458 140.782 15.2717 140.782 22.0059C140.782 28.7401 146.261 34.1914 153.035 34.1914C157.954 34.1914 162.191 31.3061 164.14 27.1379H159.202C157.729 28.8879 155.512 30.0054 153.035 30.0054C149.042 30.0054 145.744 27.132 145.102 23.3539H165.21C165.251 22.9046 165.281 22.4612 165.281 22.0059C165.281 15.2776 159.808 9.81458 153.04 9.81458H153.035ZM145.363 19.5759C146.397 16.33 149.434 13.9887 153.035 13.9887C156.635 13.9887 159.672 16.33 160.694 19.5759H145.358H145.363Z" fill="black"/>
                                    <path d="M136.385 34.1381C131.852 34.1381 129.92 32.2166 129.92 27.7054V3.18677H134.21V9.86777H140.408V13.8113H134.21V27.6581C134.21 29.5797 134.828 30.1946 136.76 30.1946H140.782V34.1381H136.379H136.385Z" fill="black"/>
                                    <path d="M123.568 34.1381C119.035 34.1381 117.104 32.2166 117.104 27.7054V3.18677H121.394V9.86777H127.591V13.8113H121.394V27.6581C121.394 29.5797 122.012 30.1946 123.943 30.1946H127.965V34.1381H123.562H123.568Z" fill="black"/>
                                </svg>
                            </motion.div>
                            <motion.div
                                animate={{ opacity: isLightIcons ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                            >
                                <svg width="200" height="44" viewBox="0 0 200 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.2803 8.92771C15.7579 8.92771 17.7664 6.92917 17.7664 4.46385C17.7664 1.99854 15.7579 0 13.2803 0C10.8026 0 8.79408 1.99854 8.79408 4.46385C8.79408 6.92917 10.8026 8.92771 13.2803 8.92771Z" fill="white"/>
                                    <path d="M13.2803 26.4579C15.7579 26.4579 17.7664 24.4594 17.7664 21.9941C17.7664 19.5288 15.7579 17.5302 13.2803 17.5302C10.8026 17.5302 8.79408 19.5288 8.79408 21.9941C8.79408 24.4594 10.8026 26.4579 13.2803 26.4579Z" fill="white"/>
                                    <path d="M13.2862 44C15.7638 44 17.7724 42.0015 17.7724 39.5361C17.7724 37.0708 15.7638 35.0723 13.2862 35.0723C10.8085 35.0723 8.80002 37.0708 8.80002 39.5361C8.80002 42.0015 10.8085 44 13.2862 44Z" fill="white"/>
                                    <path d="M4.51588 17.7372C6.99352 17.7372 9.00205 15.7386 9.00205 13.2733C9.00205 10.808 6.99352 8.80946 4.51588 8.80946C2.03824 8.80946 0.0297089 10.808 0.0297089 13.2733C0.0297089 15.7386 2.03824 17.7372 4.51588 17.7372Z" fill="white"/>
                                    <path d="M22.1338 17.7372C24.6114 17.7372 26.6199 15.7386 26.6199 13.2733C26.6199 10.808 24.6114 8.80946 22.1338 8.80946C19.6561 8.80946 17.6476 10.808 17.6476 13.2733C17.6476 15.7386 19.6561 17.7372 22.1338 17.7372Z" fill="white"/>
                                    <path d="M4.48617 35.2438C6.96381 35.2438 8.97234 33.2452 8.97234 30.7799C8.97234 28.3146 6.96381 26.316 4.48617 26.316C2.00853 26.316 0 28.3146 0 30.7799C0 33.2452 2.00853 35.2438 4.48617 35.2438Z" fill="white"/>
                                    <path d="M22.0684 35.2438C24.546 35.2438 26.5546 33.2452 26.5546 30.7799C26.5546 28.3146 24.546 26.316 22.0684 26.316C19.5907 26.316 17.5822 28.3146 17.5822 30.7799C17.5822 33.2452 19.5907 35.2438 22.0684 35.2438Z" fill="white"/>
                                    <path d="M193.755 14.0656V10.9793H192.62V10.3703H195.567V10.9793H194.432V14.0656H193.761H193.755ZM196.185 14.0656V10.3703H196.797L198.093 12.1322L199.388 10.3703H200V14.0656H199.329V11.5469L198.093 13.1787L196.857 11.5469V14.0656H196.185Z" fill="white"/>
                                    <path d="M52.5744 34.416C46.0145 34.416 41.8789 31.2174 41.7897 26.0677V25.843H46.1689L46.1808 26.05C46.3175 28.8288 48.8904 30.703 52.5803 30.703C55.9019 30.703 58.136 29.3254 58.136 27.2798C58.136 24.5601 55.8484 24.2881 52.3961 23.886L52.1347 23.8565C46.9592 23.2239 42.3126 22.2187 42.3126 16.9567C42.3126 12.617 46.2105 9.58397 51.796 9.58397H51.9267C57.8152 9.63718 61.5526 12.5224 61.9151 17.3115L61.9329 17.548H57.5537L57.53 17.3529C57.2507 14.9288 54.9987 13.297 51.9267 13.297C48.6646 13.297 46.5611 14.6213 46.5611 16.6729C46.5611 19.0024 48.6646 19.369 52.3783 19.8183C57.6547 20.4509 62.3845 21.4797 62.3845 27.0019C62.3845 31.3711 58.3559 34.416 52.5863 34.416H52.5744Z" fill="white"/>
                                    <path d="M76.2649 9.81456C73.2108 9.81456 70.418 10.932 68.2789 12.7648V10.0865H64.4702V43.1427H68.2789V31.2351C70.418 33.068 73.2108 34.1854 76.2649 34.1854C83.0269 34.1854 88.5113 28.7283 88.5113 22C88.5113 15.2717 83.0269 9.80864 76.2649 9.80864V9.81456ZM76.2649 30.0054C72.1828 30.0054 68.8078 26.9782 68.2789 23.0642C68.2314 22.7154 68.2136 22.3666 68.2136 22.0059C68.2136 21.6452 68.2314 21.2964 68.2789 20.9476C68.8078 17.0218 72.1828 13.9946 76.2649 13.9946C80.7036 13.9946 84.3163 17.5775 84.3163 22.0059C84.3163 26.4343 80.7036 30.0113 76.2649 30.0113V30.0054Z" fill="white"/>
                                    <path d="M102.19 9.81456C95.4277 9.81456 89.9433 15.2717 89.9433 22C89.9433 28.7283 95.4277 34.1854 102.19 34.1854C108.952 34.1854 114.436 28.7283 114.436 22C114.436 15.2717 108.952 9.81456 102.19 9.81456ZM102.19 30.0113C97.745 30.0113 94.1442 26.4284 94.1442 22C94.1442 17.5716 97.745 13.9887 102.19 13.9887C106.634 13.9887 110.235 17.5716 110.235 22C110.235 26.4284 106.634 30.0113 102.19 30.0113Z" fill="white"/>
                                    <path d="M192.258 35.2024L188.134 30.4133C190.237 28.2257 191.533 25.2695 191.533 22C191.533 15.2717 186.048 9.81456 179.286 9.81456C172.524 9.81456 167.04 15.2717 167.04 22C167.04 28.7283 172.524 34.1854 179.286 34.1854C181.218 34.1854 183.036 33.7302 184.658 32.9379L186.607 35.1964H192.264L192.258 35.2024ZM179.28 30.0113C174.836 30.0113 171.235 26.4284 171.235 22C171.235 17.5716 174.836 13.9887 179.28 13.9887C183.725 13.9887 187.326 17.5716 187.326 22C187.326 23.9925 186.589 25.8135 185.377 27.2206L183.713 25.2873H178.056L181.782 29.6092C180.992 29.8635 180.154 30.0113 179.28 30.0113Z" fill="white"/>
                                    <path d="M153.035 9.81456C146.261 9.81456 140.783 15.2717 140.783 22.0059C140.783 28.7401 146.261 34.1913 153.035 34.1913C157.955 34.1913 162.191 31.3061 164.14 27.1379H159.203C157.729 28.8879 155.513 30.0054 153.035 30.0054C149.042 30.0054 145.744 27.1319 145.102 23.3539H165.21C165.252 22.9046 165.281 22.4612 165.281 22.0059C165.281 15.2776 159.809 9.81456 153.041 9.81456H153.035ZM145.364 19.5759C146.398 16.33 149.434 13.9887 153.035 13.9887C156.636 13.9887 159.672 16.33 160.694 19.5759H145.358H145.364Z" fill="white"/>
                                    <path d="M136.386 34.1381C131.852 34.1381 129.921 32.2166 129.921 27.7054V3.18677H134.211V9.86777H140.408V13.8113H134.211V27.6581C134.211 29.5797 134.829 30.1946 136.76 30.1946H140.783V34.1381H136.38H136.386Z" fill="white"/>
                                    <path d="M123.569 34.1381C119.035 34.1381 117.104 32.2166 117.104 27.7054V3.18677H121.394V9.86777H127.591V13.8113H121.394V27.6581C121.394 29.5797 122.012 30.1946 123.943 30.1946H127.966V34.1381H123.563H123.569Z" fill="white"/>
                                </svg>
                            </motion.div>
                        </div>
                    </Link>

                    <div className="flex items-center space-x-32">

                        {/* Right icons — color animates between white (hero) and dark (scrolled/open) */}
                        <motion.div
                            className="flex items-center gap-6"
                            animate={{ color: iconColor }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* User account */}
                            <button aria-label="Account" className="hidden md:flex items-center">
                                <svg width="18" height="21" viewBox="0 0 18 21" fill="none">
                                    <path
                                        d="M16.8636 20.5V18.2778C16.8636 17.099 16.4039 15.9686 15.5856 15.1351C14.7672 14.3016 13.6573 13.8333 12.5 13.8333H4.86364C3.70633 13.8333 2.59642 14.3016 1.77808 15.1351C0.959739 15.9686 0.5 17.099 0.5 18.2778V20.5M13.0455 4.94444C13.0455 7.39904 11.0918 9.38889 8.68182 9.38889C6.27185 9.38889 4.31818 7.39904 4.31818 4.94444C4.31818 2.48985 6.27185 0.5 8.68182 0.5C11.0918 0.5 13.0455 2.48985 13.0455 4.94444Z"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            {/* Search */}
                            <button aria-label="Search" className="hidden md:flex items-center">
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

                            {/* Cart */}
                            <button aria-label="Cart" className="relative flex items-center">
                                <svg width="31" height="46" viewBox="0 0 31 46" fill="none">
                                    <path
                                        d="M23 18.5V7.5C23 3.63401 19.866 0.5 16 0.5C12.134 0.5 9 3.63401 9 7.5V18.5"
                                        stroke="currentColor"
                                    />
                                    <rect x="0.5" y="14" width="30" height="31" stroke="currentColor" />
                                </svg>
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sm font-aeonik leading-none" style={{ color: "inherit" }}>
                                    100
                                </span>
                            </button>
                        </motion.div>

                        {/* Burger — motion.span lines animate rotation + color + hover shrink */}
                        <button
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isMenuOpen}
                            onClick={() => { setIsMenuOpen((prev) => !prev); setBurgerHovered(false); }}
                            onMouseEnter={() => !isMenuOpen && setBurgerHovered(true)}
                            onMouseLeave={() => setBurgerHovered(false)}
                            className="flex flex-col justify-between w-[42px] h-[22px] relative cursor-pointer"
                        >
                            {/* Line 1 — shrinks to the right (right anchored on hover, center otherwise) */}
                            <motion.span
                                className="block h-px w-full"
                                style={{ transformOrigin: burgerHovered ? 'right center' : 'center center' }}
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
                            {/* Line 2 — shrinks to the left (left anchored on hover, center otherwise) */}
                            <motion.span
                                className="block h-px w-full"
                                style={{ transformOrigin: burgerHovered ? 'left center' : 'center center' }}
                                animate={{
                                    opacity: isMenuOpen ? 0 : 1,
                                    backgroundColor: iconColor,
                                    scaleX: burgerHovered ? 0.5 : 1,
                                }}
                                transition={{
                                    opacity: { duration: 0.35 },
                                    backgroundColor: { duration: 0.3 },
                                    scaleX: { duration: 0.3, delay: 0.06, ease: 'easeInOut' },
                                }}
                            />
                            {/* Line 3 — shrinks to the right (right anchored on hover, center otherwise) */}
                            <motion.span
                                className="block h-px w-full"
                                style={{ transformOrigin: burgerHovered ? 'right center' : 'center center' }}
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
                                    scaleX: { duration: 0.3, delay: 0.12, ease: 'easeInOut' },
                                }}
                            />
                        </button>

                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;
