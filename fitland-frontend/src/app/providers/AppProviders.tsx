import { GlobalStyles } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider as ReduxProvider } from 'react-redux'
import { RouterProvider } from 'react-router/dom'

import { queryClient } from '@/app/providers/queryClient'
import { router } from '@/app/router/router'
import { store } from '@/app/store/store'
import { appTheme } from '@/app/theme/theme'

export function AppProviders() {
  return (
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <ThemeProvider theme={appTheme} defaultMode="light">
        <CssBaseline />
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            {import.meta.env.DEV && (
              <ReactQueryDevtools
                initialIsOpen={false}
                buttonPosition="bottom-left"
              />
            )}
          </QueryClientProvider>
        </ReduxProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
