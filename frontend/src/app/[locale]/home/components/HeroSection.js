// ./frontend/src/app/[locale]/home/components/HeroSection.js
"use client";

import { Box, Typography, Button, useMediaQuery } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

export default function HeroSection({ locale }) {
  const t = useTranslations("home.hero");
  const { scrollYProgress } = useScroll();
  const { darkMode } = useSelector((state) => state.theme);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detecta móviles

  // Typing effect for title (Front-End Developer → Back-End Developer → Full-Stack Developer)
  const roles = [
    "Front-End",
    "Back-End",
    "Full-Stack Developer",
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const typingSpeed = isDeleting ? 50 : 90;
    const pauseAfterTyping = 1200;

    let timeout;

    // If we reached the last role and finished typing it, stop completely
    if (
      roleIndex === roles.length - 1 &&
      displayText === currentRole &&
      !isDeleting
    ) {
      return;
    }

    if (!isDeleting && displayText === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), pauseAfterTyping);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => prev + 1);
    } else {
      timeout = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting
            ? prev.slice(0, -1)
            : currentRole.slice(0, prev.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  // Parallax suave al hacer scroll
  const videoScale = useTransform(
    scrollYProgress,
    [0, isMobile ? 0.3 : 0.4],
    [1, isMobile ? 1.1 : 1.25]
  );
  const videoOpacity = useTransform(
    scrollYProgress,
    [0, isMobile ? 0.3 : 0.4],
    [1, 0.3]
  );

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: { xs: 2, sm: 3 },
        "@keyframes blink": {
          "0%, 50%": { opacity: 1 },
          "51%, 100%": { opacity: 0 },
        },
      }}
    >
      {/* VIDEO ENTRADA + PARALLAX */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 1.0 }}
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
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              backgroundColor: darkMode
                ? alpha(theme.palette.common.black, 0.25)
                : alpha(theme.palette.common.black, 0.15),
              pointerEvents: "none",
            }}
          />
          <video
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/videos/home/light/hero.mp4`}
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
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/videos/home/dark/hero.mp4`}
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

      {/* TEXTO PREMIUM */}
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
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              mb: 2,
              lineHeight: 1.15,
            }}
          >
            {/* {t("heading")} */}
            Hello
            <br />
            <span style={{ color: "var(--mui-palette-primary-main)" }}>
              {displayText}
              <span
                style={{
                  display: "inline-block",
                  width: "0.6ch",
                  marginLeft: 2,
                  opacity: 0.8,
                  animation: "blink 1s infinite",
                }}
              >
                |
              </span>
            </span>
          </Typography>
        </motion.div>

        {/* Descripción */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.55 }}
        >
          <Typography
            sx={{
              fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.15rem" },
              maxWidth: isMobile ? "100%" : 550,
              mb: 4,
            }}
          >
            {t("description")}
          </Typography>
        </motion.div>

        {/* Botón */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.75 }}
        >
          <Button
            component={Link}
            href={`/${locale}/projects`}
            variant="contained"
            sx={{
              borderRadius: 3,
              px: { xs: 3, sm: 4 },
              py: { xs: 1.5, sm: 1.8 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontWeight: 600,
              boxShadow: `0px 4px 12px ${alpha(
                theme.palette.primary.main,
                0.3
              )}, 0px 1px 5px ${alpha(theme.palette.primary.main, 0.15)}`,
              textTransform: "none",
              "&:hover": {
                background: theme.palette.primary.dark,
                transform: "translateY(-2px)",
                boxShadow: `0px 6px 16px ${alpha(
                  theme.palette.primary.main,
                  0.4
                )}, 0px 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
              },
              transition: "all 0.25s ease",
            }}
          >
            {t("buttonText")}
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
}
