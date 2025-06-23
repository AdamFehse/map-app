"use client";
import { useEffect } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";

export default function DarkModeEffect() {
  const { isDarkMode } = useDarkMode();
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);
  return null;
}
