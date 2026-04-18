'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 h-24 transition-all duration-300 ${
            scrolled ? 'backdrop-blur-md bg-black-custom/30' : 'bg-transparent'
        }`}>
            <div className="max-w-[1920px] mx-auto h-full flex items-center justify-between page-x">
                {/* Logo */}
                <button
                    aria-label="Home"
                    className="hidden md:flex items-center"
                >
                    <Image
                        src="/icons/logo-white.svg"
                        alt="SPOTTEQ logo"
                        width={220}
                        height={50}
                        className="h-full w-auto"
                        quality={100}
                    />
                </button>

                <div className="flex items-center space-x-32">
                    <div className="flex items-center gap-6">
                        {/* User account */}
                        <button
                            aria-label="Account"
                            className="hidden md:flex items-center h-[21px]"
                        >
                            <Image
                                src="/icons/user-icon.svg"
                                alt="User Icon"
                                width={120}
                                height={40}
                                className="h-full w-auto"
                                quality={100}
                            />
                        </button>

                        {/* Search */}
                        <button aria-label="Search" className="hidden md:flex items-center">
                            <Image
                                src="/icons/search-icon.svg"
                                alt="Search Icon"
                                width={120}
                                height={40}
                                className="h-full w-auto"
                                quality={100}
                            />
                        </button>

                        {/* Cart */}
                        <button aria-label="Cart" className="relative flex items-center">
                            <Image
                                src="/icons/cart-bag.svg"
                                alt="Cart Bag Icon"
                                width={100}
                                height={40}
                                className="h-full w-auto"
                                quality={100}
                            />
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sm font-aeonik leading-none text-white-custom">
                                100
                            </span>
                        </button>
                    </div>

                    {/* Hamburger */}
                    <button
                        aria-label="Menu"
                        className="flex flex-col"
                    >
                        <Image
                            src="/icons/menu-icon.svg"
                            alt="Menu Icon"
                            width={120}
                            height={40}
                            className="h-full w-auto"
                        />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Navbar
