import createMiddleware from 'next-intl/middleware';
import { defineRouting } from 'next-intl/routing';

const routing = defineRouting({
    locales: ['en', 'el'],
    defaultLocale: 'el',
});

const handleI18nRouting = createMiddleware(routing);

export function proxy(request) {
    const { pathname } = request.nextUrl;
    if (pathname.startsWith('/studio-spotteq')) return;
    return handleI18nRouting(request);
}

export const config = {
    matcher: [
        // Redirect root to a matching locale
        '/',
        // Apply locale prefix to all locale-prefixed routes
        '/(el|en)/:path*',
        // Apply to all routes except internal Next.js paths, static files, the studio, and API routes
        '/((?!_next|_vercel|studio-spotteq|api|.*\\..*).*)',
    ],
};
