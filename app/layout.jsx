// Pass-through root layout. <html> and <body> are rendered one level down, where
// the route knows its language:
//   app/[locale]/layout.jsx        — the shop, <html lang={locale}>
//   app/studio-spotteq/layout.jsx  — Sanity Studio
//   app/sso-callback/layout.jsx    — Clerk OAuth callback
//   app/not-found.jsx              — 404 for anything the above don't render
// Here the locale could only come from the request, which is empty when a page
// is pre-rendered (the force-static home), so /en was served <html lang="el">.
// The file is still required because app/not-found.jsx and app/page.jsx live
// at the root (the next-intl pattern for a [locale] root).
export default function RootLayout({ children }) {
    return children;
}
