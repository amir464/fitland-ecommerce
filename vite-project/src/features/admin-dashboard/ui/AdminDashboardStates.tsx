import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import { Alert, Button, Card, Skeleton, Stack, Typography } from '@mui/material'

export function AdminDashboardLoadingSkeleton() {
  return (
    <Stack aria-label="Loading admin analytics" aria-busy="true" spacing={3}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} height={112} variant="rounded" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} height={360} variant="rounded" />
        ))}
      </div>
      <Skeleton height={360} variant="rounded" />
    </Stack>
  )
}

export function AdminOrdersErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert
      action={<Button color="inherit" onClick={onRetry}>Retry</Button>}
      severity="error"
    >
      Store order analytics are unavailable. Check the demo API and try again.
    </Alert>
  )
}

export function AdminDashboardEmptyState() {
  return (
    <Card sx={{ px: 3, py: { xs: 5, sm: 6 }, textAlign: 'center' }}>
      <InsightsOutlinedIcon sx={{ color: 'text.secondary', fontSize: 52 }} />
      <Typography component="h2" variant="h5" sx={{ fontWeight: 800, mt: 2 }}>
        Analytics are ready for the first order.
      </Typography>
      <Typography color="text.secondary" sx={{ mx: 'auto', mt: 1, maxWidth: 560 }}>
        Revenue, sales trends, status distribution, and recent activity will appear here.
      </Typography>
    </Card>
  )
}
