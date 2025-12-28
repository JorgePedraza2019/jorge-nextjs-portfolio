import React from "react";
import { Box, Typography, Chip, Paper, Button, Grid } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function SkillRadar({ title, data, color, quickFacts }) {
  return (
    <Grid item xs={12} md={12}>
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          {title}
        </Typography>

        <Paper
          elevation={0}
          tabIndex={-1}
          sx={(theme) => ({
            p: 3,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            background:
              theme.palette.mode === "dark"
                ? `linear-gradient(145deg, ${alpha(
                    theme.palette.background.paper,
                    0.95
                  )}, ${alpha(theme.palette.background.paper, 0.9)})`
                : `linear-gradient(145deg, ${alpha(
                    theme.palette.common.white,
                    1
                  )}, ${alpha(theme.palette.common.white, 0.95)})`,
            border:
              theme.palette.mode === "dark"
                ? `1px solid ${alpha(theme.palette.common.white, 0.06)}`
                : `1px solid ${alpha(theme.palette.common.black, 0.06)}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? `0 20px 50px ${alpha(theme.palette.common.black, 0.45)}`
                : `0 20px 40px ${alpha(theme.palette.common.black, 0.15)}`,
            outline: "none",
          })}
        >
          <Box tabIndex={-1} sx={{ outline: "none", width: "100%", height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Level"
                  dataKey="A"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 2 }}>
              {quickFacts.title}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {quickFacts.chips.map((chip) => (
                <Chip
                  key={chip}
                  label={chip}
                  size="small"
                  sx={(theme) => ({
                    borderRadius: 20,
                    fontWeight: 600,
                    borderColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.common.white, 0.1)
                        : alpha(theme.palette.common.black, 0.12),
                  })}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Grid>
  );
}
