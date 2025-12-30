// src/components/Navbar.js
"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ThemeToggleIcon from "./Theme/ThemeToggleIcon";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import LanguageSelector from "./Language/LanguageSelector";
import { useState, useEffect } from "react";
import AIIconButton from "./AIIconButton";

export default function Navbar({ locale }) {
  const t = useTranslations("navbar");
  const theme = useTheme();
  const darkMode = useSelector((state) => state.theme.darkMode);

  const borderColor = darkMode
    ? alpha(theme.palette.common.white, 0.05)
    : alpha(theme.palette.common.black, 0.05);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const menuItems = ["home", "about", "projects", "skills", "contact"];

  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const isHorizontalMobile = window.innerWidth < 900 && window.innerHeight < window.innerWidth;

      if (!isHorizontalMobile) {
        setShowNavbar(true);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY <= 0) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      } else if (currentScrollY < lastScrollY) {
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenAIBar = () => {
    window.dispatchEvent(new Event("open-ai-bar"));
  };

  const [clickedItems, setClickedItems] = useState({});

  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backdropFilter: "blur(14px)",
          backgroundColor: alpha(theme.palette.background.default, 0.45),
          backgroundImage: `linear-gradient(
            to bottom,
            ${alpha(theme.palette.background.default, 0.6)},
            ${alpha(theme.palette.background.default, 0.25)}
          )`,
          borderBottom: "1px solid",
          borderColor: borderColor,
          height: 62,
          display: "flex",
          justifyContent: "center",
          transition:
            "background-color 0.8s ease-in-out, border-color 0.8s ease-in-out, transform 0.3s ease",
          transform: showNavbar ? "translateY(0)" : "translateY(-100%)",
        }}
      >
        <Toolbar sx={{ width: "100%", maxWidth: 1350, mx: "auto" }}>
          <Link
            href={`/${locale}`}
            style={{ textDecoration: "none" }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.5px",
                color: "primary.main",
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.85,
                },
              }}
            >
              {t("projectName")}
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {menuItems.map((key) => (
              <Button
                key={key}
                component={Link}
                href={`/${locale}/${key === "home" ? "" : key}`}
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  textTransform: "none",
                  fontWeight: 500,
                  px: 2.2,
                  fontSize: "0.95rem",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    borderRadius: "8px",
                    transition: "all 0.25s ease",
                  },
                })}
              >
                {t(key)}
              </Button>
            ))}
            <ThemeToggleIcon />
            <LanguageSelector locale={locale} />
            <AIIconButton onClick={handleOpenAIBar} />
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
            {/* <AIIconButton /> */}
            <IconButton
              onClick={toggleDrawer(true)}
              sx={{ color: theme.palette.text.primary }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 280,
            backdropFilter: "blur(22px)",
            backgroundColor: alpha(theme.palette.background.default, 0.35),
            backgroundImage: `linear-gradient(
              145deg,
              ${alpha(theme.palette.background.default, 0.55)},
              ${alpha(theme.palette.background.default, 0.25)}
            )`,
            borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: (theme) =>
              darkMode
                ? `0 20px 50px ${alpha(theme.palette.common.black, 0.35)}`
                : `0 20px 50px ${alpha(theme.palette.common.black, 0.08)}`,
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ height: 16 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {menuItems.map((key, index) => {
              const isClicked = clickedItems[key] || false;

              const handleClick = async () => {
                setClickedItems(prev => ({ ...prev, [key]: true }));
                await new Promise((resolve) => setTimeout(resolve, 300));
                setClickedItems(prev => ({ ...prev, [key]: false }));
                toggleDrawer(false)();
              };

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isClicked ? { scale: [1, 1.15, 1] } : drawerOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 1 }}
                  transition={isClicked ? { duration: 0.3 } : { delay: drawerOpen ? index * 0.1 : 0, duration: 0.3 }}
                  style={{ transformOrigin: "center" }}
                >
                  <Button
                    component={Link}
                    href={`/${locale}/${key === "home" ? "" : key}`}
                    onClick={handleClick}
                    fullWidth
                    sx={(theme) => ({
                      justifyContent: "flex-start",
                      px: 3,
                      py: 1.8,
                      fontSize: "1.05rem",
                      fontWeight: 500,
                      textTransform: "none",
                      color: theme.palette.text.primary,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.action.hover, 0.15),
                      },
                    })}
                  >
                    {t(key)}
                  </Button>
                </motion.div>
              );
            })}
          </Box>

          <Box
            sx={{
              mt: "auto",
              px: 3,
              py: 2,
              display: "flex",
              gap: 2,
              alignItems: "center",
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={drawerOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: drawerOpen ? menuItems.length * 0.1 + 0.1 : 0, duration: 0.3 }}
            >
              <ThemeToggleIcon />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={drawerOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: drawerOpen ? menuItems.length * 0.1 + 0.2 : 0, duration: 0.3 }}
            >
              <LanguageSelector locale={locale} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={drawerOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: drawerOpen ? menuItems.length * 0.1 + 0.2 : 0, duration: 0.3 }}
            >
              <AIIconButton
                onClick={() => {
                  toggleDrawer(false)();
                  handleOpenAIBar();
                }}
              />
            </motion.div>
          </Box>
        </Box>
      </Drawer>
    </motion.div>
  );
}