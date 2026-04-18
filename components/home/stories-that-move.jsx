import Image from "next/image";

const AMBASSADOR_IMG = "/images/ghavelas.webp";

const StoriesThatMove = () => {
    return (
        <section className="w-full bg-gray-light">
            <div className="max-w-[1920px] mx-auto page-x">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
                    {/* Text */}
                    <div className="flex flex-col justify-between h-full py-6 xl:py-12">
                        <span className="font-aeonik text-[18px] xl:text-[20px] text-black">
                            Stories that move
                        </span>

                        <div className="flex flex-col gap-10 mt-4">
                            <div>
                                <h3 className="font-aeonik text-[26px] xl:text-[30px] text-black-custom leading-[1.45]">
                                    Nassos Ghavelas
                                </h3>
                                <div className="flex justify-between items-center gap-4 mb-2">
                                    <p className="font-tt text-[16px] xl:text-[20px] text-black-custom leading-[1.45]">
                                        Paralympic Champion, SPOTTEQ Ambassador
                                    </p>
                                    <p className="font-tt text-[14px] text-black-custom">
                                        Feb 6, 2026
                                    </p>
                                </div>
                            </div>

                            <blockquote className="font-tt text-[16px] xl:text-[18px] text-black-custom leading-[1.6] max-w-[653px]">
                                In elite sport, it&rsquo;s the small details that make the
                                difference. What I appreciate about SPOTTEQ is that it
                                doesn&rsquo;t promise miracles; it delivers clean, targeted
                                formulas and I know exactly what they do to my body. For me,
                                performance is not just about times and records, but about
                                feeling safe and confident in every training session and every
                                race.
                            </blockquote>
                        </div>

                        {/* Carousel controls */}
                        <div className="flex items-center gap-3 mt-20">
                            {/* Left arrow */}
                            <button aria-label="Previous" className="w-10 h-10 flex items-center justify-center shrink-0 rotate-180 rounded-full hover:bg-gray-mint cursor-pointer transition-colors duration-300">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M30.5303 20.5303C30.8232 20.2374 30.8232 19.7626 30.5303 19.4697L25.7574 14.6967C25.4645 14.4038 24.9896 14.4038 24.6967 14.6967C24.4038 14.9896 24.4038 15.4645 24.6967 15.7574L28.9393 20L24.6967 24.2426C24.4038 24.5355 24.4038 25.0104 24.6967 25.3033C24.9896 25.5962 25.4645 25.5962 25.7574 25.3033L30.5303 20.5303ZM10 20L10 20.75L30 20.75L30 20L30 19.25L10 19.25L10 20Z" fill="black"/>
                                </svg>

                            </button>
                            {/* Right arrow */}
                            <button aria-label="Next" className="w-10 h-10 flex items-center justify-center shrink-0 rounded-full hover:bg-gray-mint cursor-pointer transition-colors duration-300">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M30.5303 20.5303C30.8232 20.2374 30.8232 19.7626 30.5303 19.4697L25.7574 14.6967C25.4645 14.4038 24.9896 14.4038 24.6967 14.6967C24.4038 14.9896 24.4038 15.4645 24.6967 15.7574L28.9393 20L24.6967 24.2426C24.4038 24.5355 24.4038 25.0104 24.6967 25.3033C24.9896 25.5962 25.4645 25.5962 25.7574 25.3033L30.5303 20.5303ZM10 20L10 20.75L30 20.75L30 20L30 19.25L10 19.25L10 20Z" fill="black"/>
                                </svg>
                            </button>
                            {/* Progress line */}
                            <div className="flex items-center">
                                <div className="w-[89px] border-t-[3px] border-black" />
                                <div className="w-[89px] border-t border-black/50" />
                                <div className="w-[89px] border-t border-black/50" />
                            </div>
                        </div>
                    </div>

                    {/* Ambassador image */}
                    <div className="relative h-[500px] xl:h-[606px] overflow-hidden">
                        <Image
                            src={AMBASSADOR_IMG}
                            alt="Nassos Ghavelas – Paralympic Champion"
                            fill
                            sizes="(max-width: 1280px) 100vw, 50vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StoriesThatMove