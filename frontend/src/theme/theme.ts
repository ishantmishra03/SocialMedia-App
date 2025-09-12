import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

// Custom blue tone
const enterpriseBlue = {
  light: '#3b82f6', // Lighter variant for hover/focus
  main: '#1e3a8a',  // Deep, professional blue (used as primary)
  dark: '#172554',  // For dark mode or hover states
  contrastText: '#ffffff',
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: enterpriseBlue,
    background: {
      default: '#f5f7fa', // Subtle, off-white background
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: grey[700],
    },
  },
  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 8, // Rounded corners 
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: enterpriseBlue,
    background: {
      default: '#0f172a', // Deep navy background
      paper: '#1e293b',   // Card background
    },
    text: {
      primary: '#f1f5f9',
      secondary: grey[400],
    },
  },
  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
});
