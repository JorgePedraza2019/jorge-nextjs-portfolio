"use client";

import { useRef } from "react";
import HeroSection from "./components/HeroSection";
import TabsSection from "./components/TabsSection";

export default function HomePage({ locale }) {
  const tabsRef = useRef(null);

  return (
    <>
      <main>
        <HeroSection locale={locale} tabsRef={tabsRef} />
        <TabsSection ref={tabsRef} />
      </main>
    </>
  );
}