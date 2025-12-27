"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Toaster } from "react-hot-toast";
import HeroSection from "./components/HeroSection";
import ContactForm from "./components/ContactForm";

export default function ContactPage() {
  const t = useTranslations("contact");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Toaster />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{
          minHeight: isMobile ? "80vh" : "75vh",
          position: "relative",
          overflow: "hidden",
          paddingTop: isMobile ? 88 : 72,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            minHeight: isMobile ? "80vh" : "75vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: isMobile ? 8 : 10,
            px: isMobile ? 2 : 2,
            overflow: "hidden",
            transition: "background 0.6s ease, color 0.6s ease",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')",
              opacity: theme.palette.mode === "dark" ? 0.12 : 0.07,
              pointerEvents: "none",
              zIndex: 0,
            },
          }}
        >
          <HeroSection t={t} theme={theme} isMobile={isMobile} />
          <ContactForm t={t} theme={theme} isMobile={isMobile} />
        </Box>
      </motion.div>
    </>
  );
}
