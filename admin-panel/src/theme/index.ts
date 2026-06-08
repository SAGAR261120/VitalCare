import { createTheme, ThemeOptions } from '@mui/material/styles';

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 10 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: { main: '#7C3AED', light: '#A78BFA', dark: '#5B21B6' },
    secondary: { main: '#10B981' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: { main: '#A78BFA', light: '#C4B5FD', dark: '#7C3AED' },
    secondary: { main: '#34D399' },
    background: { default: '#0F172A', paper: '#1E293B' },
  },
});
