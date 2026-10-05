// GROQ projection of an SEO object in $locale, as "seo". The home page stores it
// under `seo`, every other document type under `metadata` — same shape in both.
// Consumed by seoMetadata() in lib/seo.js.
export const seoProjection = (field) => `
    "seo": ${field} {
        "metaTitle": metaTitle[language == $locale][0].value,
        "metaDescription": metaDescription[language == $locale][0].value,
        ogImage,
        "keywords": keywords[$locale],
        canonicalUrl,
        noIndex
    }`
