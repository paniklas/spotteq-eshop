import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { defineRouting } from 'next-intl/routing';
import { NextResponse } from 'next/server';

const routing = defineRouting({
    locales: ['en', 'el'],
    defaultLocale: 'el',
});

const handleI18nRouting = createMiddleware(routing);

// Only the account area requires authentication. Everything else (shop,
// product, bundle, checkout, cart) stays public — guest checkout is preserved.
const isProtectedRoute = createRouteMatcher(['/:locale/account(.*)', '/account(.*)']);

export default clerkMiddleware(async (auth, request) => {
    const { pathname } = request.nextUrl;

    // Sanity Studio lives at the root and must bypass both auth and locale handling.
    if (pathname.startsWith('/studio-spotteq')) return NextResponse.next();
    if (pathname.startsWith('/sso-callback')) return NextResponse.next();
    // API routes need clerkMiddleware() to run so auth() works inside them,
    // but must bypass next-intl's locale routing/redirects.
    if (pathname.startsWith('/api')) return NextResponse.next();

    if (isProtectedRoute(request)) {
        const { userId } = await auth();
        if (!userId) {
            // Extract the locale from the pathname (e.g. /el/account → el), fall back to 'el'.
            const localeSegment = pathname.split('/')[1];
            const locale = ['en', 'el'].includes(localeSegment) ? localeSegment : 'el';
            const signInUrl = new URL(`/${locale}/sign-in`, request.url);
            signInUrl.searchParams.set('redirect_url', request.url);
            return NextResponse.redirect(signInUrl);
        }
    }

    return handleI18nRouting(request);
});

export const config = {
    matcher: [
        // Redirect root to a matching locale
        '/',
        // Apply locale prefix to all locale-prefixed routes
        '/(el|en)/:path*',
        // Apply to all routes except internal Next.js paths, static files, and the studio
        // (API routes are matched here too so clerkMiddleware() runs, but are bypassed above)
        '/((?!_next|_vercel|studio-spotteq|.*\\..*).*)',
    ],
};
