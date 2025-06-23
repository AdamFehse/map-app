import { createTheme } from '@mui/material/styles';

export const getTheme = (isDarkMode) =>
  createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
    // other theme customizations here
  });