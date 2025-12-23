"use client";

import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { useTranslations } from "next-intl";

function TabPanel({ children, value, index }) {
  return value === index && <Box sx={{ mt: 2, width: "100%" }}>{children}</Box>;
}

export default function TabsSection() {
  const [tab, setTab] = useState(0);
  const { scrollYProgress } = useScroll();
  const tabsRef = useRef(null);

  // Animación de entrada de la sección según scroll
  const fadeOpacity = useTransform(scrollYProgress, [0.35, 0.6], [0, 1]);
  const fadeY = useTransform(scrollYProgress, [0.35, 0.6], [30, 0]);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const t = useTranslations("home.tabsSection");
  const tabs = t.raw("tabs");

  return (
    <Box
      component={motion.section}
      ref={tabsRef}
      style={{ opacity: fadeOpacity, y: fadeY }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto", mt: 5, px: 3, py: 0 }}>
        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            mb: 6,
            "& .MuiTabs-flexContainer": {
              justifyContent: "center",
            },
          }}
          TabIndicatorProps={{
            style: { borderRadius: 3 },
          }}
        >
          {tabs.map((t, index) => (
            <Tab key={index} label={t.title} disableRipple />
          ))}
        </Tabs>

        {/* Tab Content */}
        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexWrap: { xs: "wrap", md: "nowrap" },
            justifyContent: "center",
          }}
        >
          {tabs.map((t, index) => (
            <TabPanel key={index} value={tab} index={index}>
              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                {/* Card a la izquierda */}
                <Box
                  component={motion.div}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  sx={{ flex: 1 }}
                >
                  <Paper
                    elevation={3}
                    sx={(theme) => ({
                      px: { xs: 3, md: 6 },
                      py: { xs: 4, md: 6 },
                      borderRadius: 3,
                      textAlign: { xs: "left", md: "center" },
                      minWidth: 280,
                      maxWidth: 500,
                      mx: "auto",
                      cursor: "default",
                      background:
                        theme.palette.mode === "dark"
                          ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(
                              theme.palette.background.paper,
                              0.9
                            )})`
                          : `linear-gradient(145deg, ${alpha(theme.palette.common.white, 1)}, ${alpha(
                              theme.palette.common.white,
                              0.95
                            )})`,
                      border:
                        theme.palette.mode === "dark"
                          ? `1px solid ${alpha(theme.palette.common.white, 0.06)}`
                          : `1px solid ${alpha(theme.palette.common.black, 0.06)}`,
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? `0 20px 50px ${alpha(theme.palette.common.black, 0.45)}`
                          : `0 20px 40px ${alpha(theme.palette.common.black, 0.15)}`,
                      "&:hover": { transform: "scale(1.05)", transition: "0.3s ease" },
                    })}
                  >
                    <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                      {t.title}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ opacity: 0.8, mb: 2 }}
                    >
                      {t.subtitle}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ opacity: 0.75, mb: 3, textAlign: "justify" }}
                    >
                      {t.description}
                    </Typography>
                    <Box
                      component="ul"
                      sx={{ m: 0, pl: 3, textAlign: "justify" }}
                    >
                      {t.extra.map((line, i) => (
                        <Box
                          component={motion.li}
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.1 * i,
                            duration: 0.35,
                            ease: "easeOut",
                          }}
                          sx={{
                            marginBottom: "8px",
                            fontSize: "0.9rem",
                            opacity: 0.85,
                            listStyle: "disc",
                          }}
                        >
                          {line}
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Box>

                {/* Imagen a la derecha */}
                <Box
                  component={motion.div}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  sx={(theme) => ({
                    flex: 1,
                    borderRadius: 3,
                    overflow: "hidden",
                    aspectRatio: "16 / 9",
                    minHeight: { xs: 200, sm: 260, md: 360 },
                    background:
                      theme.palette.mode === "dark"
                        ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(
                            theme.palette.background.paper,
                            0.9
                          )})`
                        : `linear-gradient(145deg, ${alpha(theme.palette.common.white, 1)}, ${alpha(
                            theme.palette.common.white,
                            0.95
                          )})`,
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? `0 20px 50px ${alpha(theme.palette.common.black, 0.45)}`
                        : `0 20px 40px ${alpha(theme.palette.common.black, 0.15)}`,
                  })}
                >
                  <Box
                    component={motion.img}
                    key={tab}
                    src={t.img}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center center",
                    }}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  />
                </Box>
              </Box>
            </TabPanel>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
