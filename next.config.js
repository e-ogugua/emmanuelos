/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix for framer-motion SSR hydration issues
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  // Enable React strict mode but suppress hydration warnings
  reactStrictMode: true,
};

module.exports = nextConfig;
