import { Box, Card, Container, Typography } from '@mui/material'
import type { ReactNode } from 'react'

export function AuthPageShell({
  children,
  description,
  title,
}: {
  children: ReactNode
  description: string
  title: string
}) {
  return (
    <Container component="section" className="py-10 sm:py-14 lg:py-16">
      <Box sx={{ mx: 'auto', maxWidth: 560 }}>
        <Typography
          color="text.secondary"
          variant="overline"
          sx={{ fontWeight: 800, letterSpacing: '0.16em' }}
        >
          FITLAND DEMO ACCESS
        </Typography>
        <Typography component="h1" variant="h2" sx={{ mt: 1 }}>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5 }}>
          {description}
        </Typography>
        <Card sx={{ mt: 4, p: { xs: 2.5, sm: 4 } }}>{children}</Card>
      </Box>
    </Container>
  )
}
