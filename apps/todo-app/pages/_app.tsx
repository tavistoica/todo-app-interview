import type { AppProps } from 'next/app'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { orange } from '@mui/material/colors'
import type { PaletteColorOptions } from '@mui/material/styles'

// Extend the theme to include custom properties
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      active: PaletteColorOptions
    }
  }

  interface ThemeOptions {
    status?: {
      active?: PaletteColorOptions
    }
  }
}

// Create the base theme first
let theme = createTheme({
  // Theme customization goes here as usual
})

// Extend the theme with custom properties
theme = createTheme(theme, {
  status: {
    active: theme.palette.augmentColor({
      color: {
        main: orange[500],
      },
      name: 'active',
    }),
  },
})

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default App
