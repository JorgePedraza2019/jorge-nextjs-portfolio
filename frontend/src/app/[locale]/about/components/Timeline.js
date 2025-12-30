"use client";

import { Box, Typography, IconButton, Collapse } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

const timelineData = [
  {
    year: 2020,
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=720",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=720",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=720",
    ],
  },
  {
    year: 2021,
    image: [
      "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=720",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=720",
      "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=720",
    ],
  },
  {
    year: 2022,
    image: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=720",
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=720",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=720",
    ],
  },
  {
    year: 2023,
    image: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=720",
      "https://images.unsplash.com/photo-1522199710521-72d69614c702?w=720",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=720",
    ],
  },
  {
    year: 2024,
    images: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=720",
      "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=720",
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=720",
    ],
  },
  {
    year: 2025,
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=720",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=720",
      "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=720",
    ],
  },
  {
    year: 2026,
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=720",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=720",
      "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=720",
    ],
  },
];

export default function Timeline() {
  const baselineDuration = 0.6; // seconds
  const theme = useTheme();
  const t = useTranslations("about");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [activeYear, setActiveYear] = useState(2025);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const intervalRef = useRef(null);
  const [carouselDelay, setCarouselDelay] = useState(5000); // ms, default 5s
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  // Animation state for lightbox exit
  const [lightboxVisible, setLightboxVisible] = useState(false);

  // Timeline animation state
  const [timelineVisible, setTimelineVisible] = useState(false);

  // Track if this is the first load for slower content animation
  const firstLoadRef = useRef(true);

  useEffect(() => {
    setTimelineVisible(true);
    // After initial mount, flip firstLoadRef to false for subsequent animations
    firstLoadRef.current = false;
  }, []);

  const yearData = timelineData.map((item) => {
    const yearKey = `timeline.${item.year}`;

    return {
      ...item,
      title: t(`${yearKey}.title`),
      points: [
        {
          brief: t(`${yearKey}.point1Brief`),
          detail: t(`${yearKey}.point1Detail`),
          image: item.images?.[0] || item.image?.[0] || null,
        },
        {
          brief: t(`${yearKey}.point2Brief`),
          detail: t(`${yearKey}.point2Detail`),
          image: item.images?.[1] || item.image?.[1] || null,
        },
        {
          brief: t(`${yearKey}.point3Brief`),
          detail: t(`${yearKey}.point3Detail`),
          image: item.images?.[2] || item.image?.[2] || null,
        },
      ],
    };
  });

  // const yearData = timelineData.find((item) => item.year === activeYear);
  const activeYearIndex = timelineData.findIndex(
    (item) => item.year === activeYear
  );
  const currentYearData = yearData[activeYearIndex];

  // Auto carousel effect if no achievement expanded
  useEffect(() => {
    if (expandedIndex === null) {
      intervalRef.current = setInterval(() => {
        setCarouselIndex((prev) => {
          const nextIndex = (prev + 1) % currentYearData.points.length;
          return nextIndex;
        });
      }, carouselDelay);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [expandedIndex, currentYearData, carouselDelay]);

  // When carouselDelay changes (after arrow click), reset to 5s after 10s
  useEffect(() => {
    if (carouselDelay !== 5000) {
      const timeout = setTimeout(() => setCarouselDelay(5000), 10000);
      return () => clearTimeout(timeout);
    }
  }, [carouselDelay]);

  // Sync carouselIndex with expandedIndex if expanded
  useEffect(() => {
    if (expandedIndex !== null) {
      setCarouselIndex(expandedIndex);
    }
  }, [expandedIndex]);

  // If year changes, reset expanded and carousel index
  useEffect(() => {
    setExpandedIndex(null);
    setCarouselIndex(0);
  }, [activeYear]);

  // Lightbox open/close animation state
  useEffect(() => {
    if (lightboxOpen) setLightboxVisible(true);
  }, [lightboxOpen]);

  // Lightbox close on background click or ESC
  useEffect(() => {
    if (!lightboxVisible) return;
    function onKey(e) {
      if (e.key === "Escape") handleLightboxClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line
  }, [lightboxVisible]);

  // Function to close lightbox with animation
  function handleLightboxClose() {
    setLightboxOpen(false); // triggers exit animation
    // After animation, unmount
    setTimeout(() => setLightboxVisible(false), 320); // match exit duration
  }
  const displayTimelineData = isMobile
    ? [...timelineData].reverse()
    : timelineData;

  return (
    <Box
      sx={{
        mt: { xs: 6, md: 12, lg: 12 },
        position: "relative",
        maxWidth: 1400,
        mx: "auto",
      }}
    >
      {/* ----- BASE LINE + CIRCLES/YEARs: Responsive ----- */}
      {/* For xs: vertical timeline; for md+: horizontal as before */}
      {/* Timeline Line */}
      <Box
        sx={{
          display: { xs: "flex", md: "block" },
          flexDirection: { xs: "row", md: "column" },
          alignItems: { xs: "flex-start", md: "stretch" },
          position: "relative",
          width: "100%",
        }}
      >
        {/* --- Timeline line + circles: xs column --- */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            width: 64,
            flexShrink: 0,
          }}
        >
          {/* Vertical line for xs */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0, scaleY: 0 }}
            animate={
              timelineVisible ? { opacity: 1, scaleX: 1, scaleY: 1 } : {}
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              transformOrigin: "left",
            }}
          >
            <Box
              sx={{
                display: { xs: "block", md: "none" },
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                // Ajusta el inicio justo debajo del primer año
                top: 50,
                // Ajusta el final justo arriba del último icono de flecha
                bottom: 28,
                width: "4px",
                height: `calc(100% - 68px)`,
                background: (theme) =>
                  `linear-gradient(180deg,${theme.palette.primary.main}AA,${theme.palette.primary.main}33)`,
                borderRadius: 2,
                zIndex: 0,
                mx: "auto",
              }}
            />
          </motion.div>
          {/* Circles/years: vertical stack xs */}
          <Box
            sx={{
              display: { xs: "flex", md: "flex" },
              flexDirection: { xs: "column", sm: "column", md: "row" },
              justifyContent: { xs: "flex-start", md: "space-between" },
              alignItems: { xs: "center", md: "center" },
              pl: { xs: 0, md: 0 },
              maxWidth: 1400,
              mx: "auto",
              zIndex: 2,
              px: { xs: 1, md: 2 },
              pt: { xs: 2, md: 0 },
              pb: { xs: 1, md: 0 },
              minHeight: { xs: 340, md: 0 },
              position: "relative",
              width: "100%",
            }}
          >
            {displayTimelineData.map((item, idx) => {
              const isActive = item.year === activeYear;
              // Compute margin style for centering circles on xs
              const circleMarginStyle =
                window?.innerWidth < 900
                  ? { marginLeft: "auto", marginRight: "auto" }
                  : {};
              if (item.year === timelineData[timelineData.length - 1].year) {
                // Last year - play icon
                return (
                  <motion.div
                    key={item.year}
                    onClick={() => setActiveYear(item.year)}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={timelineVisible ? { opacity: 1, scale: 1 } : {}}
                    whileHover={{
                      scale: 1.12,
                      transition: { duration: 0.15, ease: "easeOut" },
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: baselineDuration + idx * 0.15,
                    }}
                    style={{
                      alignItems: "flex-start",
                      textAlign: "left",
                      cursor: "pointer",
                      zIndex: 2,
                      marginBottom:
                        window?.innerWidth < 900 &&
                        idx !== timelineData.length - 1
                          ? 32
                          : 0,
                    }}
                  >
                    <Typography
                      sx={{
                        mb: { xs: 0.5, md: 1 },
                        mt: 0,
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        fontWeight: 700,
                        color: isActive ? "primary.main" : "text.secondary",
                        textAlign: "left",
                        // ml: { xs: "12px", md: 0 },
                        ...(window?.innerWidth < 900
                          ? {
                              marginLeft: "auto",
                              marginRight: "auto",
                              textAlign: "center",
                            }
                          : {}),
                      }}
                    >
                      {item.year}
                    </Typography>
                    {isActive ? (
                      <motion.div
                        animate={{
                          scale: [1, 1.18, 1],
                          filter: [
                            `drop-shadow(0 0 0px ${alpha(
                              theme.palette.primary.main,
                              0
                            )})`,
                            `drop-shadow(0 0 16px ${alpha(
                              theme.palette.primary.main,
                              0.9
                            )})`,
                            `drop-shadow(0 0 0px ${alpha(
                              theme.palette.primary.main,
                              0
                            )})`,
                          ],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{
                          width: window?.innerWidth < 900 ? 26 : 32,
                          height: window?.innerWidth < 900 ? 26 : 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          ...circleMarginStyle,
                          zIndex: 5,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faPlay}
                          style={{
                            fontSize:
                              window?.innerWidth < 900 ? "20px" : "28px",
                            color: theme.palette.primary.main,
                            transform: isMobile
                              ? "rotate(270deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        animate={{ scale: 1 }}
                        transition={{ duration: 0 }}
                        style={{
                          width: window?.innerWidth < 900 ? 18 : 22,
                          height: window?.innerWidth < 900 ? 18 : 22,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          ...circleMarginStyle,
                          zIndex: 5,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faPlay}
                          style={{
                            fontSize:
                              window?.innerWidth < 900 ? "20px" : "28px",
                            color: theme.palette.primary.main,
                            transform: isMobile
                              ? "rotate(270deg)"
                              : "rotate(0deg)",
                            opacity: 1.6,
                          }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                );
              }
              // All other years - circle
              return (
                <motion.div
                  key={item.year}
                  onClick={() => setActiveYear(item.year)}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={timelineVisible ? { opacity: 1, scale: 1 } : {}}
                  whileHover={{
                    scale: 1.12,
                    transition: { duration: 0.15, ease: "easeOut" },
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: baselineDuration + idx * 0.15,
                  }}
                  style={{
                    alignItems: "flex-start",
                    textAlign: "left",
                    cursor: "pointer",
                    zIndex: 2,
                    marginBottom:
                      window?.innerWidth < 900 &&
                      idx !== timelineData.length - 1
                        ? 32
                        : 0,
                  }}
                >
                  <Typography
                    sx={{
                      mb: { xs: 0.5, md: 1 },
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      fontWeight: 700,
                      color:
                        item.year === activeYear
                          ? "primary.main"
                          : "text.secondary",
                      textAlign: "left",
                      // ml: { xs: "12px", md: 0 },
                      ...(window?.innerWidth < 900
                        ? {
                            marginLeft: "auto",
                            marginRight: "auto",
                            textAlign: "center",
                          }
                        : {}),
                    }}
                  >
                    {item.year}
                  </Typography>
                  <Box
                    sx={{
                      width: isActive
                        ? window?.innerWidth < 900
                          ? 26
                          : 32
                        : window?.innerWidth < 900
                        ? 18
                        : 22,
                      height: isActive
                        ? window?.innerWidth < 900
                          ? 26
                          : 32
                        : window?.innerWidth < 900
                        ? 18
                        : 22,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.primary.main,
                      border: `4px solid ${theme.palette.primary.main}`,
                      ...circleMarginStyle,
                      zIndex: 2,
                      position: "relative",
                    }}
                    component={motion.div}
                    animate={
                      isActive
                        ? {
                            scale: [1, 1.18, 1],
                            boxShadow: [
                              `0 0 0px ${theme.palette.primary.main}40`,
                              `0 0 22px ${theme.palette.primary.main}CC`,
                              `0 0 0px ${theme.palette.primary.main}40`,
                            ],
                          }
                        : {
                            scale: 1,
                            boxShadow: `0 0 0px ${theme.palette.primary.main}40`,
                          }
                    }
                    transition={{
                      duration: 2.2,
                      repeat: isActive ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              );
            })}
          </Box>
        </Box>
        {/* --- Desktop timeline (md+) --- */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0, scaleY: 0 }}
          animate={timelineVisible ? { opacity: 1, scaleX: 1, scaleY: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            transformOrigin: "left",
          }}
        >
          {/* Main line for md+ */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: 49,
              left: 25,
              right: 41,
              height: "4px",
              background: (theme) =>
                `linear-gradient(90deg,${theme.palette.primary.main}33,${theme.palette.primary.main}AA)`,
              borderRadius: 2,
              zIndex: 0,
              maxWidth: 1400,
              mx: "auto",
              width: "auto",
            }}
          />
        </motion.div>
        {/* Progress line */}
        <motion.div
          initial={{ width: 0, height: 0 }}
          animate={
            window?.innerWidth >= 900
              ? {
                  width: `calc(${
                    (activeYearIndex / (timelineData.length - 1)) * 100
                  }% - ${
                    (1 - activeYearIndex / (timelineData.length - 1)) * 16
                  }px)`,
                  height: "4px",
                }
              : {
                  height: `calc(${
                    (activeYearIndex / (timelineData.length - 1)) * 100
                  }% - ${
                    (1 - activeYearIndex / (timelineData.length - 1)) * 16
                  }px)`,
                  width: "4px",
                }
          }
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: window?.innerWidth >= 900 ? 49 : 68,
            left: window?.innerWidth >= 900 ? 0 : "50%",
            ...(window?.innerWidth < 900
              ? { transform: "translateX(-50%)" }
              : {}),
            right: window?.innerWidth >= 900 ? 41 : "unset",
            background:
              window?.innerWidth >= 900
                ? "var(--mui-palette-primary-main)"
                : "var(--mui-palette-primary-main)",
            borderRadius: 2,
            zIndex: 1,
            maxWidth: 1400,
            margin: "auto",
          }}
        />
        {/* Circles/years: horizontal row md+ */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: { xs: "column", sm: "column", md: "row" },
            justifyContent: { xs: "flex-start", md: "space-between" },
            alignItems: { xs: "center", md: "center" },
            pl: { xs: 0, md: 0 },
            maxWidth: 1400,
            mx: "auto",
            zIndex: 2,
            px: { xs: 1, md: 2 },
            pt: { xs: 2, md: 0 },
            pb: { xs: 1, md: 0 },
            minHeight: { xs: 340, md: 0 },
            position: "relative",
          }}
        >
          {displayTimelineData.map((item, idx) => {
            const isActive = item.year === activeYear;
            if (item.year === timelineData[timelineData.length - 1].year) {
              // Last year - play icon
              return (
                <motion.div
                  key={item.year}
                  onClick={() => setActiveYear(item.year)}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={timelineVisible ? { opacity: 1, scale: 1 } : {}}
                  whileHover={{
                    scale: 1.12,
                    transition: { duration: 0.15, ease: "easeOut" },
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: baselineDuration + idx * 0.15,
                  }}
                  style={{
                    alignItems: "flex-start",
                    textAlign: "left",
                    cursor: "pointer",
                    zIndex: 2,
                    marginBottom:
                      window?.innerWidth < 900 &&
                      idx !== timelineData.length - 1
                        ? 32
                        : 0,
                  }}
                >
                  <Typography
                    sx={{
                      mb: { xs: 0.5, md: 1 },
                      mt: 0,
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      fontWeight: 700,
                      color: isActive ? "primary.main" : "text.secondary",
                      textAlign: "left",
                      ml: { xs: "12px", md: 0 },
                    }}
                  >
                    {item.year}
                  </Typography>
                  {isActive ? (
                    <motion.div
                      animate={{
                        scale: [1, 1.18, 1],
                        filter: [
                          `drop-shadow(0 0 0px ${alpha(
                            theme.palette.primary.main,
                            0
                          )})`,
                          `drop-shadow(0 0 16px ${alpha(
                            theme.palette.primary.main,
                            0.9
                          )})`,
                          `drop-shadow(0 0 0px ${alpha(
                            theme.palette.primary.main,
                            0
                          )})`,
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{
                        width: window?.innerWidth < 900 ? 26 : 32,
                        height: window?.innerWidth < 900 ? 26 : 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: { xs: "0px", md: "auto" },
                        marginRight: { xs: "0px", md: "auto" },
                        zIndex: 5,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPlay}
                        style={{
                          fontSize: window?.innerWidth < 900 ? "20px" : "28px",
                          color: theme.palette.primary.main,
                        }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ scale: 1 }}
                      transition={{ duration: 0 }}
                      style={{
                        width: window?.innerWidth < 900 ? 18 : 22,
                        height: window?.innerWidth < 900 ? 18 : 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: { xs: "0px", md: "auto" },
                        marginRight: { xs: "0px", md: "auto" },
                        zIndex: 5,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPlay}
                        style={{
                          fontSize: window?.innerWidth < 900 ? "20px" : "28px",
                          color: theme.palette.primary.main,
                          opacity: 1.6,
                        }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              );
            }
            // All other years - circle
            return (
              <motion.div
                key={item.year}
                onClick={() => setActiveYear(item.year)}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={timelineVisible ? { opacity: 1, scale: 1 } : {}}
                whileHover={{
                  scale: 1.12,
                  transition: { duration: 0.15, ease: "easeOut" },
                }}
                whileTap={{ scale: 0.9 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: baselineDuration + idx * 0.15,
                }}
                style={{
                  alignItems: "flex-start",
                  textAlign: "left",
                  cursor: "pointer",
                  zIndex: 2,
                  marginBottom:
                    window?.innerWidth < 900 && idx !== timelineData.length - 1
                      ? 32
                      : 0,
                }}
              >
                <Typography
                  sx={{
                    mb: { xs: 0.5, md: 1 },
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    fontWeight: 700,
                    color:
                      item.year === activeYear
                        ? "primary.main"
                        : "text.secondary",
                    textAlign: "left",
                    ml: { xs: "12px", md: 0 },
                  }}
                >
                  {item.year}
                </Typography>
                <Box
                  sx={{
                    width: isActive
                      ? window?.innerWidth < 900
                        ? 26
                        : 32
                      : window?.innerWidth < 900
                      ? 18
                      : 22,
                    height: isActive
                      ? window?.innerWidth < 900
                        ? 26
                        : 32
                      : window?.innerWidth < 900
                      ? 18
                      : 22,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.primary.main,
                    border: `4px solid ${theme.palette.primary.main}`,
                    marginLeft: { xs: "0px", md: "auto" },
                    marginRight: { xs: "0px", md: "auto" },
                    zIndex: 2,
                    position: "relative",
                  }}
                  component={motion.div}
                  animate={
                    isActive
                      ? {
                          scale: [1, 1.18, 1],
                          boxShadow: [
                            `0 0 0px ${theme.palette.primary.main}40`,
                            `0 0 22px ${theme.palette.primary.main}CC`,
                            `0 0 0px ${theme.palette.primary.main}40`,
                          ],
                        }
                      : {
                          scale: 1,
                          boxShadow: `0 0 0px ${theme.palette.primary.main}40`,
                        }
                  }
                  transition={{
                    duration: 2.2,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            );
          })}
        </Box>
        <Box
          sx={{
            maxWidth: 1400,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            marginTop: { xs: 3, md: 8 },
            alignItems: "flex-start",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            width: "100%",
            minHeight: { md: 480 },
          }}
        >
          {/* LEFT SIDE */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 50%" },
              minWidth: 0,
              pr: { md: 3 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeYear}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -32 }}
                transition={{
                  duration: firstLoadRef.current ? 1.0 : 0.5,
                  ease: "easeInOut",
                  delay: firstLoadRef.current ? baselineDuration + 1 : 0,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: { xs: 1, md: 2 },
                    fontSize: { xs: "1.4rem", md: "2.1rem" },
                    textAlign: "center", // <- centrado
                  }}
                >
                  {activeYear}
                </Typography>
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeYear + "-title"}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{
                  duration: firstLoadRef.current ? 1.0 : 0.5,
                  ease: "easeInOut",
                  delay: firstLoadRef.current ? baselineDuration + 1.2 : 0,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "1.04rem", md: "1.15rem" },
                    textAlign: "center", // <- centrado
                    marginBottom: { xs: 2, md: 3 },
                    opacity: 0.85,
                    minHeight: { xs: 30, md: 60 },
                  }}
                >
                  {currentYearData.title}
                </Typography>
              </motion.div>
            </AnimatePresence>
            {/* List of achievements with toggle and animated effects */}
            <Box sx={{ width: "100%", px: { xs: 3, sm: 5, md: 6 } }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeYear + "-bullets"}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{
                    duration: firstLoadRef.current ? 1.0 : 0.5,
                    ease: "easeInOut",
                    delay: firstLoadRef.current ? baselineDuration + 1.3 : 0,
                  }}
                >
                  {currentYearData.points.map((point, idx) => {
                    const isExpanded = expandedIndex === idx;
                    return (
                      <motion.div
                        key={idx}
                        layout
                        initial={false}
                        whileHover={{
                          scale: isExpanded ? 1.0 : 1.025,
                          boxShadow: isExpanded
                            ? `0 0 16px ${theme.palette.primary.main}44`
                            : `0 2px 16px ${theme.palette.primary.main}22`,
                        }}
                        animate={{
                          scale: isExpanded ? 1.04 : 1,
                          boxShadow: isExpanded
                            ? `0 0 24px 4px ${alpha(
                                theme.palette.primary.main,
                                0.2
                              )}`
                            : "none",
                          backgroundColor: isExpanded
                            ? `${theme.palette.primary.main}22`
                            : "transparent",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 24,
                        }}
                        style={{
                          marginBottom: 12,
                          borderRadius: 10,
                          padding: isExpanded
                            ? window?.innerWidth < 900
                              ? 18
                              : 28
                            : window?.innerWidth < 900
                            ? 10
                            : 16,
                          cursor: "pointer",
                          userSelect: "none",
                          outline: isExpanded
                            ? `2px solid ${theme.palette.primary.main}`
                            : "none",
                          position: "relative",
                        }}
                        onClick={() =>
                          setExpandedIndex(isExpanded ? null : idx)
                        }
                        aria-expanded={isExpanded}
                        aria-controls={`achievement-detail-${idx}`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setExpandedIndex(isExpanded ? null : idx);
                          }
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* Bullet point */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            <Box
                              sx={{
                                width: window?.innerWidth < 900 ? 8 : 10,
                                height: window?.innerWidth < 900 ? 8 : 10,
                                borderRadius: "50%",
                                backgroundColor: isExpanded
                                  ? theme.palette.primary.main
                                  : `${theme.palette.primary.main}80`,
                                marginRight: window?.innerWidth < 900 ? 1 : 2,
                                flexShrink: 0,
                                transition: "background-color 0.2s",
                                boxShadow: isExpanded
                                  ? `0 0 0 2px ${theme.palette.primary.main}33`
                                  : "none",
                              }}
                            />
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                fontSize: { xs: "1rem", md: "1.1rem" },
                                whiteSpace: "pre-line",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {point.brief}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            aria-label={
                              isExpanded ? "Hide details" : "Show details"
                            }
                            edge="end"
                            tabIndex={-1}
                            sx={{
                              width: window?.innerWidth < 900 ? 28 : 36,
                              height: window?.innerWidth < 900 ? 28 : 36,
                              minWidth: window?.innerWidth < 900 ? 28 : 36,
                              minHeight: window?.innerWidth < 900 ? 28 : 36,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 2,
                            }}
                          >
                            <FontAwesomeIcon
                              icon={isExpanded ? faChevronUp : faChevronDown}
                            />
                          </IconButton>
                        </Box>
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              key="details"
                              initial={{
                                maxHeight: 0,
                                opacity: 0,
                                marginTop: 0,
                                background: `${theme.palette.primary.main}00`,
                              }}
                              animate={{
                                maxHeight: 400,
                                opacity: 1,
                                marginTop: window?.innerWidth < 900 ? 12 : 20,
                                background: `${theme.palette.primary.main}0A`,
                                overflow: "hidden",
                              }}
                              exit={{
                                opacity: 0,
                                height: 0,
                                marginTop: 0,
                                transition: {
                                  maxHeight: {
                                    duration: 0.32,
                                    ease: "easeInOut",
                                  },
                                  opacity: {
                                    duration: 0.22,
                                    ease: "easeOut",
                                  },
                                },
                              }}
                              transition={{
                                duration: 0.4,
                                ease: "easeInOut",
                              }}
                              style={{
                                overflow: "hidden",
                                borderRadius: 8,
                                padding: isExpanded
                                  ? window?.innerWidth < 900
                                    ? "12px 8px 8px 8px"
                                    : "20px 14px 10px 14px"
                                  : "0px",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: { xs: "0.97rem", md: "1rem" },
                                  color: "text.secondary",
                                  textAlign: "justify",
                                }}
                                id={`achievement-detail-${idx}`}
                              >
                                {point.detail}
                              </Typography>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </Box>
          </Box>
          {/* RIGHT SIDE */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 50%" }, // ocupa todo en móvil, mitad en desktop
              minWidth: 0,
              maxWidth: { xs: 300, sm: 360, md: "50%" }, // limita ancho en xs y sm
              mx: { xs: "auto", md: 0 }, // centra horizontalmente en xs, sin afectar md+
              mr: { md: 3 },
              mt: { xs: 3, md: 0 },
              position: "relative",
              height: { xs: 180, sm: 260, md: 450 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: { xs: 2, md: 4 },
              boxShadow: `0px 8px 30px ${alpha(
                theme.palette.common.black,
                0.15
              )}`,
              backgroundColor: "transparent",
              minHeight: 0,
            }}
          >
            <motion.div
              key={activeYear + "-image"}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -32 }}
              transition={{
                duration: firstLoadRef.current ? 1.0 : 0.55,
                ease: "easeOut",
                delay: firstLoadRef.current ? baselineDuration + 1.4 : 0,
              }}
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                minHeight: 0,
              }}
            >
              {/* Image carousel with arrows */}
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={currentYearData.points[carouselIndex].image}
                  src={currentYearData.points[carouselIndex].image}
                  alt={`Image for achievement ${
                    carouselIndex + 1
                  } of year ${activeYear}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  whileHover={{
                    scale: 1.06,
                    boxShadow: `0 8px 32px 0 ${theme.palette.primary.main}29`,
                    filter: "brightness(1.05)",
                  }}
                  style={{
                    position:
                      window?.innerWidth < 900 ? "relative" : "absolute",
                    width: "100%",
                    height: window?.innerWidth < 900 ? "100%" : "100%",
                    objectFit: "cover",
                    borderRadius: window?.innerWidth < 900 ? 10 : 16,
                    pointerEvents: "auto",
                    userSelect: "none",
                    zIndex: 2,
                    cursor: "zoom-in",
                  }}
                  loading="lazy"
                  onClick={() => {
                    setLightboxImg(currentYearData.points[carouselIndex].image);
                    setLightboxOpen(true);
                  }}
                />
              </AnimatePresence>
              {/* LEFT ARROW */}
              <IconButton
                aria-label="Previous image"
                onClick={() => {
                  setCarouselDelay(10000);
                  setCarouselIndex((prev) =>
                    prev === 0 ? currentYearData.points.length - 1 : prev - 1
                  );
                }}
                sx={{
                  position: "absolute",
                  left: { xs: 4, md: 12 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  backgroundColor: alpha(theme.palette.background.paper, 0.3),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  },
                  zIndex: 10,
                  width: { xs: 32, md: 48 },
                  height: { xs: 32, md: 48 },
                  minWidth: { xs: 32, md: 48 },
                  minHeight: { xs: 32, md: 48 },
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </IconButton>
              {/* RIGHT ARROW */}
              <IconButton
                aria-label="Next image"
                onClick={() => {
                  setCarouselDelay(10000);
                  setCarouselIndex((prev) =>
                    prev === currentYearData.points.length - 1 ? 0 : prev + 1
                  );
                }}
                sx={{
                  position: "absolute",
                  right: { xs: 4, md: 12 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  backgroundColor: alpha(theme.palette.background.paper, 0.3),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  },
                  zIndex: 10,
                  width: { xs: 32, md: 48 },
                  height: { xs: 32, md: 48 },
                  minWidth: { xs: 32, md: 48 },
                  minHeight: { xs: 32, md: 48 },
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </IconButton>
            </motion.div>
          </Box>
          {/* ---- LIGHTBOX ---- */}
          <AnimatePresence>
            {lightboxVisible && (
              <motion.div
                key="lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32 }}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  zIndex: 1600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.default, 0.85)
                      : alpha(theme.palette.background.default, 0.7),
                  backdropFilter: "blur(10px)",
                  overflow: "auto",
                  padding: 0,
                }}
                onClick={(e) => {
                  // Only close if background is clicked, not the image
                  if (e.target === e.currentTarget && lightboxOpen) {
                    handleLightboxClose();
                  }
                }}
              >
                <AnimatePresence>
                  {lightboxOpen && (
                    <motion.img
                      key="lightbox-img"
                      src={lightboxImg}
                      alt="Achievement enlarged"
                      initial={{ scale: 0.92, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.92, opacity: 0 }}
                      transition={{ duration: 0.32 }}
                      style={{
                        minWidth: "80%",
                        width: "auto",
                        height: "auto",
                        borderRadius: 24,
                        boxShadow: theme.shadows[24],
                        background: "#000",
                        objectFit: "contain",
                        zIndex: 1700,
                        cursor: "zoom-out",
                        margin: "auto",
                        display: "block",
                      }}
                      onClick={(e) => {
                        // Prevent background click propagation
                        e.stopPropagation();
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}
