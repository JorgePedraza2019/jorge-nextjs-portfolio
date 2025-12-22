// eslint-disable-next-line react-hooks/exhaustive-deps
import { Box, Chip, Paper, Button, useMediaQuery, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useLayoutEffect, useState } from "react";

export default function SkillHeader({
  skillType,
  onSkillChange,
  techStack,
  softStack,
  labels,
  theme,
}) {
  const x = useMotionValue(0);
  const animationRef = useRef(null);
  const marqueeRef = useRef(null);
  const [repeatCount, setRepeatCount] = useState(2); // cantidad inicial de repeticiones

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const getCurrentChips = () => (skillType === "hard" ? techStack : softStack);

  const repeatedChips = Array(repeatCount)
    .fill(0)
    .flatMap(() => getCurrentChips());

  useLayoutEffect(() => {
    if (!marqueeRef.current) return;

    const wrapperWidth = marqueeRef.current.parentElement.offsetWidth;
    const contentWidth = marqueeRef.current.scrollWidth / repeatCount;

    const minRepeats = Math.ceil(wrapperWidth / contentWidth) + 1;
    setRepeatCount(minRepeats);
  }, [skillType, techStack, softStack]);

  useEffect(() => {
    if (!marqueeRef.current) return;

    animationRef.current?.stop();

    const totalWidth = marqueeRef.current.scrollWidth / repeatCount;

    animationRef.current = animate(x, [0, -totalWidth], {
      duration: 34,
      ease: "linear",
      repeat: Infinity,
    });

    return () => animationRef.current?.stop();
  }, [skillType, repeatCount]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: isMobile ? 2 : 3,
        borderRadius: 3,
        mb: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: isMobile ? 1.5 : 2,
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
      }}
    >
      <Box sx={{ display: "flex", gap: isMobile ? 1 : 1, mb: 1, flexWrap: isMobile ? "wrap" : "nowrap" }}>
        <Button
          variant={skillType === "hard" ? "contained" : "outlined"}
          size={isMobile ? "small" : "medium"}
          onClick={() => onSkillChange("hard")}
          sx={{ borderRadius: 20 }}
        >
          {labels.hard}
        </Button>
        <Button
          variant={skillType === "soft" ? "contained" : "outlined"}
          size={isMobile ? "small" : "medium"}
          onClick={() => onSkillChange("soft")}
          sx={{ borderRadius: 20 }}
        >
          {labels.soft}
        </Button>
      </Box>

      <Box
        className="chipMarqueeWrapper"
        sx={{
          width: "100%",
          py: isMobile ? 0.5 : 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Gradientes laterales */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: isMobile ? 32 : 56,
            height: "70%",
            transform: "translateY(-50%)",
            background: `linear-gradient(to right, ${theme.palette.background.paper}, ${theme.palette.background.paper}00)`,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            width: isMobile ? 32 : 56,
            height: "70%",
            transform: "translateY(-50%)",
            background: `linear-gradient(to left, ${theme.palette.background.paper}, ${theme.palette.background.paper}00)`,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Marquee de chips */}
        <motion.div
          ref={marqueeRef}
          onHoverStart={() => {
            animationRef.current?.stop();
          }}
          onHoverEnd={() => {
            const totalWidth = marqueeRef.current.scrollWidth / repeatCount;
            const currentX = x.get();
            animationRef.current = animate(
              x,
              [currentX, currentX - totalWidth],
              {
                duration: 34,
                ease: "linear",
                repeat: Infinity,
              }
            );
          }}
          style={{
            display: "flex",
            width: "max-content",
            gap: isMobile ? 8 : 12,
            x,
            willChange: "transform",
          }}
        >
          {repeatedChips.map((t, i) => (
            <Chip
              key={`${t}-${i}`}
              label={t}
              variant="outlined"
              sx={{
                flexShrink: 0,
                borderRadius: 999,
                px: 1.25,
                py: 0.5,
                fontWeight: 600,
                fontSize: isMobile ? "0.75rem" : "0.875rem",
                borderColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.common.white, 0.06)
                    : alpha(theme.palette.common.black, 0.08),
              }}
            />
          ))}
        </motion.div>
      </Box>
    </Paper>
  );
}