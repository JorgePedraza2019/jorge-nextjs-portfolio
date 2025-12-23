"use client";

import { useState, useRef, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import ProjectCard from "./components/ProjectCard";
import HeroSection from "./components/HeroSection";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useInView } from "framer-motion";

export default function ProjectsPage({ messages }) {
  const t = useTranslations("projects");
  const [tabValue, setTabValue] = useState(0);

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  const [direction, setDirection] = useState(0);

  const [hasMounted, setHasMounted] = useState(false);

  const [firstInView, setFirstInView] = useState(true);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (isInView && firstInView) {
      setFirstInView(false);
    }
  }, [isInView, firstInView]);

  const tabLabels = [t("tabs.company"), t("tabs.academic"), t("tabs.personal")];
  const projects = t.raw("cards");

  const filteredProjects = projects.filter(
    (p) => p.category === tabLabels[tabValue]
  );

  return (
    <Box>
      <HeroSection />

      <Box sx={{ maxWidth: 1400, mx: "auto", px: 4 }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.9 }}
        >
          <Tabs
            value={tabValue}
            onChange={(e, val) => {
              setDirection(val > tabValue ? 1 : -1);
              setTabValue(val);
            }}
            indicatorColor="primary"
            textColor="primary"
            centered
            sx={{ mb: 6 }}
            TabIndicatorProps={{
              style: { borderRadius: 3 },
            }}
          >
            {tabLabels.map((label) => (
              <Tab key={label} label={label} disableRipple />
            ))}
          </Tabs>
        </Box>

        <Box
          ref={containerRef}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 3, md: 4, lg: "40px" },
            "& > div": {
              flexBasis: {
                xs: "100%",
                sm: "48%",
                lg: "calc(33.333% - 32px)",
              },
              maxWidth: {
                xs: "100%",
                sm: "48%",
                lg: 420,
              },
            },
          }}
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: firstInView ? 1.15 : 0, // delay only on first entrance
                }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}
