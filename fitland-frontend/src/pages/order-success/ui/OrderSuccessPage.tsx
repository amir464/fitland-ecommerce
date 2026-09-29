import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { Link, useParams } from 'react-router'

import { useOrderQuery } from '@/entities/order/api/useOrderQuery'
import { getOrderApiErrorMessage } from '@/entities/order/lib/getOrderApiErrorMessage'
import type { Order } from '@/entities/order/model/order.schema'
import { formatCurrency } from '@/shared/lib/formatCurrency'

export function Component() {
  const { orderId: routeOrderId } = useParams<{ orderId: string }>()
  const orderId = routeOrderId?.trim() ?? ''
  const orderQuery = useOrderQuery(orderId)

  if (!orderId) {
    return <OrderError message="An order number is required." />
  }

  if (orderQuery.isPending) {
    return (
      <Container component="section" className="py-12 sm:py-16">
        <Stack
          aria-busy="true"
          aria-label="Loading order"
          sx={{ alignItems: 'center', minHeight: 240, justifyContent: 'center' }}
        >
          <CircularProgress />
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Loading your order...
          </Typography>
        </Stack>
      </Container>
    )
  }

  if (orderQuery.isError) {
    return (
      <OrderError
        message={getOrderApiErrorMessage(orderQuery.error)}
        onRetry={() => void orderQuery.refetch()}
      />
    )
  }

  return <OrderConfirmation order={orderQuery.data} />
}

function OrderConfirmation({ order }: { order: Order }) {
  return (
    <Container component="section" className="py-10 sm:py-14 lg:py-16">
      <Card className="mx-auto px-5 py-10 sm:px-10 sm:py-14" sx={{ maxWidth: 760 }}>
        <Stack sx={{ alignItems: 'center', textAlign: 'center' }}>
          <CheckCircleOutlineRoundedIcon
            aria-hidden="true"
            color="success"
            sx={{ fontSize: 72 }}
          />
          <Typography component="h1" variant="h3" className="mt-4" sx={{ fontWeight: 800 }}>
            Order Confirmed
          </Typography>
          <Typography color="text.secondary" className="mt-3">
            Thanks, {order.customer.firstName}. Your demo order has been saved.
          </Typography>
          <Typography className="mt-3" sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}>
            Order number: {order.orderNumber}
          </Typography>
        </Stack>

        <Box
          component="dl"
          sx={{
            bgcolor: 'action.hover',
            borderRadius: 1,
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
            mt: 4,
            p: { xs: 2.5, sm: 3 },
          }}
        >
          <OrderDetail label="Customer" value={`${order.customer.firstName} ${order.customer.lastName}`} />
          <OrderDetail label="Delivery city" value={order.deliveryAddress.city} />
          <OrderDetail label="Total quantity" value={String(order.totalQuantity)} />
          <OrderDetail label="Final total" value={formatCurrency(order.total, order.currency)} />
          <OrderDetail label="Payment" value={getPaymentLabel(order.paymentMethod)} />
          <OrderDetail label="Shipping" value={getShippingLabel(order.shippingMethod)} />
        </Box>

        <Stack sx={{ alignItems: 'center', mt: 4 }}>
          <Button component={Link} to="/shop" variant="contained">
            Continue Shopping
          </Button>
        </Stack>
      </Card>
    </Container>
  )
}

function OrderDetail({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography component="dt" color="text.secondary" variant="caption">
        {label}
      </Typography>
      <Typography component="dd" sx={{ fontWeight: 800, m: 0, mt: 0.5, overflowWrap: 'anywhere' }}>
        {value}
      </Typography>
    </Box>
  )
}

function OrderError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Container component="section" className="py-12 sm:py-16">
      <Typography component="h1" variant="h3" sx={{ fontWeight: 800, mb: 3, textAlign: 'center' }}>
        Order unavailable
      </Typography>
      <Alert
        severity="error"
        sx={{ mx: 'auto', maxWidth: 720 }}
        action={
          onRetry ? (
            <Button color="inherit" onClick={onRetry} size="small">
              Retry
            </Button>
          ) : undefined
        }
      >
        {message}
      </Alert>
      <Stack sx={{ alignItems: 'center', mt: 4 }}>
        <Button component={Link} to="/shop" variant="contained">
          Return to Shop
        </Button>
      </Stack>
    </Container>
  )
}

function getPaymentLabel(paymentMethod: Order['paymentMethod']) {
  return paymentMethod === 'cash_on_delivery'
    ? 'Cash on Delivery'
    : 'Demo Card Payment'
}

function getShippingLabel(shippingMethod: Order['shippingMethod']) {
  return shippingMethod === 'express' ? 'Express shipping' : 'Standard shipping'
}
