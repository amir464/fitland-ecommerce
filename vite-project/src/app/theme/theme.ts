import { createTheme } from '@mui/material/styles'

import { paletteTokens, shadowTokens, shapeTokens } from '@/app/theme/tokens'

export const appTheme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        primary: { main: paletteTokens.charcoal, contrastText: paletteTokens.paper },
        secondary: {
          main: paletteTokens.lime,
          dark: paletteTokens.limeDark,
          contrastText: paletteTokens.charcoal,
        },
        background: { default: paletteTokens.canvas, paper: paletteTokens.paper },
        text: { primary: paletteTokens.charcoal, secondary: paletteTokens.gray[700] },
        divider: paletteTokens.gray[300],
      },
    },
  },
  spacing: 8,
  shape: { borderRadius: shapeTokens.radius },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: 'clamp(2.75rem, 8vw, 6.75rem)',
      fontWeight: 800,
      lineHeight: 0.92,
      letterSpacing: '-0.055em',
    },
    h2: { fontWeight: 700, letterSpacing: '-0.035em' },
    button: { fontWeight: 700, letterSpacing: '0.04em', textTransform: 'none' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: shapeTokens.radiusSmall,
          paddingInline: 20,
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: `1px solid ${paletteTokens.gray[300]}`,
          boxShadow: shadowTokens.card,
        },
      },
    },
    MuiContainer: {
      defaultProps: { maxWidth: 'lg' },
      styleOverrides: {
        root: ({ theme }) => ({
          paddingInline: 16,
          [theme.breakpoints.up('sm')]: {
            paddingInline: 24,
          },
          [theme.breakpoints.up('lg')]: {
            paddingInline: 32,
          },
        }),
      },
    },
    MuiTextField: { defaultProps: { variant: 'outlined' } },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: shapeTokens.radiusSmall } },
    },
    MuiDialog: {
      defaultProps: { fullWidth: true },
      styleOverrides: {
        paper: {
          borderRadius: shapeTokens.radius,
          boxShadow: shadowTokens.dialog,
        },
      },
    },
  },
})
