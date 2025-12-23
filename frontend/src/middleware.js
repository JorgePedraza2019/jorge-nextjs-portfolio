// src/middleware.js

import { NextResponse } from "next/server";

// -------------------------
// Supported locales and protected routes
// -------------------------
const supportedLocales = ["en", "es"]; // List of locales supported by the app

/**
 * Next.js middleware to handle locale redirects and route protection
 *
 * @param {Request} request - The incoming request object from Next.js
 * @returns {NextResponse} - Either a redirect or allows the request to continue
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // -------------------------
  // Redirect root "/" to default locale based on browser language
  // -------------------------
  if (pathname === "/") {
    const acceptLanguage = request.headers.get("accept-language") || "";
    const locale =
      supportedLocales.find((lang) => acceptLanguage.includes(lang)) || "en"; // Default to 'en' if no match
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // -------------------------
  // Extract locale from URL and validate it
  // -------------------------
  const locale = pathname.split("/")[1];
  if (!supportedLocales.includes(locale)) {
    // If locale is invalid, redirect to default locale (English)
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  // -------------------------
  // Allow the request to continue
  // -------------------------
  return NextResponse.next();
}

// -------------------------
// Apply middleware only to specific paths
// -------------------------
export const config = {
  matcher: [
    "/", // Root
    "/(en|es)/portal/:path*", // Protected portal routes
    "/(en|es)/dashboard/:path*", // Protected dashboard routes
  ],
};
