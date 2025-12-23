// src/i18n/request.js

import { getRequestConfig } from "next-intl/server";

// -------------------------
// Supported locales and default locale
// -------------------------
const locales = ["en", "es"];
const defaultLocale = "en";

/**
 * Provides a configuration for server-side requests with localization support.
 * Loads the appropriate translation messages based on the request locale.
 *
 * @param {Object} param0 - Destructured request object from Next.js
 * @param {string} param0.locale - Locale extracted from the request URL
 * @returns {Promise<Object>} - Configuration object with locale and messages
 */
export default getRequestConfig(async ({ locale }) => {
  // -------------------------
  // Validate locale; fallback to defaultLocale if not supported
  // -------------------------
  const safeLocale = locales.includes(locale) ? locale : defaultLocale;

  // -------------------------
  // Dynamically import the JSON translation file for the locale
  // -------------------------
  return {
    locale: safeLocale,
    messages: (await import(`../messages/${safeLocale}.json`)).default,
  };
});
