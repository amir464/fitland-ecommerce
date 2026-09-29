import { Button, Container, Stack, Typography } from '@mui/material'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

export function RouteErrorPage() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`.trim()
    : error instanceof Error
      ? error.message
    : 'An unexpected error interrupted this page.'

  return (
    <Container component="main" className="grid min-h-screen place-items-center py-16">
      <Stack spacing={3} sx={{ alignItems: 'flex-start', maxWidth: 560 }}>
        <Typography variant="overline" color="text.secondary">
          FitLand Store
        </Typography>
        <Typography variant="h2">Something went off track.</Typography>
        <Typography color="text.secondary">{message}</Typography>
        <Button component={Link} to="/" variant="contained">
          Return home
        </Button>
      </Stack>
    </Container>
  )
}
