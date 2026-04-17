import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    images: {
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