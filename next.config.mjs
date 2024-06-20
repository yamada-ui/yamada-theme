/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: true,
  reactStrictMode: false,
  pageExtensions: ["page.jsx", "page.tsx"],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ja"],
    localeDetection: false,
  },
  productionBrowserSourceMaps: false,
}

export default nextConfig
