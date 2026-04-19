import Image from "next/image";
import Link from "next/link";

const series = [
    {
        number: "01",
        title: "Performance Series",
        description: "High-performance protein and workout formulas designed to fuel strength, training intensity and endurance.",
        img: "/images/performance-series.webp",
        href: "/shop/performance-series",
    },
    {
        number: "02",
        title: "Clinical Series",
        description: "High-performance protein and workout formulas designed to fuel strength, training intensity and endurance.",
        img: "/images/clinical-series-1.webp",
        href: "/shop/clinical-series",
    },
];


const ShopBySeries = () => {
    return (
        <section
            id="shop-by-series-section"
            className="w-full bg-white-custom py-10 xl:py-14"
        >
            <div className="max-w-[1920px] mx-auto page-x">
                <h2 className="font-aeonik text-black text-[28px] xl:text-[35px] leading-[1.45] mb-8">
                    Shop by series
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {series.map((s) => (
                        <Link
                            key={s.number}
                            href={s.href}
                            className="group relative z-20 overflow-hidden rounded-[25px] block"
                            style={{ aspectRatio: "787/518" }}
                        >
                            <Image
                                src={s.img}
                                alt={s.title}
                                fill
                                sizes="(min-width: 1536px) 800px, (min-width: 768px) 50vw, 100vw"
                                quality={100}
                                className="object-cover rounded-[25px]"
                            />
                            {/* Gradient overlay */}
                            {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 rounded-[25px]" /> */}

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                <span className="font-tt font-semibold text-white-custom text-[16px] leading-[1.45]">
                                    {s.number}
                                </span>

                                {/* Bottom block — shifts up on hover to reveal description */}
                                <div className="flex flex-col gap-3 translate-y-[calc(1.6em+0.75rem)] group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    {/* Title with animated underline */}
                                    <span className="font-aeonik text-white-custom text-[20px] xl:text-[24px] leading-[1.6] relative w-fit">
                                        {s.title}
                                        <span className="absolute bottom-0 left-0 h-px w-0 bg-white-custom group-hover:w-full transition-all duration-500 ease-out" />
                                    </span>
                                    <p className="font-aeonik text-white-custom text-[14px] xl:text-[18px] max-w-[480px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                                        {s.description}
                                    </p>
                                </div>

                                {/* Arrow — absolutely positioned, pure horizontal animation */}
                                <svg width="55" height="15" viewBox="0 0 55 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-8 right-8 w-14 h-14 opacity-0 -translate-x-14 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out delay-100">
                                    <path d="M53.9856 8.07088C54.3762 7.68035 54.3762 7.04719 53.9856 6.65666L47.6217 0.292702C47.2312 -0.0978227 46.598 -0.0978227 46.2075 0.292702C45.8169 0.683226 45.8169 1.31639 46.2075 1.70692L51.8643 7.36377L46.2075 13.0206C45.8169 13.4111 45.8169 14.0443 46.2075 14.4348C46.598 14.8254 47.2312 14.8254 47.6217 14.4348L53.9856 8.07088ZM0 7.36377V8.36377H53.2785V7.36377V6.36377H0V7.36377Z" fill="white"/>
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ShopBySeries