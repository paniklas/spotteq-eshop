"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";


const SHOP_BY_SERIES = [
    { label: "Performance Series", href: "/series/performance" },
    { label: "Clinical Series", href: "/series/clinical" },
    { label: "Accessories", href: "/series/accessories" },
    ];

    const SHOP_BY_GOAL = [
    { label: "Build Muscle & Strength", href: "/goal/muscle" },
    { label: "Endurance & Performance", href: "/goal/endurance" },
    { label: "Recovery & Muscle Function", href: "/goal/recovery" },
    { label: "Immunity & Everyday Health", href: "/goal/immunity" },
    ];

    const BUNDLES = [
    { label: "Recovery & Protection", href: "/bundles/recovery" },
    { label: "Performance Complete", href: "/bundles/performance" },
    { label: "Strength & Growth", href: "/bundles/strength" },
    { label: "Total System", href: "/bundles/total-system" },
];

const BRAND_SUPPORT = [
    {
        label: "About SPOTTEQ",
        sub: "Who we are and what we stand for",
        href: "/about",
    },
    {
        label: "Ambassador & CSR",
        sub: "Partnerships, Nasos Ghavelas and our social projects",
        href: "/ambassador",
    },
    {
        label: "FAQ & Support",
        sub: "Orders, shipping, returns and product questions",
        href: "/faq",
    },
    {
        label: "Contact",
        sub: "Get in touch with the SPOTTEQ team",
        href: "/contact",
    },
];


