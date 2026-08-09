import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Alert, Button, Card, Skeleton, Stack, Typography } from '@mui/material'
import { Link } from 'react-router'

export function DashboardLoadingSkeleton() {
  return (
    <Stack aria-label="Loading customer orders" aria-busy="true" spacing={3}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} height={112} variant="rounded" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Skeleton height={360} variant="rounded" />
        <Skeleton height={360} variant="rounded" />
      </div>
      <Skeleton height={320} variant="rounded" />
    </Stack>
  )
}

export function DashboardErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert
      action={<Button color="inherit" onClick={onRetry}>Retry</Button>}
      severity="error"
    >
      We could not load your orders. Check the demo API and try again.
    </Alert>
  )
}

export function DashboardEmptyState() {
  return (
    <Card sx={{ px: 3, py: { xs: 6, sm: 8 }, textAlign: 'center' }}>
      <ShoppingBagOutlinedIcon sx={{ color: 'text.secondary', fontSize: 56 }} />
      <Typography component="h2" variant="h5" sx={{ fontWeight: 800, mt: 2 }}>
        Your order history is ready for its first entry.
      </Typography>
      <Typography color="text.secondary" sx={{ mx: 'auto', mt: 1, maxWidth: 520 }}>
        Once you place an order, spending trends, delivery status, and recent purchases will appear here.
      </Typography>
      <Button component={Link} to="/shop" variant="contained" sx={{ mt: 3 }}>
        Continue Shopping
      </Button>
    </Card>
  )
}
