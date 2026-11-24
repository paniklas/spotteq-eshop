import { defineQuery } from "next-sanity";
import { catalogFetch } from "@/sanity/lib/catalogFetch";
import { routing } from "@/i18n/routing";
import { SITE_URL, isPlaceholder } from "@/lib/seo";

// Every indexable URL, in both locales. Only what a visitor can reach and the
// page itself would let be indexed: active products/bundles/categories with a
// slug in that locale, Site Settings pages that exist, nothing marked noIndex
// in Studio, no placeholder translations (lib/seo.js PLACEHOLDER_PAGES), and no
// locale whose Studio canonicalUrl points elsewhere (a sitemap lists canonicals).
// lastModified is the document's own _updatedAt; pages with no source document
// (shop listings, contact until it has one) get none rather than a made-up
// date. hreflang lives in each page's <head> (lib/seo.js localeAlternates), not
// repeated here.

const SITEMAP_QUERY = defineQuery(`{
    "docs": *[
        _type in ["product", "bundle", "category"] && status == true
        && !(_id in path("drafts.**")) && metadata.noIndex != true
    ] {
        _type,
        _updatedAt,
        "el": slugs.el.current,
        "en": slugs.en.current,
        "canonical": metadata.canonicalUrl
    },
    "pages": *[
        _type in ["homePage", "aboutPage", "contactPage", "faqPage", "ambassadorPage", "legalPage"]
        && !(_id in path("drafts.**"))
    ] {
        _id, _type, _updatedAt,
        "noIndex": coalesce(metadata.noIndex, seo.noIndex, false),
        "canonical": coalesce(metadata.canonicalUrl, seo.canonicalUrl)
    }
}`);

const DOC_BASE = {
    product: "/shop/product",
    bundle: "/shop/bundle",
    category: "/shop/category",
};

// Singleton pages: legalPage is one type with fixed ids, the rest one type each.
const PAGE_PATH = {
    homePage: "",
    aboutPage: "/about",
    contactPage: "/contact",
    faqPage: "/faq",
    ambassadorPage: "/ambassador",
    privacyPage: "/privacy",
    termsPage: "/terms",
    cookiesPage: "/cookies",
    shippingPage: "/shipping",
    returnsPage: "/returns",
};

// Pages that render without a document (home and contact fall back to the
// messages; the shop listings have none), so they're listed either way. The
// other singleton pages 404 until their document exists.
const ALWAYS_PATHS = ["", "/contact", "/shop/shop-all", "/shop/bundles"];

export default async function sitemap() {
    const { docs, pages } = await catalogFetch({
        query: SITEMAP_QUERY,
        // The revalidate webhook purges these on publish, so the sitemap follows.
        tags: ["products", "bundles", "categories", "homePage", "aboutPage", "contactPage", "faqPage", "ambassadorPage", "legalPage"],
    });

    const entries = [];
    const add = (locale, path, lastModified) => {
        entries.push({ url: `${SITE_URL}/${locale}${path}`, ...(lastModified && { lastModified }) });
    };

    const pageByPath = new Map();
    for (const page of pages) {
        const path = PAGE_PATH[page._type === "legalPage" ? page._id : page._type];
        if (path !== undefined) pageByPath.set(path, page);
    }

    for (const path of new Set([...ALWAYS_PATHS, ...pageByPath.keys()])) {
        const page = pageByPath.get(path);
        if (page?.noIndex) continue;
        for (const locale of routing.locales) {
            if (!isPlaceholder(path, locale) && !page?.canonical?.[locale]) add(locale, path, page?._updatedAt);
        }
    }

    for (const doc of docs) {
        for (const locale of routing.locales) {
            if (doc[locale] && !doc.canonical?.[locale]) add(locale, `${DOC_BASE[doc._type]}/${doc[locale]}`, doc._updatedAt);
        }
    }

    return entries;
}
