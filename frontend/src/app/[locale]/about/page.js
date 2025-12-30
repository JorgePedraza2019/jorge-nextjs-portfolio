// src/app/[locale]/landing/page.js
"use client";

import AboutContent from "./components/AboutContent";
import Timeline from "./components/Timeline";

export default function HomePage({ locale }) {
  return (
    <>
      <AboutContent />
      <Timeline />
    </>
  );
}
