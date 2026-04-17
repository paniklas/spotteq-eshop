import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export function proxy(request) {
    return handleI18nRouting(request);
}

export const config = {
    matcher: [
        // Redirect root to a matching locale
        '/',
        // Apply locale prefix to all locale-prefixed routes
        '/(el|en)/:path*',
        // Apply to all routes except internal Next.js paths and static files
        '/((?!_next|_vercel|.*\\..*).*)',
    ],
};
