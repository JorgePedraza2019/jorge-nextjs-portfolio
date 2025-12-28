// src/app/not-found.js
"use client";

import NotFoundPage from "@/components/Error/NotFoundPage";

/**
 * NotFound
 *
 * Page component rendered by Next.js when a route does not match any existing page.
 * - Simply delegates rendering to the NotFoundPage component.
 * - This file is part of Next.js 13+ App Router error handling.
 */
export default function NotFound() {
  return <NotFoundPage />;
}
