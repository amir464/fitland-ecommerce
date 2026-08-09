import { Chip } from '@mui/material'

import { getStatusLabel, normalizeStatus } from '@/features/customer-dashboard/lib/orderDashboard'

const STATUS_COLORS = {
  pending: 'warning',
  processing: 'info',
  shipped: 'secondary',
  delivered: 'success',
  cancelled: 'error',
} as const

export function OrderStatusChip({ status }: { status: string }) {
  const normalizedStatus = normalizeStatus(status)
  const color = STATUS_COLORS[normalizedStatus as keyof typeof STATUS_COLORS] ?? 'default'

  return (
    <Chip
      color={color}
      label={getStatusLabel(normalizedStatus)}
      size="small"
      sx={{ fontWeight: 700 }}
    />
  )
}
