/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Shopify product photos are served from the Shopify CDN
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

export default nextConfig;
