import Image from "next/image"
import { PortableText } from "@portabletext/react"
import { getTranslations } from "next-intl/server"

// additionalInfo is shown under the main product image only from xl; below xl
// it is shown here instead, above the in-flow image.
const KeyFeatures = async ({ keyFeatures, additionalInfo, locale }) => {
    if (!keyFeatures && !additionalInfo?.length) return null

    const t = await getTranslations({ locale, namespace: "product" })

    const { description, features, imageUrl } = keyFeatures ?? {}

    // Without keyFeatures only the below-xl additionalInfo renders, so hide
    // the otherwise empty section from xl.
    return (
        <section
            id="key-features-section"
            className={`w-full bg-gray-light py-16 xl:py-24 relative ${keyFeatures ? "" : "xl:hidden"}`}
        >
            {/* Product image — absolutely positioned, full section height, right half */}
            {imageUrl && (
                <div className="hidden xl:block absolute inset-y-0 left-[53%] top-24 h-full z-30 w-175">
                    <Image
                        src={imageUrl}
                        alt=""
                        unoptimized={true}
                        fill
                        className="object-cover object-center"
                        sizes="50vw"
                    />
                </div>
            )}

            <div className="max-w-480 mx-auto page-x">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col gap-10 xl:gap-20 mt-4">
                        {additionalInfo?.length > 0 && (
                            <div className="xl:hidden font-aeonik text-[18px] text-black-custom leading-[1.45] [&_p]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
                                <PortableText value={additionalInfo} />
                            </div>
                        )}

                        {/* Product image — mobile/tablet only, shown in flow above the description */}
                        {imageUrl && (
                            <div className="xl:hidden relative w-full aspect-3/4">
                                <Image
                                    src={imageUrl}
                                    alt=""
                                    unoptimized={true}
                                    fill
                                    className="object-cover object-center"
                                    sizes="100vw"
                                />
                            </div>
                        )}

                        {description?.length > 0 && (
                            <div className="flex justify-between items-center gap-4 mb-2">
                                <div className="font-aeonik text-[18px] xl:text-[26px] text-black-custom leading-[1.45] [&_p]:mb-1">
                                    <PortableText value={description} />
                                </div>
                            </div>
                        )}

                        {features?.length > 0 && (
                            <div className="flex flex-col gap-5 xl:gap-10">
                                <h2 className="font-aeonik text-[23px] xl:text-[30px] text-black-custom leading-none">
                                    {t("keyFeatures")}
                                </h2>
                                <div className="font-aeonik text-[13px] xl:text-[16px] text-black-custom leading-[1.45] max-w-125 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-4 [&_li]:flex [&_li]:items-start [&_li]:gap-2 [&_li]:before:content-[''] [&_li]:before:w-1.5 [&_li]:before:h-1.5 [&_li]:before:rounded-full [&_li]:before:bg-black-custom [&_li]:before:shrink-0 [&_li]:before:mt-[0.45em]">
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
