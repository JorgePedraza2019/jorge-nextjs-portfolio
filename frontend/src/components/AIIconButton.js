"use client";

import { IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function AIIconButton(props) {
  const t = useTranslations("navbar");
  const gradientColors = [
    "#5ee7df",
    "#b490ca",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#8b5cf6",
  ];

  const gradientAnimation = {
    backgroundPosition: ["0% 50%", "50% 50%", "100% 50%", "50% 50%", "0% 50%"],
  };

  return (
    <motion.div
      style={{
        marginLeft: 8,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        borderRadius: "50%",
        background: `linear-gradient(270deg, ${gradientColors.join(", ")})`,
        backgroundSize: "600% 600%",
      }}
      animate={gradientAnimation}
      transition={{
        duration: 14,
        repeat: Infinity,
        ease: "linear",
      }}
      whileHover={{ scale: 1.1 }}
    >
      <IconButton
        {...props}
        sx={{
          color: "#fff",
          p: 0.55,
          width: "100%",
          height: "100%",
          "&:hover": {
            backgroundColor: "transparent",
          },
          ...props.sx,
        }}
        aria-label="AI Icon Button"
      >
        {/* <SmartToyIcon fontSize="small" /> */}
        <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
          {t("aiButton")}
        </Typography>
      </IconButton>
    </motion.div>
  );
}
