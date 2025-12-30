// src/app/[locale]/contact/layout.js
"use client";

import Script from "next/script";

export default function ContactLayout({ children }) {
  return (
    <>
      {/* reCAPTCHA v3 Invisible */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
        data-size="invisible"
      />
      {children}
    </>
  );
}
