import { urlFor } from "@/sanity/lib/image";

export const SITE_NAME = "SPOTTEQ";

// Production origin for canonical, hreflang, sitemap and robots URLs. Fixed rather
// than NEXT_PUBLIC_BASE_URL: these must always name the live site (the bare
// domain 308-redirects here), even when rendered on a preview or locally.
export const SITE_URL = "https://www.spotteq.com";

// Robots for private or per-user pages (checkout, account, sign-in).
export const NO_INDEX = { index: false, follow: false };

const OG_LOCALES = { el: "el_GR", en: "en_US" };

// Fixed pages whose text in a locale is still a placeholder: noindex in that
// locale, and left out of its hreflang and the sitemap. Remove the entry once
// the real copy is in Studio.
//   /ambassador en — Claude's translation, until the client's official English.
export const PLACEHOLDER_PAGES = { "/ambassador": ["en"] };

export function isPlaceholder(path, locale) {
  return Boolean(PLACEHOLDER_PAGES[path]?.includes(locale));
}

// Canonical + hreflang for a page. `paths` is the path after the locale prefix:
// a string when both locales share it ("/about", "" for home), or { el, en } when
// the slug differs per locale. A locale with no path (missing slug, placeholder
// page) gets no hreflang entry. x-default is Greek: the store sells in Greece.
// Relative URLs resolve against metadataBase.
export function localeAlternates(locale, paths) {
  const byLocale = typeof paths === "string"
    ? Object.fromEntries(Object.keys(OG_LOCALES).map((lang) => [lang, isPlaceholder(paths, lang) ? null : paths]))
    : paths;
  const languages = {};
  for (const [lang, path] of Object.entries(byLocale)) {
    if (path != null) languages[lang] = `/${lang}${path}`;
  }
  if (languages.el) languages["x-default"] = languages.el;
  return withoutEmpty({ canonical: languages[locale], languages });
}

// localeAlternates() paths for a document with per-locale slugs, e.g.
// slugPaths("/shop/product", { el: "…", en: "…" }). A missing slug stays null.
export function slugPaths(base, slugsByLocale) {
  const paths = {};
  for (const lang of Object.keys(OG_LOCALES)) {
    const slug = slugsByLocale?.[lang];
    paths[lang] = slug ? `${base}/${slug}` : null;
  }
  return paths;
}

// Appends the brand unless the title already carries it, so Sanity titles
// written as "SPOTTEQ Creatine | …" don't end up with it twice.
export function brandTitle(title) {
  if (!title) return undefined;
  return /spotteq/i.test(title) ? title : `${title} | ${SITE_NAME}`;
}

// Next metadata from a Sanity SEO object (sanity/lib/seoProjection.js), with the
// page's own content as fallback for the fields left empty in Studio.
//   fallback: { title, description, image } — image is a Sanity image source.
//   parent:   generateMetadata's second argument. A page's openGraph replaces the
//             layout's whole, so without an image of its own the page re-uses the
//             parent's (the site default) rather than sharing with none.
//   paths:    the page's path per locale, see localeAlternates(). The Studio
//             canonicalUrl for this locale, when set, overrides the self-
//             referencing canonical (and the sitemap then leaves this URL out).
export async function seoMetadata(seo, locale, fallback = {}, parent, paths) {
  const title = brandTitle(seo?.metaTitle || fallback.title);
  const description = seo?.metaDescription || fallback.description || undefined;

  // The OG image is cropped to the 1200×630 share format; a fallback page image
  // (often a transparent product cutout) is only resized, never cropped.
  let image;
  if (seo?.ogImage?.asset) {
    image = { url: urlFor(seo.ogImage).width(1200).height(630).url(), width: 1200, height: 630 };
  } else if (fallback.image?.asset) {
    image = { url: urlFor(fallback.image).width(1200).url() };
  }
  const resolvedParent = !image && parent ? await parent : null;
  const ogImages = image ? [image] : resolvedParent?.openGraph?.images;
  const twitterImages = image ? [image.url] : resolvedParent?.twitter?.images;
  const hasImage = Boolean(ogImages?.length);

  let alternates;
  if (paths != null) alternates = localeAlternates(locale, paths);
  if (seo?.canonicalUrl) alternates = { ...alternates, canonical: seo.canonicalUrl };

  // withoutEmpty: Next turns a key that is present but undefined into null,
  // which would wipe the layout's default instead of falling back to it.
  return withoutEmpty({
    title,
    description,
    keywords: seo?.keywords?.length ? seo.keywords : undefined,
    alternates,
    robots: seo?.noIndex || isPlaceholder(paths, locale) ? NO_INDEX : undefined,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale],
      url: alternates?.canonical,
      title,
      description,
      images: ogImages,
    },
    twitter: {
      card: hasImage ? "summary_large_image" : "summary",
      title,
      description,
      images: twitterImages,
    },
  });
}

function withoutEmpty(metadata) {
  return Object.fromEntries(Object.entries(metadata).filter(([, value]) => value !== undefined));
}

// Site-wide defaults for the locale layout: what any page without its own
// metadata shows. Deliberately no canonical, robots or keywords — those are
// page-specific and would otherwise be inherited by every page.
export async function defaultMetadata(seo, locale, fallback = {}) {
  const { title, description, openGraph, twitter } = await seoMetadata(seo, locale, fallback);
  return {
    // Resolves the relative canonical/hreflang URLs pages set via localeAlternates().
    metadataBase: new URL(SITE_URL),
    // A plain default, not a "%s | SPOTTEQ" template: pages pass titles already
    // run through brandTitle(), which a template would brand a second time.
    title,
    description,
    // No og:title / twitter:title here: a page without its own openGraph would
    // inherit the home title. Platforms fall back to the page's <title> instead.
    openGraph: { ...openGraph, title: undefined, description: undefined },
    twitter: { ...twitter, title: undefined, description: undefined },
  };
}
