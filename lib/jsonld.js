import { urlFor } from "@/sanity/lib/image";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

// schema.org structured data (JSON-LD), built server-side from the same Sanity
// data the page renders, so markup and visible content can't drift apart.
// Rendered by components/seo/json-ld.jsx. Follows Google's docs for merchant
// listings, product variants, organization, return/shipping policy and
// breadcrumbs. Deliberately absent: review/aggregateRating (no real reviews),
// gtin (no barcodes), variesBy (Google doesn't support flavour).

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SCHEMA = "https://schema.org";

// The company behind the store (user-supplied, 2026-11-24).
const ORGANIZATION = {
    legalName: "M100 IMPACT AGENCY E.E.",
    vatID: "EL801739838",
    email: "sales@m100-agency.com",
    address: {
        "@type": "PostalAddress",
        streetAddress: "Ανδρέα Μιαούλη 13",
        addressLocality: "Νέο Ψυχικό",
        postalCode: "15451",
        addressCountry: "GR",
    },
    sameAs: [
        "https://www.instagram.com/spotteqcom/",
        "https://www.facebook.com/spotteqcom/",
        "https://www.tiktok.com/@spotteqcom",
        "https://www.youtube.com/@spotteqcom",
    ],
    // Black dot mark on white, at least 112×112 as Google requires.
    logo: `${SITE_URL}/logo/spotteq-logo-512.png`,
};

const absolute = (path) => `${SITE_URL}${path}`;

// The returns page: no returns once an order is dispatched (user kept it as is).
const RETURN_POLICY = {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "GR",
    returnPolicyCategory: `${SCHEMA}/MerchantReturnNotPermitted`,
};

// One ShippingService per active Studio method: its flat rate, plus a free
// condition from the free-shipping threshold (Google applies the lowest rate
// that fits the order). No transit/handling time: the site states none.
function shippingService(method) {
    const destination = (method.availableRegions?.length ? method.availableRegions : ["GR"])
        .map((country) => ({ "@type": "DefinedRegion", addressCountry: country }));
    const condition = (extra) => ({ "@type": "ShippingConditions", shippingDestination: destination, ...extra });
    const conditions = [
        condition({ shippingRate: { "@type": "MonetaryAmount", value: method.price ?? 0, currency: "EUR" } }),
    ];
    if (method.freeShippingMinimum > 0) {
        conditions.push(condition({
            orderValue: { "@type": "MonetaryAmount", minValue: method.freeShippingMinimum, currency: "EUR" },
            shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "EUR" },
        }));
    }
    return {
        "@type": "ShippingService",
        name: method.name,
        // BOX NOW delivers to lockers; anything else is treated as door delivery.
        fulfillmentType: method.provider === "boxnow"
            ? `${SCHEMA}/FulfillmentTypeCollectionPoint`
            : `${SCHEMA}/FulfillmentTypeDelivery`,
        shippingConditions: conditions,
    };
}

// Home page only (Google: site name + organization belong on the home page).
export function siteJsonLd(shippingMethods = []) {
    const services = shippingMethods.filter((m) => m?.name).map(shippingService);
    return {
        "@context": SCHEMA,
        "@graph": [
            {
                "@type": "WebSite",
                "@id": WEBSITE_ID,
                name: SITE_NAME,
                alternateName: "Spotteq",
                url: `${SITE_URL}/`,
                inLanguage: ["el", "en"],
                publisher: { "@id": ORG_ID },
            },
            {
                "@type": "OnlineStore",
                "@id": ORG_ID,
                name: SITE_NAME,
                legalName: ORGANIZATION.legalName,
                vatID: ORGANIZATION.vatID,
                url: `${SITE_URL}/`,
                logo: ORGANIZATION.logo,
                email: ORGANIZATION.email,
                address: ORGANIZATION.address,
                sameAs: ORGANIZATION.sameAs,
                contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    email: ORGANIZATION.email,
                    availableLanguage: ["el", "en"],
                },
                hasMerchantReturnPolicy: RETURN_POLICY,
                ...(services.length && { hasShippingService: services.length === 1 ? services[0] : services }),
            },
        ],
    };
}

// 1:1, 4:3 and 16:9, as Google recommends. Product renders are transparent
// cut-outs, so the whole image is padded onto white (fit "fill");
// ignoreImageParams stops the builder cropping to the hotspot first.
function productImages(image) {
    if (!image?.asset) return undefined;
    return [[1200, 1200], [1200, 900], [1200, 675]].map(([w, h]) =>
        urlFor(image).ignoreImageParams().width(w).height(h).fit("fill").bg("ffffff").url()
    );
}

