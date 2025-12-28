// src/app/[locale]/page.js
import { notFound } from "next/navigation";

import HomePage from "./home/page.js";

/**
 * Locale-specific landing page handler.
 *
 * - Fetches `locale` from dynamic route parameters.
 * - Redirects to 404 page if the locale is unsupported.
 * - Renders the LandingPage component with the correct locale.
 *
 * @param {Object} props
 * @param {Promise<Object>} props.paramsPromise - Promise resolving to route parameters
 */
export default async function LocaleHome({ params: paramsPromise }) {
  const params = await paramsPromise;
  const { locale } = params;

  // Validate locale; throw 404 if unsupported
  if (!["es", "en"].includes(locale)) notFound();

  // Render the landing page with the valid locale
  return <HomePage locale={locale} />;
}
