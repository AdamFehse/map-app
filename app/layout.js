// app/layout.js

import './globals.css' // your existing CSS imports
import '../styles/popup-darkmode.css' // popup dark mode styles
import { Inter } from "next/font/google";
import { DarkModeProvider } from "../contexts/DarkModeContext";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "../themes/theme";
import Providers from "../components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Story Map',
  description: 'Confluencenter Story Map',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DarkModeProvider>
          <Providers>{children}</Providers>
        </DarkModeProvider>
      </body>
    </html>
  )
}