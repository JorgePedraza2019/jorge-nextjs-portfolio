import React from "react";
import { Box, Typography, Chip, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";

export default function HighlightedWork({
  theme,
  skillType,
  hardHighlights,
  softHighlights,
  labels,
}) {
  const highlights = skillType === "hard" ? hardHighlights : softHighlights;
  const chipColor =
    skillType === "hard"
      ? theme.palette.primary.main
      : theme.palette.secondary.main;

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 800, mt: 4, mb: 2 }}>
        {labels.titles[skillType]}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {highlights.map((h) => (
          <Box
            key={h.title}
            sx={{ flex: "1 1 calc(33.333% - 16px)", minWidth: 280, display: "flex" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              style={{ width: "100%" }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  background:
                    theme.palette.mode === "dark"
                      ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.9)})`
                      : `linear-gradient(145deg, ${alpha(theme.palette.common.white, 1)}, ${alpha(theme.palette.common.white, 0.95)})`,
                  border:
                    theme.palette.mode === "dark"
                      ? `1px solid ${alpha(theme.palette.common.white, 0.06)}`
                      : `1px solid ${alpha(theme.palette.common.black, 0.06)}`,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? `0 20px 50px ${alpha(theme.palette.common.black, 0.45)}`
                      : `0 20px 40px ${alpha(theme.palette.common.black, 0.15)}`,
                }}
              >
                <Chip
                  label={labels.chips[skillType]}
                  size="small"
                  sx={{
                    alignSelf: "flex-start",
                    mb: 0.5,
                    fontWeight: 800,
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                    bgcolor: chipColor,
                    color: "#fff",
                  }}
                />
                <Typography sx={{ fontWeight: 800 }}>{h.title}</Typography>
                <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.9rem", mb: 1 }}>
                  {h.subtitle}
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {h.bullets.map((b) => (
                    <li key={b} style={{ marginBottom: 6 }}>
                      <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        {b}
                      </Typography>
                    </li>
                  ))}
                </Box>
              </Paper>
            </motion.div>
          </Box>
        ))}
      </Box>
    </Box>
  );
}