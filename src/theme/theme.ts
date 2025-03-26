import { createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const getDesignTokens = (mode: 'light' | 'dark') => ({
  typography: {
    fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    code: {
      fontFamily: '"IBM Plex Mono", source-code-pro, Menlo, Monaco, Consolas, monospace',
    },
  },
  palette: {
    mode,
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#64748b',
      light: '#94a3b8',
      dark: '#475569',
    },
    background: {
      default: mode === 'light' ? 'var(--background-color)' : 'var(--background-color)',
      paper: mode === 'light' ? 'var(--surface-color)' : 'var(--surface-color)',
    },
    text: {
      primary: mode === 'light' ? 'var(--text-primary)' : 'var(--text-primary)',
      secondary: mode === 'light' ? 'var(--text-secondary)' : 'var(--text-secondary)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'var(--background-color)',
          color: 'var(--text-primary)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--surface-color)',
          color: 'var(--text-primary)',
          border: `1px solid var(--border-color)`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--surface-color)',
          color: 'var(--text-primary)',
          border: `1px solid var(--border-color)`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.5rem',
          padding: '0.5rem 1rem',
          variants: [],
          '&.MuiButton-contained': {
            backgroundColor: 'var(--button-background)',
            color: 'var(--button-text)',
            '&:hover': {
              backgroundColor: 'var(--button-background-hover)',
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--surface-color)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)',
            '&:hover fieldset': {
              borderColor: 'var(--border-color-hover)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--border-color-focus)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'var(--text-secondary)',
            '&.Mui-focused': {
              color: 'var(--border-color-focus)',
            },
          },
        },
      },
    },
  },
});

export const useTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  return createTheme(getDesignTokens(prefersDarkMode ? 'dark' : 'light'));
}; 