// src/layout.js

import Providers from "@/components/Providers";
import Script from "next/script";

/**
 * Metadata for the application
 * - Defines the default title and description for the website.
 * - Can be extended for SEO purposes.
 */
export const metadata = {
  title: "Jorge's Portfolio",
  description: "Page not found or path does not exist.",
};

/**
 * RootLayout
 *
 * Root layout component for the entire application.
 * - Wraps all pages with Providers to supply Redux store, session management,
 *   theming, and token renewal functionality.
 * - Sets the HTML language to English.
 *
 * @param {React.ReactNode} children - Page content rendered inside the layout
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics solo en producción */}
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <Script
              id="ga-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
