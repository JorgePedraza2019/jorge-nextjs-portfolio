"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

import { lightTheme, darkTheme } from "@/theme";

const clientSideEmotionCache = createCache({ key: "css", prepend: true });

export default function ThemeRegistry({ children }) {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}