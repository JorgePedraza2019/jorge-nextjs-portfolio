// src/app/[locale]/layout.js
import "@/app/globals.css";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";

// Metadata for this layout, used by Next.js
export const metadata = {
  title: "Jorge's Portfolio",
};

// Supported locales for this layout
const supportedLocales = ["en", "es"];

/**
 * Root layout for locale-specific pages.
 *
 * - Wraps children with theme and i18n providers.
 * - Validates `locale` from route params.
 * - Loads locale-specific messages dynamically.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 * @param {Promise<Object>} props.paramsPromise - Promise resolving to route parameters
 */
export default async function RootLayout({ children, params: paramsPromise }) {
  const params = await paramsPromise;
  const { locale } = params;

  // Validate locale; throw 404 if unsupported
  if (!supportedLocales.includes(locale)) {
    notFound(); // Could use redirect('/en') for fallback instead
  }

  let messages;
  try {
    // Dynamically import locale messages
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error("Missing locale messages:", error);
    notFound(); // Could fallback to default locale instead
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* Theme provider wraps children for MUI dark/light mode */}
      {children}
    </NextIntlClientProvider>
  );
}

/**
 * Generate static params for Next.js SSG support.
 * Ensures the build generates pages for all supported locales.
 */
export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}
