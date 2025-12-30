import React from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function HeroSection({ theme }) {
  const t = useTranslations("skills.hero");
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isMobileLandscape = useMediaQuery(
    "(max-width: 900px) and (orientation: landscape)"
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: isMobileLandscape ? "85vh" : isMobile ? "55vh" : "50vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 5,
        textAlign: "center",
        background:
          theme.palette.mode === "dark"
            ? `radial-gradient(circle at top, ${alpha(
                theme.palette.common.white,
                0.06
              )}, transparent 60%)`
            : `radial-gradient(circle at top, ${alpha(
                theme.palette.common.black,
                0.05
              )}, transparent 60%)`,
      }}
    >
      {/* animated background blobs */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.primary.main, 0.25)
                : alpha(theme.palette.primary.main, 0.18),
            filter: "blur(60px)",
          }}
        />

        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "-25%",
            right: "-15%",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.common.white, 0.12)
                : alpha(theme.palette.common.black, 0.08),
            filter: "blur(70px)",
          }}
        />
      </Box>

      {/* subtle noise / texture layer */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            theme.palette.mode === "dark"
              ? `linear-gradient(${alpha(
                  theme.palette.common.white,
                  0.03
                )}, ${alpha(theme.palette.common.white, 0.03)})`
              : `linear-gradient(${alpha(
                  theme.palette.common.black,
                  0.02
                )}, ${alpha(theme.palette.common.black, 0.02)})`,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 3,
          maxWidth: 1400,
          width: "100%",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ position: "relative" }}
        >
          {/* focus glow behind title */}
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -60%)",
              width: isMobile ? 180 : 360,
              height: isMobile ? 180 : 360,
              borderRadius: "50%",
              background:
                theme.palette.mode === "dark"
                  ? `radial-gradient(circle, ${alpha(
                      theme.palette.primary.main,
                      0.25
                    )}, transparent 70%)`
                  : `radial-gradient(circle, ${alpha(
                      theme.palette.primary.main,
                      0.18
                    )}, transparent 70%)`,
              filter: "blur(80px)",
              zIndex: -1,
            }}
          />
          <Typography
            variant="h2"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: isMobile ? "2rem" : "3rem",
              mb: 2,
              lineHeight: 1.15,
            }}
          >
            {t("title")}
          </Typography>

          {/* micro divider */}
          <Box
            sx={{
              width: isMobile ? 32 : 56,
              height: 2,
              borderRadius: 999,
              mx: "auto",
              mb: 3,
              background:
                theme.palette.mode === "dark"
                  ? `linear-gradient(90deg, transparent, ${alpha(
                      theme.palette.common.white,
                      0.6
                    )}, transparent)`
                  : `linear-gradient(90deg, transparent, ${alpha(
                      theme.palette.common.black,
                      0.4
                    )}, transparent)`,
            }}
          />

          <Typography
            sx={{
              maxWidth: 820,
              mx: "auto",
              opacity: 0.8,
              fontSize: isMobile ? "0.95rem" : "1.1rem",
              lineHeight: 1.7,
              mt: 2,
              px: { xs: 2, sm: 3, md: 4, lg: 0 },
            }}
          >
            {t("description")}
          </Typography>

          {/* context chips */}
          <Stack
            direction="row"
            spacing={isMobile ? 1 : 1.5}
            justifyContent="center"
            sx={{ mt: 4, flexWrap: "wrap" }}
          >
            {t.raw("chips").map((label) => (
              <Chip
                key={label}
                label={label}
                size="small"
                sx={{
                  fontWeight: 600,
                  borderRadius: 999,
                  background:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.06)
                      : alpha(theme.palette.common.black, 0.05),
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.2)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? `0 4px 20px ${alpha(theme.palette.common.white, 0.2)}`
                        : `0 4px 20px ${alpha(
                            theme.palette.common.black,
                            0.2
                          )}`,
                  },
                }}
              />
            ))}
          </Stack>
        </motion.div>
      </Box>
    </Box>
  );
}
