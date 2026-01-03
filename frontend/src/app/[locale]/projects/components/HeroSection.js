// HERO DE PROYECTOS
"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const { scrollYProgress } = useScroll();
  const { darkMode } = useSelector((state) => state.theme);
  const theme = useTheme();
  const t = useTranslations("projects");

  const videoScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.25]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.3]);

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "35vh", sm: "50vh" }, // altura responsiva
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 5,
      }}
    >
      {/* VIDEO ENTRADA + PARALLAX */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.5 }}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            scale: videoScale,
            opacity: videoOpacity,
            willChange: "transform, opacity",
          }}
        >
          <video
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}videos/projects/portfolio/light/hero.mp4`}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: darkMode ? 0 : 1,
              transition: "opacity 0.6s ease",
            }}
          />
          <video
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}videos/projects/portfolio/dark/hero.mp4`}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: darkMode ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          />
        </motion.div>
      </motion.div>

      {/* TEXTO */}
      <Box
        sx={{
          position: "relative",
          zIndex: 3,
          maxWidth: 1400,
          width: "100%",
          color: theme.palette.common.white,
          textShadow: `0 0 15px ${alpha(theme.palette.common.black, 0.6)}`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <Typography
            variant="h2"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: { xs: "2rem", sm: "3rem" }, // tipografía responsiva
              mb: 2,
              lineHeight: 1.15,
            }}
          >
            {t("heroTitle")}
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
}
