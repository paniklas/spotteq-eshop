// Slugs are produced by greekSlugify (sanity/lib/slugify.js), which strips
// everything outside [a-z0-9-]. So anything else in a [slug] route param came
// from the URL, not from Sanity - a copied link that carried hidden
// characters, or a browser extension rewriting the href. The GROQ lookups match
// slugs exactly, so those characters turn a valid product into a 404.
//
// Two things have to happen here. Next decodes ordinary percent-escapes in page
// params (%6F -> "o") but hands the multi-byte escapes for these characters
// through verbatim, so the param can arrive as the literal text "%E2%80%8B".
// Decode first, then strip: soft hyphen, Mongolian vowel separator, zero-width
// space/non-joiner/joiner plus the bidi marks, the bidi embedding/override
// controls, word joiner and the invisible operators, and the zero-width
// no-break space (BOM).
const INVISIBLE = /[\u00AD\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g

export const normalizeSlug = (slug) => {
    if (typeof slug !== "string") return slug

    let decoded = slug
    try {
        decoded = decodeURIComponent(slug)
    } catch {
        // Malformed percent-encoding (a stray "%") - keep the raw value and let
        // the lookup below miss, rather than throwing out of the page.
    }

    return decoded.replace(INVISIBLE, "")
}
