import React from "react";
import { Box, Typography, Chip, Paper, LinearProgress } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";

export default function ExpertiseCard({theme, item}) {
  const [hover, setHover] = React.useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      whileHover={{ scale: 1.02 }}
      style={{ width: "100%" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Paper
        elevation={0}
        sx={(theme) => ({
          position: "relative",
          p: 4,
          borderRadius: 4,
          height: "auto",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
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
        })}
      >
        {(item.videoLight || item.videoDark) && (
          <motion.video
            src={
              theme.palette.mode === "dark" ? item.videoDark : item.videoLight
            }
            autoPlay
            muted
            loop
            playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: hover ? 0.35 : 0 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1,
              filter: "blur(4px)",
            }}
          />
        )}
        <div style={{ position: "relative", zIndex: 2 }}>
          <Box
            sx={{
              position: "absolute",
              right: -40,
              top: -40,
              width: 160,
              height: 160,
              opacity: theme.palette.mode === "dark" ? 0.12 : 0.1,
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill={theme.palette.primary.main}
              />
              <rect
                x="50"
                y="50"
                width="80"
                height="80"
                rx="20"
                fill={theme.palette.secondary.main}
                opacity="0.4"
              />
            </svg>
          </Box>

          <Box sx={{ zIndex: 10 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
              {item.title}
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                mb: 2,
                color: theme.palette.primary.main,
                letterSpacing: "-1px",
              }}
            >
              {item.level}%
            </Typography>

            <LinearProgress
              variant="determinate"
              value={item.level}
              sx={{
                height: 10,
                borderRadius: 5,
                mb: 3,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            />

            <Typography sx={{ opacity: 0.7, lineHeight: 1.4, mb: 2 }}>
              {item.description}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {item.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderRadius: 20,
                    fontWeight: 600,
                    borderColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.common.white, 0.1)
                        : alpha(theme.palette.common.black, 0.12),
                  }}
                />
              ))}
            </Box>
          </Box>
        </div>
      </Paper>
    </motion.div>
  );
}
