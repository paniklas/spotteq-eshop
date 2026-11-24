import { SITE_URL } from "@/lib/seo";

// Every crawler is allowed, AI crawlers included (user's choice). Only crawl
// waste is disallowed: API routes (form posts and webhooks, no content) and the
// Studio. Checkout, account and sign-in are NOT disallowed on purpose — they
// carry a noindex robots meta, which crawlers can only see if they may fetch
// the page.
export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/studio-spotteq"],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
