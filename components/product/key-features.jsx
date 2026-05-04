import Image from "next/image";


const keyFeatures = [
    {
        id: "feature-1",
        description: "Advanced intra-workout formula designed to be sipped during training, not just before it.",
    },
    {
        id: "feature-2",
        description: "All-in-one performance support – one drink to cover fuel, hydration and muscle support in the same session.",
    },
    {
        id: "feature-3",
        description: "For strength and endurance sessions, from heavy lifting to long conditioning workouts.",
    },
    {
        id: "feature-4",
        description: "Stacks seamlessly with SPOTTEQ Whey Protein 80% and Creatine Monohydrate as part of a complete performance system.",
    },
    {
        id: "feature-5",
        description: "Light, refreshing taste that's easy to drink while you train, available in Green Apple and Orange.",
    },
    {
        id: "feature-6",
        description: "Manufactured in EU, in GMP & HACCP certified facilities, with clear labelling and documented quality controls.",
    },
]


const KeyFeatures = () => {
    return (
        <section
            id="key-features-section"
            className="w-full bg-gray-light py-16 xl:py-24 relative"
        >
            {/* Product image — absolutely positioned, full section height, right half */}
            <div className="hidden xl:block absolute inset-y-0 left-[53%] top-24 h-full z-30 w-175">
                <Image
                    src="/images/product-key-features.webp"
                    alt="Key features product"
                    unoptimized={true}
                    fill
                    className="object-cover object-center"
                    sizes="50vw"
                />
            </div>

            <div className="max-w-480 mx-auto page-x">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">

                    <div className="flex flex-col gap-20 mt-4">

                        <div className="flex justify-between items-center gap-4 mb-2">
                            <p className="font-aeonik text-[20px] xl:text-[26px] text-black-custom leading-[1.45]">
                                Ο συνδυασμός BCAA, αμινοξέων, βιταμινών και φυσικών εκχυλισμάτων προσφέρει ενίσχυση στην απόδοση, βελτίωση
                                της αντοχής και μείωση της κόπωσης. Συμβάλλει στην ταχύτερη ανάρρωση και στη διατήρηση της 
                                μυϊκής μάζας, υποστηρίζοντας το σώμα ακόμη και στις πιο απαιτητικές προπονήσεις.
                            </p>
                        </div>

                        <div className="flex flex-col gap-10">
                            <h2 className="font-aeonik text-[23px] xl:text-[30px] text-black-custom leading-none">
                                Key Features
                            </h2>
                            <ul className="font-aeonik text-[12px] xl:text-[16px] text-black-custom leading-[1.45] max-w-125 flex flex-col gap-4">
                                {keyFeatures.map((f) => (
                                    <li key={f.id} className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-black-custom shrink-0 mt-[0.45em]" />
                                        {f.description}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default KeyFeatures
