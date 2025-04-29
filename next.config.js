/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  env: {
    siteTitle: "Herbs & Potions",
    siteDescription: "For all your CBD needs",
    siteKeywords: "CBD, Products, Potions, Magic",
    siteUrl: "https://herbspotions.com",
    siteImagePreviewUrl: "",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'herbspotions.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: 'us-central1-shopify-38458.cloudfunctions.net',
      },
      {
        protocol: 'https',
        hostname: 'herbsandpotions.myshopify.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'vitals.vercel-insights.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google-analytics.com',
      },
      {
        protocol: 'https',
        hostname: 'ssl.google-analytics.com',
      },
      {
        protocol: 'https',
        hostname: 'www.googletagmanager.com',
      },
      {
        protocol: 'https',
        hostname: 'analytics.google.com',
      },
      {
        protocol: 'https',
        hostname: 'media.giphy.com',
      },
    ],
  },
  webpack(config) { // Removed the type annotation
    if (config.output) {
      config.output.crossOriginLoading = "anonymous";
    }
    return config;
  },
};

module.exports = nextConfig;