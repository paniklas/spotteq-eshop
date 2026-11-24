// A JSON-LD <script> (built by lib/jsonld.js). `<` is escaped as in the
// Next.js JSON-LD guide, so CMS text can't close the script tag (XSS).
export default function JsonLd({ data }) {
    if (!data) return null;
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
    );
}
