"use client";

import { Box, Typography, IconButton, Link as MUILink } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useTheme, alpha } from "@mui/material/styles";

export default function Footer({ locale }) {
  const t = useTranslations("footer");
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        mt: 0,
        py: { xs: 3, sm: 4, md: 5 },
        px: { xs: 2, sm: 3, md: 0 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 2, sm: 3 },
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      {/* Divider line */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 900,
          height: 1,
          backgroundColor: alpha(theme.palette.common.black, 0.15),
        }}
      />

      {/* Footer navigation */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: { xs: 2, sm: 4 },
          mt: 1,
          mb: 1,
          fontSize: { xs: 12, sm: 14 },
          opacity: 0.9,
        }}
      >
        <MUILink
          component={Link}
          href={`/${locale}`}
          underline="none"
          color="inherit"
          sx={{ "&:hover": { opacity: 0.6 } }}
        >
          {t("home")}
        </MUILink>
        <MUILink
          component={Link}
          href={`/${locale}/about`}
          underline="none"
          color="inherit"
          sx={{ "&:hover": { opacity: 0.6 } }}
        >
          {t("about")}
        </MUILink>
        <MUILink
          component={Link}
          href={`/${locale}/projects`}
          underline="none"
          color="inherit"
          sx={{ "&:hover": { opacity: 0.6 } }}
        >
          {t("projects")}
        </MUILink>
        <MUILink
          component={Link}
          href={`/${locale}/skills`}
          underline="none"
          color="inherit"
          sx={{ "&:hover": { opacity: 0.6 } }}
        >
          {t("skills")}
        </MUILink>
        <MUILink
          component={Link}
          href={`/${locale}/contact`}
          underline="none"
          color="inherit"
          sx={{ "&:hover": { opacity: 0.6 } }}
        >
          {t("contact")}
        </MUILink>
      </Box>

      {/* Social icons */}
      <Box sx={{ display: "flex", gap: { xs: 1.5, sm: 2 } }}>
        <IconButton
          component={MUILink}
          href="https://www.linkedin.com/in/jorge-pedraza-valdez-309878152"
          target="_blank"
          rel="noopener"
          sx={{
            borderRadius: "12px",
            width: { xs: 36, sm: 44 },
            height: { xs: 36, sm: 44 },
            backgroundColor: alpha(theme.palette.common.black, 0.05),
            "&:hover": {
              backgroundColor: alpha(theme.palette.common.black, 0.12),
              transform: "translateY(-2px)",
            },
            transition: "0.2s ease",
          }}
        >
          <LinkedInIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>

        <IconButton
          component={MUILink}
          href="https://github.com/JorgePedraza2019"
          target="_blank"
          rel="noopener"
          sx={{
            borderRadius: "12px",
            width: { xs: 36, sm: 44 },
            height: { xs: 36, sm: 44 },
            backgroundColor: alpha(theme.palette.common.black, 0.05),
            "&:hover": {
              backgroundColor: alpha(theme.palette.common.black, 0.12),
              transform: "translateY(-2px)",
            },
            transition: "0.2s ease",
          }}
        >
          <GitHubIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>
      </Box>

      {/* Copyright */}
      <Typography sx={{ fontSize: { xs: 11, sm: 13 }, opacity: 0.7 }}>
        © {new Date().getFullYear()} Jorge — {t("rights")}
      </Typography>
    </Box>
  );
}
