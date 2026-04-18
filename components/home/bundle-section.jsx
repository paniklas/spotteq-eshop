import Link from "next/link";
import BundleCard from "./bundle-card";


const VITAMIN_C = "/images/products/group-84.png";
const PROTEIN_CHOCOLATE = "/images/products/group-86.png";
const PROTEIN_STRAWBERRY = "/images/products/group-87.png";
const PROTEIN_COOKIE = "/images/products/group-88.png";


const bundles = [
    {
        title: "Recovery & Protection",
        products: "Liposomal Magnesium · Liposomal Vitamin C",
        description:
        "Supports muscle function, recovery and everyday immune protection.",
        price: "40€",
        images: [VITAMIN_C],
    },
    {
        title: "Performance Complete",
        products: "Whey Protein 80% · Creatine Monohydrate · Hyperfuel®",
        description:
        "Three core formulas working together to fuel intensity, build strength and support recovery.",
        price: "40€",
        images: [PROTEIN_CHOCOLATE],
    },
    {
        title: "Strength & Growth",
        products: "Whey Protein 80% · Creatine Monohydrate",
        description:
        "Clean protein paired with micronized creatine to support muscle growth, strength and consistent training performance.",
        price: "40€",
        images: [PROTEIN_STRAWBERRY],
    },
    {
        title: "Total System",
        products:
        "Whey Protein 80% · Hyperfuel® · Creatine Monohydrate · Liposomal Vitamin C · Liposomal Magnesium",
        description:
        "The complete SPOTTEQ system. Five formulas covering performance, recovery and everyday protection in one set.",
        price: "40€",
        images: [PROTEIN_COOKIE],
    },
];


const BundleSection = () => {
    return (
         <section className="w-full bg-gray-light py-16 xl:py-24">
            <div className="max-w-[1920px] mx-auto page-x">
                {/* Header */}
                <div className="flex items-center justify-between mb-20">
                    <h2 className="font-aeonik text-black text-[28px] xl:text-[35px] leading-[1.45]">
                        Our Bundles
                    </h2>
                    <p className="font-aeonik text-black-custom text-[16px] xl:text-[18px] leading-[1.2] max-w-[700px] hidden md:block">
                        Curated combinations of products that work together – for strength,
                        performance, recovery and everyday health. Choose a Performance or
                        Clinical bundle to simplify your routine and get a complete SPOTTEQ
                        system in just one step.
                    </p>
                    <Link
                        href="/bundles"
                        className="hidden xl:inline-flex items-center justify-center h-[41px] w-[159px] bg-black rounded-[21px] font-aeonik text-white-custom text-[14px] hover:bg-white-custom hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-700 shrink-0"
                    >
                        VIEW OUR BUNDLES
                    </Link>
                </div>

                <p className="font-aeonik text-black text-[16px] xl:text-[18px] leading-[1.2] mb-10 md:hidden">
                    Curated combinations of products that work together – for strength,
                    performance, recovery and everyday health.
                </p>

                {/* Row 1: two equal cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BundleCard {...bundles[0]} />
                    <BundleCard {...bundles[1]} />
                </div>

                {/* Row 2: vertical card narrower, horizontal card wider */}
                <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 mt-6">
                    <BundleCard {...bundles[2]} variant="vertical" />
                    <BundleCard {...bundles[3]} />
                </div>

                <div className="mt-8 flex justify-center xl:hidden">
                    <Link
                        href="/bundles"
                        className="inline-flex items-center justify-center h-[41px] w-[159px] bg-black-custom rounded-[20px] font-aeonik text-white text-[14px]"
                    >
                        VIEW OUR BUNDLES
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default BundleSection