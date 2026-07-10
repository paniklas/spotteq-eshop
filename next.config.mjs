import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    serverExternalPackages: ['sanity'],
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

export default withNextIntl(nextConfig);