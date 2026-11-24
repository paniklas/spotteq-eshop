// Sanity Studio's own document (app/layout.jsx is a pass-through). The Studio
// brings its own styles, so no globals.css/fonts here. next-sanity's defaults:
// robots noindex, same-origin referrer, and a viewport the Studio expects.
export { metadata, viewport } from "next-sanity/studio";

export default function StudioLayout({ children }) {
    return (
        <html lang="en">
            <body style={{ margin: 0 }}>{children}</body>
        </html>
    );
}