// A real sentence for the product: the Studio meta description, else the
// tagline (often just a pack size, e.g. "30 δόσεις").
const describe = (doc, fallback) => doc.seo?.metaDescription || fallback || undefined;

// The price the page charges: sale price when set (same rule as the product
// and bundle components), with the regular price as the strikethrough.
function offer({ price, salePrice, inStock, url }) {
    const current = salePrice ?? price;
    if (!(current > 0)) return undefined;
    return {
        "@type": "Offer",
        url,
        price: current,
        priceCurrency: "EUR",
        availability: `${SCHEMA}/${inStock ? "InStock" : "OutOfStock"}`,
        itemCondition: `${SCHEMA}/NewCondition`,
        seller: { "@id": ORG_ID },
        ...(salePrice != null && price > salePrice && {
            priceSpecification: {
                "@type": "UnitPriceSpecification",
                priceType: `${SCHEMA}/StrikethroughPrice`,
                price,
                priceCurrency: "EUR",
            },
        }),
    };
}

const BRAND = { "@type": "Brand", name: SITE_NAME };

// No inventory set means unlimited (as in product-interactive).
const productInStock = (inventory) => inventory == null || inventory > 0;

// Other active flavours of this product (the Studio list may include itself).
const flavourSiblings = (product) =>
    (product.flavours ?? []).filter((f) => f._id !== product._id && f.slug);

// The product's name in structured data and breadcrumbs: flavour variants are
// named with their flavour (Google: variant names should be specific).
export function productSchemaName(product) {
    return flavourSiblings(product).length && product.flavourName
        ? `${product.title} – ${product.flavourName}`
        : product.title;
}

// Product page. A product whose active flavours include others becomes a
// ProductGroup (Google's multi-page variants: every flavour page carries the
// whole group, this flavour in full and its siblings by URL).
export function productJsonLd(product, locale) {
    const productPath = (slug) => absolute(`/${locale}/shop/product/${slug}`);
    const url = productPath(product.slug);
    const offers = offer({
        price: product.price,
        salePrice: product.salePrice,
        inStock: productInStock(product.inventory),
        url,
    });
    if (!offers) return null;

    const siblings = flavourSiblings(product);
    const variant = {
        "@type": "Product",
        name: productSchemaName(product),
        sku: product.sku || undefined,
        image: productImages(product.image),
        description: describe(product, product.tagline),
        brand: BRAND,
        offers,
    };
    if (!siblings.length) return { "@context": SCHEMA, ...variant };

    // Stable across flavours: the lowest Sanity _id in the group, including
    // flavours that are switched off (flavourIds), so it never shifts.
    const groupIds = [product._id, ...(product.flavourIds ?? [])].filter(Boolean).sort();
    return {
        "@context": SCHEMA,
        "@type": "ProductGroup",
        name: product.title,
        description: describe(product, product.tagline),
        brand: BRAND,
        productGroupID: `spotteq-${groupIds[0]}`,
        hasVariant: [
            variant,
            ...siblings.map((f) => ({ "@type": "Product", url: productPath(f.slug) })),
        ],
    };
}

// Bundle page. In stock when every slot has a selectable option (the default
// product, or an active flavour when the slot allows changing) with stock for
// the slot's quantity — the same bound bundle-interactive applies.
export function bundleJsonLd(bundle, locale) {
    const inStock = (bundle.products ?? []).every((item) => {
        const options = [item.product, ...(item.allowFlavourChange ? item.flavours ?? [] : [])].filter(Boolean);
        const qty = item.quantity || 1;
        return options.some((o) => o.inventory == null || Math.floor(o.inventory / qty) >= 1);
    });
    const offers = offer({
        price: bundle.bundlePrice,
        salePrice: bundle.saleBundlePrice,
        inStock,
        url: absolute(`/${locale}/shop/bundle/${bundle.slug}`),
    });
    if (!offers) return null;
    return {
        "@context": SCHEMA,
        "@type": "Product",
        name: bundle.title,
        image: productImages(bundle.image),
        description: describe(bundle, bundle.description),
        brand: BRAND,
        offers,
    };
}

// items: [{ name, path }] from the home page down; the last item (the page
// itself) needs no URL. Google requires at least two items.
export function breadcrumbJsonLd(items) {
    const list = items.filter((i) => i?.name);
    if (list.length < 2) return null;
    return {
        "@context": SCHEMA,
        "@type": "BreadcrumbList",
        itemListElement: list.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            ...(index < list.length - 1 && item.path != null && { item: absolute(item.path) }),
        })),
    };
}

export const HOME_CRUMB = (locale) => ({ name: SITE_NAME, path: `/${locale}` });
