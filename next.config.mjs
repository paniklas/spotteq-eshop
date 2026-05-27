import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    serverExternalPackages: ['sanity'],
    experimental: {
        prefetchInlining: true,
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