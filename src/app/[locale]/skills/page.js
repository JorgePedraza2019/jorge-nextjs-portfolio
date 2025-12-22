"use client";

import React from "react";
import { Box, useTheme } from "@mui/material";
import HeroSection from "./components/HeroSection";
import SkillSection from "./components/SkillSection";

export default function SkillsPage() {
  const theme = useTheme();

  return (
    <Box>
      <HeroSection theme={theme} />
      <Box sx={{ width: "100%", minHeight: "100vh" }}>
        <SkillSection theme={theme} />
      </Box>
    </Box>
  );
}
