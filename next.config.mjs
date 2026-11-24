import createNextIntlPlugin from 'next-intl/plugin';
import { withBotId } from 'botid/next/config';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    serverExternalPackages: ['sanity'],
    // PostHog reverse proxy: serves the SDK and ingests events first-party, so
    // ad blockers drop fewer of them (api_host in instrumentation-client.js).
    // The static/array rules must stay before the catch-all. proxy.js bypasses
    // /sq-relay so it is not locale-redirected.
    async rewrites() {
        return [
            { source: '/sq-relay/static/:path*', destination: 'https://eu-assets.i.posthog.com/static/:path*' },
            { source: '/sq-relay/array/:path*', destination: 'https://eu-assets.i.posthog.com/array/:path*' },
            { source: '/sq-relay/:path*', destination: 'https://eu.i.posthog.com/:path*' },
        ];
    },
    // PostHog's endpoints end in a slash (/e/, /flags/); avoid a 308 on each.
    skipTrailingSlashRedirect: true,
    experimental: {
        prefetchInlining: true,
        // Reuse a visited dynamic route's client-side payload for 30s, so
        // re-navigating to a recently-seen shop/category page skips the skeleton
        // and the server round-trip. Trade-off: a soft navigation to a just-
        // visited route can show up to 30s-stale content after a Sanity publish
        // (a hard reload / new visitor / the server itself are always fresh, and
        // the charged price is always recomputed server-side).
        staleTimes: { dynamic: 30 },
    },
    images: {
        qualities: [75, 90, 100],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
                port: ""
            },
            {
                hostname: "cdn.sanity.io",
            }
        ],
    },
};

// withBotId adds the rewrites that serve Vercel BotID's challenge script
// first-party (see instrumentation-client.js).
export default withBotId(withNextIntl(nextConfig));