/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Shopify product photos
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      // Sanity image assets
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
