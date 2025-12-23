import React from "react";
import { Box } from "@mui/material";
import ExpertiseCard from "./ExpertiseCard";

export default function SkillList({ items, theme }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {items.map((item) => (
        <ExpertiseCard key={item.id} item={item} theme={theme} />
      ))}
    </Box>
  );
}