const MenuOverlay = ({ isOpen, isOnClose }) => {
    const locale = useLocale();
    const l = (path) => `/${locale}${path}`;

    const fade = (delay) => ({
        opacity: isOpen ? 1 : 0,
        transition: `opacity 380ms ease ${isOpen ? delay : 0}ms`,
    });

    return (
        <div
            role="dialog"
            aria-label="Site navigation"
            aria-modal="true"
            aria-hidden={!isOpen}
            className={`fixed inset-0 z-40 bg-gray-menu-overlay overflow-y-auto transition-transform duration-500 ease-in-out ${
            isOpen ? "translate-y-0 pointer-events-auto" : "-translate-y-full pointer-events-none"
            }`}
        >
            {/* Spacer under fixed navbar */}
            <div className="h-24" />
            <div className="max-w-[1920px] mx-auto page-x flex gap-12 py-10 xl:py-32">
                {/* ── Left: nav content ── */}
                <div className="flex-1 flex flex-col min-w-0 space-y-10">
        
                    {/* Top 3-column grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8">
                        <NavColumn title="Shop by Series" links={SHOP_BY_SERIES.map(i => ({ ...i, href: l(i.href) }))} isOpen={isOpen} delay={100} onClose={isOnClose} />
                        <NavColumn title="Shop by Goal"   links={SHOP_BY_GOAL.map(i => ({ ...i, href: l(i.href) }))}   isOpen={isOpen} delay={140} onClose={isOnClose} />
                        <NavColumn title="Bundles"         links={BUNDLES.map(i => ({ ...i, href: l(i.href) }))}         isOpen={isOpen} delay={180} onClose={isOnClose} />

                         {/* View all products */}
                        <div className="mt-6 col-start-3 flex justify-start" style={fade(240)}>
                            <Link
                                href={l("/shop")}
                                onClick={isOnClose}
                                tabIndex={isOpen ? 0 : -1}
                                className="inline-flex items-center font-aeonik text-[20px] text-black-custom"
                            >
                                View all products 
                                <span aria-hidden="true">
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M30.5303 20.5303C30.8232 20.2374 30.8232 19.7626 30.5303 19.4697L25.7574 14.6967C25.4645 14.4038 24.9896 14.4038 24.6967 14.6967C24.4038 14.9896 24.4038 15.4645 24.6967 15.7574L28.9393 20L24.6967 24.2426C24.4038 24.5355 24.4038 25.0104 24.6967 25.3033C24.9896 25.5962 25.4645 25.5962 25.7574 25.3033L30.5303 20.5303ZM10 20L10 20.75L30 20.75L30 20L30 19.25L10 19.25L10 20Z" fill="black"/>
                                    </svg>
                                </span>
                            </Link>
                        </div>
                    </div>
        
                    {/* Brand & Support */}
                    <div className="mt-10" style={fade(200)}>
                        <SectionHeader label="Brand & Support" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 mt-5">
                            {BRAND_SUPPORT.map(({ label, sub, href }) => (
                                <div key={label}>
                                    <Link
                                        href={l(href)}
                                        onClick={isOnClose}
                                        tabIndex={isOpen ? 0 : -1}
                                        className="font-aeonik text-[15px] xl:text-[20px] text-black-custom hover:opacity-50 transition-opacity leading-snug"
                                    >
                                        {label}
                                    </Link>
                                    <p className="font-aeonik text-[13px] xl:text-[16px] text-gray-text mt-0.5 leading-none">
                                        {sub}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
        
                    {/* Terms */}
                    <div className="mt-10" style={fade(260)}>
                        <p className="font-aeonik text-[11px] xl:text-[16px] uppercase text-black-custom mb-10 mt-10">
                            Terms
                        </p>
                        <div className="flex flex-col gap-2">
                            {["Terms & Conditions", "Privacy Policy", "Cookies Policy"].map((t) => (
                                <Link
                                key={t}
                                href="#"
                                onClick={isOnClose}
                                tabIndex={isOpen ? 0 : -1}
                                className="font-aeonik text-[11px] xl:text-[16px] text-black-custom hover:text-black-custom transition-colors uppercase tracking-wide"
                                >
                                {t}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
    
                {/* ── Right: featured product ── */}
                <div
                    className="hidden lg:flex flex-col items-center justify-start gap-6 flex-shrink-0 w-[660px] xl:w-[440px]"
                    style={fade(160)}
                >
                    <div className="group relative w-full aspect-[2/3] rounded-[273px] overflow-hidden flex items-end justify-center pb-10">
                        {/* Background — blurs on hover per Figma spec */}
                        <div className="absolute inset-0 bg-gray-mint transition-[filter,background-color] duration-300 group-hover:bg-gray-mint/80 group-hover:blur-[7.5px]" />
                        {/* Product image — sharp, above the blurred background */}
                        <div className="absolute inset-x-10 top-16 bottom-28 z-[1] flex items-center justify-center">
                            <Image
                                src="/images/products/liposomal-magnesium-3.png"
                                alt="Liposomal Magnesium"
                                fill
                                sizes="440px"
                                className="object-contain"
                            />
                        </div>

                        <Link
                            href={l("/shop")}
                            onClick={isOnClose}
                            tabIndex={isOpen ? 0 : -1}
                            className="relative z-10 bg-white text-foreground font-tt text-xs font-medium uppercase tracking-[0.15em] px-10 py-3 rounded-full hover:bg-foreground hover:text-white transition-colors duration-200"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>

            {/* Language switcher */}
            <div
                className="max-w-[1920px] mx-auto page-x pb-10 flex justify-end"
                style={fade(300)}
                >
                <div className="flex items-center gap-3 font-tt text-[12px] xl:text-[16px] font-aeonik">
                    <span className="text-gray-language hover:text-foreground cursor-pointer transition-colors">
                        English
                    </span>
                    <span className="text-black-custom font-medium cursor-pointer">
                        Ελληνικά
                    </span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 20C8.63333 20 7.34167 19.7375 6.125 19.2125C4.90833 18.6875 3.84583 17.9708 2.9375 17.0625C2.02917 16.1542 1.3125 15.0917 0.7875 13.875C0.2625 12.6583 0 11.3667 0 10C0 8.61667 0.2625 7.32083 0.7875 6.1125C1.3125 4.90417 2.02917 3.84583 2.9375 2.9375C3.84583 2.02917 4.90833 1.3125 6.125 0.7875C7.34167 0.2625 8.63333 0 10 0C11.3833 0 12.6792 0.2625 13.8875 0.7875C15.0958 1.3125 16.1542 2.02917 17.0625 2.9375C17.9708 3.84583 18.6875 4.90417 19.2125 6.1125C19.7375 7.32083 20 8.61667 20 10C20 11.3667 19.7375 12.6583 19.2125 13.875C18.6875 15.0917 17.9708 16.1542 17.0625 17.0625C16.1542 17.9708 15.0958 18.6875 13.8875 19.2125C12.6792 19.7375 11.3833 20 10 20ZM10 17.95C10.4333 17.35 10.8083 16.725 11.125 16.075C11.4417 15.425 11.7 14.7333 11.9 14H8.1C8.3 14.7333 8.55833 15.425 8.875 16.075C9.19167 16.725 9.56667 17.35 10 17.95ZM7.4 17.55C7.1 17 6.8375 16.4292 6.6125 15.8375C6.3875 15.2458 6.2 14.6333 6.05 14H3.1C3.58333 14.8333 4.1875 15.5583 4.9125 16.175C5.6375 16.7917 6.46667 17.25 7.4 17.55ZM12.6 17.55C13.5333 17.25 14.3625 16.7917 15.0875 16.175C15.8125 15.5583 16.4167 14.8333 16.9 14H13.95C13.8 14.6333 13.6125 15.2458 13.3875 15.8375C13.1625 16.4292 12.9 17 12.6 17.55ZM2.25 12H5.65C5.6 11.6667 5.5625 11.3375 5.5375 11.0125C5.5125 10.6875 5.5 10.35 5.5 10C5.5 9.65 5.5125 9.3125 5.5375 8.9875C5.5625 8.6625 5.6 8.33333 5.65 8H2.25C2.16667 8.33333 2.10417 8.6625 2.0625 8.9875C2.02083 9.3125 2 9.65 2 10C2 10.35 2.02083 10.6875 2.0625 11.0125C2.10417 11.3375 2.16667 11.6667 2.25 12ZM7.65 12H12.35C12.4 11.6667 12.4375 11.3375 12.4625 11.0125C12.4875 10.6875 12.5 10.35 12.5 10C12.5 9.65 12.4875 9.3125 12.4625 8.9875C12.4375 8.6625 12.4 8.33333 12.35 8H7.65C7.6 8.33333 7.5625 8.6625 7.5375 8.9875C7.5125 9.3125 7.5 9.65 7.5 10C7.5 10.35 7.5125 10.6875 7.5375 11.0125C7.5625 11.3375 7.6 11.6667 7.65 12ZM14.35 12H17.75C17.8333 11.6667 17.8958 11.3375 17.9375 11.0125C17.9792 10.6875 18 10.35 18 10C18 9.65 17.9792 9.3125 17.9375 8.9875C17.8958 8.6625 17.8333 8.33333 17.75 8H14.35C14.4 8.33333 14.4375 8.6625 14.4625 8.9875C14.4875 9.3125 14.5 9.65 14.5 10C14.5 10.35 14.4875 10.6875 14.4625 11.0125C14.4375 11.3375 14.4 11.6667 14.35 12ZM13.95 6H16.9C16.4167 5.16667 15.8125 4.44167 15.0875 3.825C14.3625 3.20833 13.5333 2.75 12.6 2.45C12.9 3 13.1625 3.57083 13.3875 4.1625C13.6125 4.75417 13.8 5.36667 13.95 6ZM8.1 6H11.9C11.7 5.26667 11.4417 4.575 11.125 3.925C10.8083 3.275 10.4333 2.65 10 2.05C9.56667 2.65 9.19167 3.275 8.875 3.925C8.55833 4.575 8.3 5.26667 8.1 6ZM3.1 6H6.05C6.2 5.36667 6.3875 4.75417 6.6125 4.1625C6.8375 3.57083 7.1 3 7.4 2.45C6.46667 2.75 5.6375 3.20833 4.9125 3.825C4.1875 4.44167 3.58333 5.16667 3.1 6Z" fill="#1D1B20"/>
                    </svg>

                </div>
            </div>
        </div>
    )
}

export default MenuOverlay


function SectionHeader({ label }) {
    return (
        <div className="flex flex-col">
            <span className="font-aeonik text-[15px] xl:text-[24px] font-medium text-black-custom whitespace-nowrap">
                {label}
            </span>
            <hr className="flex-1 border-black-custom" />
        </div>
    );
}

function NavColumn({
    title,
    links,
    isOpen,
    delay,
    onClose,
}) {
    return (
        <div
            style={{
                opacity: isOpen ? 1 : 0,
                transition: `opacity 380ms ease ${isOpen ? delay : 0}ms`,
            }}
        >
            <div className="pb-3 border-b border-black-custom mb-4">
                <span className="font-aeonik text-[24px] font-medium text-black-custom">
                    {title}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                {links.map(({ label, href }) => (
                    <Link
                        key={label}
                        href={href}
                        onClick={onClose}
                        tabIndex={isOpen ? 0 : -1}
                        className="font-aeonik text-[15px] xl:text-[20px]"
                    >
                        {label}
                    </Link>
                ))}
            </div>
        </div>
    );
}