import Image from "next/image";
import Link from "next/link";

const TRAINING_IMG = "/images/training-banner.webp";


const TrainingBanner = () => {
    return (
        <section className="bg-white-custom py-16 xl:py-24">
            <div className="max-w-[1920px] mx-auto page-x">
                <Link
                    href="/series/training"
                    className="group relative block max-w-[1100px] h-[400px] xl:h-[560px] overflow-hidden"
                >
                    <Image
                        src={TRAINING_IMG}
                        alt="Training Accessories series"
                        fill
                        sizes="100vw"
                        unoptimized={true}
                        quality={100}
                        className="w-full h-full object-cover transition-transform duration-500 rounded-[30px]"
                    />

                    {/* Content overlay */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                        <span className="font-tt font-semibold text-white-custom text-[16px] leading-[1.45]">
                            03
                        </span>

                        {/* Bottom block — shifts up on hover to reveal description */}
                        <div className="flex flex-col gap-3 translate-y-[calc(1.6em+0.75rem)] group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            {/* Title with animated underline */}
                            <span className="font-aeonik text-white-custom text-[20px] xl:text-[24px] leading-[1.6] relative w-fit">
                                Training Accessories
                                <span className="absolute bottom-0 left-0 h-px w-0 bg-white-custom group-hover:w-full transition-all duration-500 ease-out" />
                            </span>
                            <p className="font-aeonik text-white-custom text-[14px] xl:text-[18px] max-w-[700px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                                From wraps and shakers to everyday carry bags, these training accessories cover the small details that keep every session smoother, safer and more efficient.
                            </p>
                        </div>

                        {/* Arrow — absolutely positioned, pure horizontal animation */}
                        <svg width="55" height="15" viewBox="0 0 55 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-8 right-8 w-14 h-14 opacity-0 -translate-x-14 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out delay-100">
                            <path d="M53.9856 8.07088C54.3762 7.68035 54.3762 7.04719 53.9856 6.65666L47.6217 0.292702C47.2312 -0.0978227 46.598 -0.0978227 46.2075 0.292702C45.8169 0.683226 45.8169 1.31639 46.2075 1.70692L51.8643 7.36377L46.2075 13.0206C45.8169 13.4111 45.8169 14.0443 46.2075 14.4348C46.598 14.8254 47.2312 14.8254 47.6217 14.4348L53.9856 8.07088ZM0 7.36377V8.36377H53.2785V7.36377V6.36377H0V7.36377Z" fill="white"/>
                        </svg>

                    </div>
                </Link>
            </div>
        </section>
    )
}

export default TrainingBanner