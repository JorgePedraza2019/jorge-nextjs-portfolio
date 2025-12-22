"use client";

import { Box, Typography, Button } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSelector } from "react-redux";

/**
 * HeroSection component displays the introductory hero area of the page.
 * It includes a heading, subtitle, description, call-to-action button,
 * and a video embed with scroll-based animation effects.
 *
 * @param {Object} props
 * @param {string} props.locale - Current locale for routing and translations
 * @returns {JSX.Element}
 */
export default function AboutContent({ locale }) {
  const t = useTranslations("about");

  const { darkMode } = useSelector((state) => state.theme);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1400,
          mx: "auto",
          mt: { xs: 8, md: 14 },
          px: { xs: 2, md: 3 },
          gap: 3,
        }}
      >
        {/* Text */}
        <Box
          sx={{
            flex: 1,
            flexBasis: { md: "50%", lg: "44%" },
            maxWidth: { md: "50%", lg: "44%" },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "3rem" },
                lineHeight: 1.2,
                mb: 2,
                mt: { xs: 4, md: 0 },
                textAlign: "justify",
              }}
            >
              {t("title")}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            {t("description")
              .split("\n\n")
              .map((p, i) => (
                <Typography
                  key={i}
                  variant="body1"
                  sx={{
                    fontSize: { xs: "1rem", md: "1.15rem" },
                    maxWidth: { xs: "100%", md: 550 },
                    opacity: 0.85,
                    mb: 3,
                    textAlign: "justify",
                    lineHeight: 1.7,
                  }}
                >
                  {p}
                </Typography>
              ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ delay: 0.05, duration: 0.45 }}
          >
            <Button
              download
              component={Link}
              href="/resume/Jorge-Pedraza-Software-Developer-2025.pdf"
              variant="contained"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.8,
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: (theme) =>
                  `0px 4px 12px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}, 0px 1px 5px ${alpha(theme.palette.primary.main, 0.15)}`,
                textTransform: "none",
                "&:hover": {
                  background: (theme) => theme.palette.primary.dark,
                  transform: "translateY(-2px)",
                  boxShadow: (theme) =>
                    `0px 6px 16px ${alpha(
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
        {/* Video */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            flexBasis: { md: "50%", lg: "51%" },
            maxWidth: { md: "50%", lg: "51%" },
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            <Box
              sx={{
                flex: { xs: 1, md: 1.6 },
                width: "100%",
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: (theme) =>
                  `0px 8px 30px ${alpha(theme.palette.common.black, 0.15)}`,
                position: "relative",
                aspectRatio: { md: "9 / 16" },
                height: { md: 400, lg: "800px" },
              }}
            >
              <video
                src="/videos/about/light/hero.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  opacity: darkMode ? 0 : 1,
                  transition: "opacity 0.5s ease",
                }}
              />
              <video
                src="/videos/about/dark/hero.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  opacity: darkMode ? 1 : 0,
                  transition: "opacity 0.5s ease",
                }}
              />
            </Box>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
}
