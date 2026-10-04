import { preload } from "react-dom";
import { Link } from "@/i18n/navigation";
import { getFirstOrderPromoPercentForDisplay } from "@/sanity/getData/getFirstOrderPromo";
import { getHeroImages } from "@/sanity/getData/getHeroImages";
import HeroPromoBar from "./hero-promo-bar";
import HeroProductSlider from "./hero-product-slider";
import HeroVideo from "./hero-video";

// Shown until product images are added in Studio (Site Settings → Home Page).
const FALLBACK_HERO_IMAGE = {
    url: "/images/protein-home-hero.webp",
    alt: "SPOTTEQ 100% Pure Whey Protein",
    width: 1200,
    height: 933,
};

const HeroSection = async ({ locale }) => {

    // The video poster is the mobile LCP element: fetch it at high priority from <head>.
    preload("/videos/hero-poster.webp", { as: "image", fetchPriority: "high" });

    // Advertised percentage comes from the same Studio setting that grants the
    // discount at checkout, so the two can never drift apart.
    const [firstOrderPromoPercent, sanityHeroImages] = await Promise.all([
        getFirstOrderPromoPercentForDisplay(),
        getHeroImages(locale),
    ]);

    // A Studio image without alt text for this locale is treated as decorative:
    // borrowing the fallback's description would misname any other product.
    const heroImages = sanityHeroImages.length
        ? sanityHeroImages.map((image) => ({ ...image, alt: image.alt || "" }))
        : [FALLBACK_HERO_IMAGE];

    return (
        <section
            id="hero-section"
            className="relative w-full overflow-hidden flex flex-col bg-white-custom md:min-h-255">
            {/* Background video — covers the top region on mobile, the full section on desktop */}
            <HeroVideo className="absolute inset-x-0 top-0 h-168 md:h-full w-full object-cover z-0" />

            {/* ---------------- Mobile / tablet layout (below md) ---------------- */}
            <div className="md:hidden relative z-10 flex flex-col">

                {/* Promo bar — opens the first-order modal */}
                <HeroPromoBar percent={firstOrderPromoPercent} />

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
                <HeroProductSlider images={heroImages} variant="mobile" />

                {/* SHOP ALL — in the white space beneath the product */}
                <div className="flex justify-center pt-2">
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
                    <HeroProductSlider images={heroImages} variant="desktop" />
                </div>

                {/* Hero text content — spans the full width above the product, so it lets
                    clicks through to the product arrows; only the button takes them back */}
                <div className="relative z-30 flex-1 flex flex-col justify-end pb-38 page-x pointer-events-none">
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
                            className="pointer-events-auto inline-flex items-center justify-center h-10.25 w-39.75 bg-white-custom rounded-[21px] font-aeonik text-black-custom text-[14px] tracking-wide hover:bg-black-custom hover:text-white-custom transition-colors duration-700"
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