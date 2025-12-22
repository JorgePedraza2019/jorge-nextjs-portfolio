// src/theme/light/index.js
import { createTheme } from "@mui/material/styles";

// Typography (puedes moverlo a un archivo compartido si quieres)
const typography = {
  fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
  h1: { fontSize: "2.5rem", fontWeight: 700 },
  h2: { fontSize: "2rem", fontWeight: 700 },
  h3: { fontSize: "1.75rem", fontWeight: 600 },
  h4: { fontSize: "1.5rem", fontWeight: 600 },
  h5: { fontSize: "1.25rem", fontWeight: 500 },
  h6: { fontSize: "1rem", fontWeight: 500 },
  body1: { fontSize: "1rem" },
  body2: { fontSize: "0.875rem" },
};

// Theme Builder "light" scheme mapping → MUI
const lightTheme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#006493", // M3 → primary
      contrastText: "#FFFFFF", // M3 → onPrimary
    },

    secondary: {
      main: "#3C627E",
      contrastText: "#FFFFFF",
    },

    // Custom tertiary mapping
    tertiary: {
      main: "#8342A1",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#F6F9FF", // background
      paper: "#F6F9FF", // surface
    },

    text: {
      primary: "#171C21", // onBackground / onSurface
      secondary: "#3E4851", // onSurfaceVariant
    },

    error: {
      main: "#BA1A1A",
      contrastText: "#FFFFFF",
    },

    action: {
      hover: "rgba(0, 100, 150, 0.1)",
      selected: "rgba(0, 100, 150, 0.2)",
      disabled: "rgba(0,0,0,0.26)",
      focus: "rgba(0, 100, 150, 0.15)",
      activatedOpacity: 0.12,
    },
  },

  customColors: {
    example: {
      main: "#ffffff",
      contrastText: "#ffffff",
    },
  },

  typography,
});

export default lightTheme;
