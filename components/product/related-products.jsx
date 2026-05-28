import FeaturedProductsSlider from "@/components/home/featured-products-slider"
import { getRelatedProducts } from "@/sanity/getData/getRelatedProducts"


const RelatedProducts = async ({ productId, categoryIds, locale }) => {
    const products = await getRelatedProducts(productId, categoryIds, locale)

    if (!products.length) return null

    return (
        <section className="w-full bg-white py-16 xl:py-24">
            <div className="max-w-480 mx-auto page-x">
                <FeaturedProductsSlider products={products} />
            </div>
        </section>
    )
}

export default RelatedProducts
