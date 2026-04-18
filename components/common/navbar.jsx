import Image from "next/image";

const Navbar = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-24 transition-colors duration-300 bg-black">
            <div className="max-w-[1920px] mx-auto h-full flex items-center justify-between px-4">
                <div className="text-xl font-bold">Logo</div>

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
                        />
                        <span className="absolute text-sm font-aeonik leading-none text-white-custom">
                            100
                        </span>
                    </button>

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