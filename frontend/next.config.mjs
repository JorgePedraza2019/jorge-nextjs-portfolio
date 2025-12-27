// next.config.mjs
// Import the Next.js Internationalization plugin
import createNextIntlPlugin from "next-intl/plugin";

// Import the supported locales and default locale from the configuration file
import { locales, defaultLocale } from "./next-intl.config.js";

// Create a Next.js plugin instance for internationalization
const withNextIntl = createNextIntlPlugin();

// Next.js configuration object
const nextConfig = {
  // Experimental features section
  experimental: {
    // Enable server actions (currently an experimental Next.js feature)
    serverActions: {},
  },

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https", // Only allow images served over HTTPS
        hostname: "flagcdn.com", // Restrict images to this hostname
        port: "", // Default port (empty means any)
        pathname: "/**", // Allow all paths under flagcdn.com
      },
    ],
  },

  /**
   * 🔁 Proxy interno para backend (SOLO Docker / feature)
   * El browser llama a /api/*
   * Next.js reenvía internamente a http://backend:3001
   */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend:3001/:path*",
      },
    ];
  },
};

// Export the Next.js configuration wrapped with the NextIntl plugin
// This integrates internationalization with the specified locales and default locale
export default withNextIntl(nextConfig, {
  locales, // Array of supported locales
  defaultLocale, // Default locale for the application
});
