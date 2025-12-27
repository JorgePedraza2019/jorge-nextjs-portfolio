// src/app/[locale]/contact/components/HeroSection.js
"use client";

import { Box, Typography, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function HeroSection({ t, theme, isMobile }) {
  return (
    <>
      {/* STRONGER GLOW */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: isMobile ? 400 : 600,
          height: isMobile ? 400 : 600,
          borderRadius: "50%",
          background: theme.palette.mode === "dark"
            ? `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.12)}, transparent 70%)`
            : `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.22)}, transparent 70%)`,
          filter: "blur(85px)",
          zIndex: 1,
          transform: `translate(-50%, -50%)`,
        }}
      />

      {/* TITLE */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ zIndex: 2 }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            textAlign: "center",
            mb: 2,
            letterSpacing: "-1px",
            fontSize: isMobile ? "2rem" : { xs: "2.2rem", md: "3.5rem" },
            color: theme.palette.text.primary,
          }}
        >
          {t("title").replace(t("highlight"), "")}
          <Box component="span" sx={{ color: theme.palette.primary.main }}>
            {t("highlight")}
          </Box>
          .
        </Typography>

        <Typography
          sx={{
            maxWidth: isMobile ? "90%" : 650,
            textAlign: "center",
            opacity: 0.75,
            mb: 3,
            fontSize: isMobile ? "1rem" : "1.15rem",
            lineHeight: 1.65,
            color: theme.palette.text.secondary,
            mx: "auto",
          }}
        >
          {t("description")}
        </Typography>
      </motion.div>

      {/* SOCIAL ICONS */}
      <Box
        sx={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          gap: isMobile ? 1.5 : 2,
          mb: isMobile ? 5 : 8,
          justifyContent: "center",
        }}
      >
        <IconButton
          component="a"
          href="https://www.linkedin.com/in/jorge-pedraza-valdez-309878152"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            borderRadius: "12px",
            width: isMobile ? 36 : 44,
            height: isMobile ? 36 : 44,
            backgroundColor: theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.05)
              : alpha(theme.palette.common.black, 0.05),
            "&:hover": {
              backgroundColor: theme.palette.mode === "dark"
                ? alpha(theme.palette.common.white, 0.12)
                : alpha(theme.palette.common.black, 0.12),
              transform: "translateY(-2px)",
            },
            transition: "0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LinkedInIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
        <IconButton
          component="a"
          href="https://github.com/JorgePedraza2019"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            borderRadius: "12px",
            width: isMobile ? 36 : 44,
            height: isMobile ? 36 : 44,
            backgroundColor: theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.05)
              : alpha(theme.palette.common.black, 0.05),
            "&:hover": {
              backgroundColor: theme.palette.mode === "dark"
                ? alpha(theme.palette.common.white, 0.12)
                : alpha(theme.palette.common.black, 0.12),
              transform: "translateY(-2px)",
            },
            transition: "0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GitHubIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Box>
    </>
  );
}