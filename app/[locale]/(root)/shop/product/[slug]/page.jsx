import { notFound } from "next/navigation"
import ProductInteractive from "@/components/shop/product-interactive"

const PRODUCTS = {
    "hyperfuel-green-apple": {
        name: "Hyperfuel®",
        size: "390g / 1 - Month Supply",
        badge: "BESTSELLER",
        subtitle: ["Advanced Intra-Workout", "All-in-One Performance Formula"],
        highlights: [
            "4000mg BCAAs 4:1:1",
            "3000mg L-Alanine · 1500mg L-Glutamine",
            "Energy · Focus · Endurance",
            "With Caffeine, Green Tea & Vitamins",
        ],
        price: 40,
        flavours: ["Green Apple", "Orange", "Tropical"],
        images: [
            "/images/products/group-84.png",
            "/images/products/group-87.png",
        ],
        inStock: true,
        ingredients:
            "BCAAs (L-Leucine, L-Isoleucine, L-Valine 4:1:1), L-Alanine, L-Glutamine, Caffeine Anhydrous, Green Tea Extract (50% EGCG), Vitamin B6, Vitamin B12, Vitamin C, Natural & Artificial Flavours, Sucralose, Citric Acid.",
        directions:
            "Mix 1 scoop (13g) with 300–400ml cold water. Shake well and consume 20–30 minutes before training. Do not exceed 1 serving per day.",
        tagline:
            "Ολοκληρωμένη φόρμουλα ενέργειας και αποκατάστασης, ειδικά σχεδιασμένη για αθλητές με υψηλές απαιτήσεις.",
    },
    "hyperfuel-orange": {
        name: "Hyperfuel®",
        size: "390g / 1 - Month Supply",
        badge: "BESTSELLER",
        subtitle: ["Advanced Intra-Workout", "All-in-One Performance Formula"],
        highlights: [
            "4000mg BCAAs 4:1:1",
            "3000mg L-Alanine · 1500mg L-Glutamine",
            "Energy · Focus · Endurance",
            "With Caffeine, Green Tea & Vitamins",
        ],
        price: 40,
        flavours: ["Green Apple", "Orange", "Tropical"],
        images: [
            "/images/products/group-87.png",
            "/images/products/group-84.png",
        ],
        inStock: true,
        ingredients:
            "BCAAs (L-Leucine, L-Isoleucine, L-Valine 4:1:1), L-Alanine, L-Glutamine, Caffeine Anhydrous, Green Tea Extract (50% EGCG), Vitamin B6, Vitamin B12, Vitamin C, Natural & Artificial Flavours, Sucralose, Citric Acid.",
        directions:
            "Mix 1 scoop (13g) with 300–400ml cold water. Shake well and consume 20–30 minutes before training. Do not exceed 1 serving per day.",
        tagline:
            "Ολοκληρωμένη φόρμουλα ενέργειας και αποκατάστασης, ειδικά σχεδιασμένη για αθλητές με υψηλές απαιτήσεις.",
    },
    "whey-protein-chocolate": {
        name: "100% Pure Whey Protein",
        size: "900g / 30 servings",
        badge: null,
        subtitle: ["Premium Whey Protein Formula", "Chocolate Flavour"],
        highlights: [
            "25g Protein per serving",
            "Low in sugar and fat",
            "Fast absorption",
            "No fillers or artificial colours",
        ],
        price: 40,
        flavours: ["Chocolate", "Strawberry"],
        images: ["/images/products/group-86.png"],
        inStock: true,
        ingredients:
            "Whey Protein Concentrate, Cocoa Powder, Natural Flavouring, Sucralose, Soy Lecithin.",
        directions:
            "Mix 1 scoop (30g) with 250ml cold water or milk. Consume within 30 minutes post-training.",
        tagline:
            "Υψηλής ποιότητας πρωτεΐνη ορού γάλακτος για μέγιστη μυϊκή ανάπτυξη και αποκατάσταση.",
    },
    "whey-protein-strawberry": {
        name: "100% Pure Whey Protein",
        size: "900g / 30 servings",
        badge: null,
        subtitle: ["Premium Whey Protein Formula", "Strawberry Flavour"],
        highlights: [
            "25g Protein per serving",
            "Low in sugar and fat",
            "Fast absorption",
            "No fillers or artificial colours",
        ],
        price: 40,
        flavours: ["Chocolate", "Strawberry"],
        images: ["/images/products/group-88.png"],
        inStock: true,
        ingredients:
            "Whey Protein Concentrate, Natural Strawberry Flavouring, Sucralose, Soy Lecithin.",
        directions:
            "Mix 1 scoop (30g) with 250ml cold water or milk. Consume within 30 minutes post-training.",
        tagline:
            "Υψηλής ποιότητας πρωτεΐνη ορού γάλακτος για μέγιστη μυϊκή ανάπτυξη και αποκατάσταση.",
    },
    "liposomal-magnesium-1": {
        name: "Liposomal Magnesium",
        size: "60 caps / 1 - Month Supply",
        badge: null,
        subtitle: ["Advanced Liposomal Delivery", "93.6mg Elemental Magnesium"],
        highlights: [
            "93.6 mg 25% NRV per capsule",
            "Liposomal technology for superior absorption",
            "Vegan capsules",
            "EU GMP certified",
        ],
        price: 40,
        flavours: [],
        images: ["/images/products/liposomal-magnesium-1.png"],
        inStock: true,
        ingredients:
            "Magnesium Bisglycinate, Phosphatidylcholine (Sunflower Lecithin), Hydroxypropyl Methylcellulose (capsule), Microcrystalline Cellulose.",
        directions:
            "Take 1 capsule daily with food. Do not exceed the recommended daily dose.",
        tagline:
            "Προηγμένη λιποσωματική φόρμουλα μαγνησίου για βέλτιστη απορρόφηση και μυϊκή λειτουργία.",
    },
    "liposomal-magnesium-2": {
        name: "Liposomal Magnesium",
        size: "60 caps / 1 - Month Supply",
        badge: null,
        subtitle: ["Advanced Liposomal Delivery", "93.6mg Elemental Magnesium"],
        highlights: [
            "93.6 mg 25% NRV per capsule",
            "Liposomal technology for superior absorption",
            "Vegan capsules",
            "EU GMP certified",
        ],
        price: 40,
        flavours: [],
        images: ["/images/products/liposomal-magnesium-2.png"],
        inStock: true,
        ingredients:
            "Magnesium Bisglycinate, Phosphatidylcholine (Sunflower Lecithin), Hydroxypropyl Methylcellulose (capsule), Microcrystalline Cellulose.",
        directions:
            "Take 1 capsule daily with food. Do not exceed the recommended daily dose.",
        tagline:
            "Προηγμένη λιποσωματική φόρμουλα μαγνησίου για βέλτιστη απορρόφηση και μυϊκή λειτουργία.",
    },
    "liposomal-magnesium-3": {
        name: "Liposomal Magnesium",
        size: "60 caps / 1 - Month Supply",
        badge: null,
        subtitle: ["Advanced Liposomal Delivery", "93.6mg Elemental Magnesium"],
        highlights: [
            "93.6 mg 25% NRV per capsule",
            "Liposomal technology for superior absorption",
            "Vegan capsules",
            "EU GMP certified",
        ],
        price: 40,
        flavours: [],
        images: ["/images/products/liposomal-magnesium-3.png"],
        inStock: true,
        ingredients:
            "Magnesium Bisglycinate, Phosphatidylcholine (Sunflower Lecithin), Hydroxypropyl Methylcellulose (capsule), Microcrystalline Cellulose.",
        directions:
            "Take 1 capsule daily with food. Do not exceed the recommended daily dose.",
        tagline:
            "Προηγμένη λιποσωματική φόρμουλα μαγνησίου για βέλτιστη απορρόφηση και μυϊκή λειτουργία.",
    },
    "liposomal-vitamin-c": {
        name: "Liposomal Vitamin C",
        size: "60 caps / 1 - Month Supply",
        badge: null,
        subtitle: ["Advanced Liposomal Delivery", "High-Potency Vitamin C"],
        highlights: [
            "Superior bioavailability vs standard Vitamin C",
            "Immune system support",
            "Antioxidant protection",
            "Vegan capsules",
        ],
        price: 40,
        flavours: [],
        images: ["/images/products/liposomal-magnesium-3.png"],
        inStock: true,
        ingredients:
            "Ascorbic Acid, Phosphatidylcholine (Sunflower Lecithin), Hydroxypropyl Methylcellulose (capsule), Microcrystalline Cellulose.",
        directions:
            "Take 1 capsule daily with food. Do not exceed the recommended daily dose.",
        tagline:
            "Λιποσωματική βιταμίνη C για ενίσχυση του ανοσοποιητικού και μέγιστη αντιοξειδωτική προστασία.",
    },
}

const RELATED_PRODUCTS = [
    {
        id: "whey-protein-chocolate",
        name: "Pure Whey Protein",
        variant: "Chocolate",
        price: 40,
        image: "/images/products/group-86.png",
    },
    {
        id: "creatine-200mesh",
        name: "Creatine Monohydrate",
        variant: "200 mesh",
        price: 40,
        image: "/images/products/liposomal-magnesium-1.png",
    },
]

const ProductPage = async ({ params }) => {
    const { slug } = await params
    const product = PRODUCTS[slug]

    if (!product) notFound()

    return <ProductInteractive product={product} relatedProducts={RELATED_PRODUCTS} />
}

export default ProductPage
