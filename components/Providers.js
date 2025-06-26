"use client";
import { useDarkMode } from "../contexts/DarkModeContext";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "../themes/theme";
import DarkModeEffect from "./DarkModeEffect";

export default function Providers({ children }) {
  const { isDarkMode } = useDarkMode();
  const theme = getTheme(isDarkMode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DarkModeEffect />
      {children}
    </ThemeProvider>
  );
}
