import { Card, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

export function DashboardStatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <Card sx={{ minWidth: 0, p: 2.5 }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
        <Stack
          sx={{
            alignItems: 'center',
            bgcolor: 'secondary.main',
            borderRadius: 1,
            color: 'secondary.contrastText',
            height: 44,
            justifyContent: 'center',
            width: 44,
          }}
        >
          {icon}
        </Stack>
        <div>
          <Typography color="text.secondary" variant="body2">
            {label}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1.2 }}>
            {value}
          </Typography>
        </div>
      </Stack>
    </Card>
  )
}
