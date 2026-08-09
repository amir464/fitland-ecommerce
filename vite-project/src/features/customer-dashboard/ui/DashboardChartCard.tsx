import { Box, Card, Typography } from '@mui/material'
import type { ReactNode } from 'react'

export function DashboardChartCard({
  children,
  description,
  title,
}: {
  children: ReactNode
  description: string
  title: string
}) {
  return (
    <Card sx={{ minWidth: 0, p: { xs: 2, sm: 2.5 } }}>
      <Typography component="h2" variant="h6" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
        {description}
      </Typography>
      <Box sx={{ height: { xs: 260, sm: 300 }, minWidth: 0, mt: 2.5 }}>
        {children}
      </Box>
    </Card>
  )
}
