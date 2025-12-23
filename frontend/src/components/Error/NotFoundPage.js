// src/components/Error/NotFoundPage.js
"use client";

import { Box, Typography, Button, Container } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * NotFound
 *
 * A simple 404 page component.
 * - Extracts the locale from the URL path (e.g., '/en/...').
 * - Displays localized title and message based on the locale.
 * - Provides a button to navigate back to the homepage.
 *
 * Uses Material UI for styling and layout.
 */
export default function NotFound() {
  const pathname = usePathname();

  // Extract locale from pathname (default to 'en')
  const locale = pathname?.split("/")[1] || "en";

  // Localized titles
  const titles = {
    en: "Page Not Found",
    es: "Página no encontrada",
  };

  // Localized messages
  const messages = {
    en: "Sorry, we couldn't find what you were looking for.",
    es: "Lo sentimos, no pudimos encontrar lo que estás buscando.",
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh", // Full viewport height
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          gap: 3, // Space between elements
        }}
      >
        {/* 404 Error Code */}
        <Typography
          variant="h1"
          fontSize="6rem"
          fontWeight="bold"
          color="primary"
        >
          404
        </Typography>

        {/* Localized Title */}
        <Typography variant="h4" gutterBottom>
          {titles[locale] || titles.en}
        </Typography>

        {/* Localized Message */}
        <Typography variant="body1" color="text.secondary">
          {messages[locale] || messages.en}
        </Typography>

        {/* Back to Home Button */}
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href={`/${locale}`}
        >
          {locale === "es" ? "Volver al inicio" : "Go back home"}
        </Button>
      </Box>
    </Container>
  );
}
