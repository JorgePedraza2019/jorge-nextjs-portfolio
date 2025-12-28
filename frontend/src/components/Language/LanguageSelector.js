"use client";

import { IconButton, Menu, MenuItem } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";
import { useTheme } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import { useState } from "react";

const languages = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  // { code: "fr", label: "FR" },
];

export default function LanguageSelector({ locale }) {
  const theme = useTheme();
  const pathname = usePathname();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleSelectLocale = (newLocale) => {
    // Close menu immediately for correct UX
    setAnchorEl(null);

    const segments = pathname.split("/");
    segments[1] = newLocale;

    window.location.href = segments.join("/");
  };

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          color: theme.palette.text.primary,
          "&:hover": { backgroundColor: theme.palette.action.hover },
        }}
      >
        <LanguageIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {languages.map(({ code, label }) => (
          <MenuItem
            key={code}
            selected={locale === code}
            onClick={() => handleSelectLocale(code)}
          >
            {label}
            {locale === code && <CheckIcon fontSize="small" />}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
