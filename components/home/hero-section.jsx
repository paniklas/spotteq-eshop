import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
    return (
        <section className="relative w-full min-h-[1020px] overflow-hidden flex flex-col">
            {/* Background video */}
            <video
                className="absolute inset-0 w-full h-full object-cover z-0"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="/videos/hero-poster.jpg"
            >
                <source src="/videos/hero-video.webm" type="video/webm" />
                <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>

            {/* Product image – right side */}
            <div className="absolute right-[5%] xl:right-[8%] -bottom-30 z-20 flex items-end justify-center">
                {/* Radial glow behind product */}
                <div
                    className="absolute w-[500px] h-[500px] xl:w-[700px] xl:h-[700px] rounded-full pointer-events-none"
                    style={{background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)' }}
                />
                <Image
                    src="/images/protein-home-hero.webp"
                    alt="SPOTTEQ protein product"
                    width={380}
                    height={520}
                    sizes="(min-width: 1536px) 560px, 400px"
                    quality={100}
                    className="relative w-[400px] xl:w-[560px] aspect-[380/520] object-contain drop-shadow-[0_0_60px_rgba(255,255,255,0.25)]"
                    priority
                />
            </div>

            {/* Hero text content */}
            <div className="relative z-30 flex-1 flex flex-col justify-end pb-38 page-x">
                <h1 className="font-aeonik text-white text-[40px] md:text-[55px] leading-[1.2] whitespace-nowrap mb-6">
                    We spot your strength
                </h1>
                <p className="font-aeonik text-white text-[22px] md:text-[35px] leading-[1.1] mb-10 max-w-[720px]">
                    Some train alone. Never unseen.
                <br />
                    We&rsquo;re there, even when no one else is.
                </p>
                <div>
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center h-[41px] w-[159px] bg-white-custom rounded-[21px] font-aeonik text-black-custom text-[14px] tracking-wide hover:bg-black-custom hover:text-white-custom transition-colors duration-700"
                    >
                        SHOP NOW
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default HeroSection