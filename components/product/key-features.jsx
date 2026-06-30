import Image from "next/image"
import { PortableText } from "@portabletext/react"

const KeyFeatures = ({ keyFeatures }) => {
    if (!keyFeatures) return null

    const { description, features, imageUrl } = keyFeatures

    return (
        <section
            id="key-features-section"
            className="w-full bg-gray-light py-16 xl:py-24 relative"
        >
            {/* Product image — absolutely positioned, full section height, right half */}
            {imageUrl && (
                <div className="hidden xl:block absolute inset-y-0 left-[53%] top-24 h-full z-30 w-175">
                    <Image
                        src={imageUrl}
                        alt="Key features product"
                        unoptimized={true}
                        fill
                        className="object-cover object-center"
                        sizes="50vw"
                    />
                </div>
            )}

            <div className="max-w-480 mx-auto page-x">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">

                    <div className="flex flex-col gap-20 mt-4">

                        {description?.length > 0 && (
                            <div className="flex justify-between items-center gap-4 mb-2">
                                <div className="font-aeonik text-[20px] xl:text-[26px] text-black-custom leading-[1.45] [&_p]:mb-1">
                                    <PortableText value={description} />
                                </div>
                            </div>
                        )}

                        {features?.length > 0 && (
                            <div className="flex flex-col gap-10">
                                <h2 className="font-aeonik text-[23px] xl:text-[30px] text-black-custom leading-none">
                                    Key Features
                                </h2>
                                <div className="font-aeonik text-[12px] xl:text-[16px] text-black-custom leading-[1.45] max-w-125 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-4 [&_li]:flex [&_li]:items-start [&_li]:gap-2 [&_li]:before:content-[''] [&_li]:before:w-1.5 [&_li]:before:h-1.5 [&_li]:before:rounded-full [&_li]:before:bg-black-custom [&_li]:before:shrink-0 [&_li]:before:mt-[0.45em]">
                                    <PortableText value={features} />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </section>
    )
}

export default KeyFeatures
