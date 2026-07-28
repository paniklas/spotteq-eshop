import Image from "next/image";
import { Link } from "@/i18n/navigation";
import HeroPromoBar from "./hero-promo-bar";


const HeroSection = () => {

    return (
        <section
            id="hero-section"
            className="relative w-full overflow-hidden flex flex-col bg-white-custom md:min-h-255">
            {/* Background video — covers the top region on mobile, the full section on desktop */}
            <video
                className="absolute inset-x-0 top-0 h-168 md:h-full w-full object-cover z-0"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="/videos/hero-poster.webp"
            >
                <source src="/videos/hero-video.webm" type="video/webm" />
                <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>

            {/* ---------------- Mobile / tablet layout (below md) ---------------- */}
            <div className="md:hidden relative z-10 flex flex-col">

                {/* Promo bar — opens the first-order modal */}
                <HeroPromoBar />

                {/* Video region — headline + subtitle over a darkened video */}
                <div className="relative h-160 w-full">
                    {/* Dark overlay across the video area only */}
                    {/* <div className="absolute inset-0 bg-black/45 z-0" /> */}

                    <div className="relative z-10 flex flex-col justify-end h-full page-x pb-52.5">
                        <h1 className="font-aeonik text-white text-[27px] leading-[1.2] mb-3">
                            We spot your strength
                        </h1>
                        <p className="font-aeonik text-white text-[19px] leading-[1.15] max-w-85">
                            Some train alone. Never unseen.
                            <br />
                            We&rsquo;re there, even when no one else is.
                        </p>
                    </div>
                </div>

                {/* Product bleeds up over the video's lower edge into the white space, arrows flanking */}
                <div className="relative z-20 -mt-42.5 flex items-center justify-center">
                    {/* Left arrow */}
                    <button
                        aria-label="Previous"
                        className="absolute left-8 top-1/2 -translate-y-1/2 z-10 text-white-custom cursor-pointer"
                    >
                          <svg width="40" height="40" viewBox="0 0 40 40" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.46967 19.4697C9.17678 19.7626 9.17678 20.2374 9.46967 20.5303L14.2426 25.3033C14.5355 25.5962 15.0104 25.5962 15.3033 25.3033C15.5962 25.0104 15.5962 24.5355 15.3033 24.2426L11.0607 20L15.3033 15.7574C15.5962 15.4645 15.5962 14.9896 15.3033 14.6967C15.0104 14.4038 14.5355 14.4038 14.2426 14.6967L9.46967 19.4697ZM30 20L30 19.25L10 19.25L10 20L10 20.75L30 20.75L30 20Z" fill="white"/>
                        </svg>
                    </button>

                    <Image
                        src="/images/protein-home-hero.webp"
                        alt="SPOTTEQ 100% Pure Whey Protein"
                        width={1200}
                        height={933}
                        sizes="330px"
                        unoptimized={true}
                        quality={100}
                        className="w-full max-w-82.5 h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
                        priority
                    />

                    {/* Right arrow */}
                    <button
                        aria-label="Next"
                        className="absolute right-8 top-1/2 -translate-y-1/2 z-10 text-white-custom cursor-pointer"
                    >
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30.5303 20.5303C30.8232 20.2374 30.8232 19.7626 30.5303 19.4697L25.7574 14.6967C25.4645 14.4038 24.9896 14.4038 24.6967 14.6967C24.4038 14.9896 24.4038 15.4645 24.6967 15.7574L28.9393 20L24.6967 24.2426C24.4038 24.5355 24.4038 25.0104 24.6967 25.3033C24.9896 25.5962 25.4645 25.5962 25.7574 25.3033L30.5303 20.5303ZM10 20L10 20.75L30 20.75L30 20L30 19.25L10 19.25L10 20Z" fill="white"/>
                        </svg>

                    </button>
                </div>

                {/* SHOP ALL — in the white space beneath the product */}
                <div className="flex justify-center pt-2 pb-14">
                    <Link
                        href="/shop/shop-all"
                        className="inline-flex items-center justify-center h-9.5 px-10 bg-black-custom text-white-custom rounded-[21px] font-aeonik text-[13px] tracking-wide hover:bg-white-custom hover:text-black-custom border border-black-custom transition-colors duration-700"
                    >
                        SHOP ALL
                    </Link>
                </div>
            </div>

            {/* ---------------- Desktop layout (md and up) — unchanged ---------------- */}
            {/* Constrained content wrapper — video bleeds full-width, this stays at 1920px */}
            <div className="relative hidden md:flex flex-1 flex-col max-w-480 w-full mx-auto">

                {/* Product image – right side */}
                <div className="absolute right-[5%] xl:right-[8%] -bottom-30 z-20 flex items-end justify-center">
                    {/* Radial glow behind product */}
                    <div
                        className="absolute w-125 h-125 xl:w-175 xl:h-175 rounded-full pointer-events-none"
                        style={{background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)' }}
                    />
                    <Image
                        src="/images/protein-home-hero.webp"
                        alt="SPOTTEQ protein product"
                        width={380}
                        height={520}
                        sizes="(min-width: 1536px) 560px, 400px"
                        unoptimized={true}
                        quality={100}
                        className="relative w-100 xl:w-140 aspect-380/520 object-contain drop-shadow-[0_0_60px_rgba(255,255,255,0.25)]"
                        priority
                    />
                </div>

                {/* Hero text content */}
                <div className="relative z-30 flex-1 flex flex-col justify-end pb-38 page-x">
                    <h1 className="font-aeonik text-white text-[40px] md:text-[55px] leading-[1.2] whitespace-nowrap mb-6">
                        We spot your strength
                    </h1>
                    <p className="font-aeonik text-white text-[22px] md:text-[35px] leading-[1.1] mb-10 max-w-180">
                        Some train alone. Never unseen.
                    <br />
                        We&rsquo;re there, even when no one else is.
                    </p>
                    <div>
                        <Link
                            href="/shop/shop-all"
                            className="inline-flex items-center justify-center h-10.25 w-39.75 bg-white-custom rounded-[21px] font-aeonik text-black-custom text-[14px] tracking-wide hover:bg-black-custom hover:text-white-custom transition-colors duration-700"
                        >
                            SHOP NOW
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection