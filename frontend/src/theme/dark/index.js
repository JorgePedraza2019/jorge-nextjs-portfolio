// src/theme/dark/index.js
import { createTheme } from "@mui/material/styles";

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

// Theme Builder "dark" scheme mapping → MUI
const darkTheme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#8DCEFF", // primary
      contrastText: "#00344F", // onPrimary
    },

    secondary: {
      main: "#A5CBEB",
      contrastText: "#03344E",
    },

    // Custom tertiary
    tertiary: {
      main: "#EAB3FF",
      contrastText: "#50076F",
    },

    background: {
      default: "#0F1418", // background
      paper: "#0F1418", // surface
    },

    text: {
      primary: "#DEE3E9", // onBackground / onSurface
      secondary: "#BEC8D2", // onSurfaceVariant
    },

    error: {
      main: "#FFB4AB",
      contrastText: "#690005",
    },

    action: {
      hover: "rgba(141, 206, 255, 0.1)",
      selected: "rgba(141, 206, 255, 0.2)",
      disabled: "rgba(255,255,255,0.3)",
      focus: "rgba(141, 206, 255, 0.15)",
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

export default darkTheme;
