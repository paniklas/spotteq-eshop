import { notFound } from "next/navigation";
import { getLegalPage } from "@/sanity/getData/getLegalPage";
import LegalPage from "@/components/legal/legal-page";
import SpotteqImage from "@/components/home/spotteq-image";
import { seoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic"
export const revalidate = 86400;

// Shipping & Payments from Sanity (Site Settings → Shipping & Payments); empty SEO fields
// fall back to the page heading.
export async function generateMetadata({ params }, parent) {
    const { locale } = await params
    const page = await getLegalPage("shippingPage", locale)
    if (!page) return {}
    return seoMetadata(page.seo, locale, { title: page.heading }, parent)
}

export default async function ShippingPage({ params }) {
    const { locale } = await params
    const page = await getLegalPage("shippingPage", locale)
    if (!page) notFound()

    return (
        <>
            <LegalPage heading={page.heading} body={page.body} />
            <SpotteqImage />
        </>
    )
}
