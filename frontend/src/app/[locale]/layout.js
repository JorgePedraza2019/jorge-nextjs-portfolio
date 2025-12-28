// src/app/[locale]/layout.js
// Root layout for localized routes: wraps every page inside /[locale]/
// Global styles, Next.js navigation utilities, i18n provider, shared UI components
import "@/app/globals.css";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeRegistry from "@/components/Theme/ThemeRegistry";
import AIAssistantBar from "@/components/AI/AIAssistantBar";

// Basic metadata configuration for this layout (can be extended per page)
// Metadata for this layout, used by Next.js
export const metadata = {
  title: "Jorge's Portfolio",
};

// List of allowed locales used for static generation and validation
// Supported locales for this layout
const supportedLocales = ["en", "es"];

// Root layout component: validates locale, loads translations, and wraps the UI
export default async function RootLayout({ children, params: paramsPromise }) {
  // Extract locale parameter from dynamic segment /[locale]
  const params = await paramsPromise;
  const { locale } = params;

  // If the locale is not supported, show 404 page (or redirect if preferred)
  // Validate locale; throw 404 if unsupported
  if (!supportedLocales.includes(locale)) {
    notFound(); // Could use redirect('/en') for fallback instead
  }

  // Load translation messages dynamically based on the active locale
  let messages;
  try {
    // Dynamically import the JSON file containing i18n strings
    // Dynamically import locale messages
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error("Missing locale messages:", error);
    notFound(); // Could fallback to default locale instead
  }

  // Wrap all children with NextIntlProvider, Navbar, ThemeRegistry, and Footer
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* Theme provider wraps children for MUI dark/light mode */}
      <ThemeRegistry>
        <Navbar locale={locale} />
        <AIAssistantBar />
        {children}
        <Footer locale={locale} />
      </ThemeRegistry>
    </NextIntlClientProvider>
  );
}

// Pre-generate localized routes at build time for SSG support
/**
 * Generate static params for Next.js SSG support.
 * Ensures the build generates pages for all supported locales.
 */
export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}
