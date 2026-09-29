import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useRef } from 'react'
import { Link, useNavigate } from 'react-router'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { useCreateOrderMutation } from '@/entities/order/api/useCreateOrderMutation'
import { orderQueryKeys } from '@/entities/order/api/order.queryKeys'
import { getOrderApiErrorMessage } from '@/entities/order/lib/getOrderApiErrorMessage'
import type { Order } from '@/entities/order/model/order.schema'
import {
  getCheckoutTotal,
  getShippingFee,
} from '@/features/checkout/lib/checkoutPricing'
import {
  checkoutSchema,
  type CheckoutFormValues,
} from '@/features/checkout/model/checkout.schema'
import {
  removeSubmittedItems,
  selectCartItems,
  selectCartSubtotal,
  selectCartTotalUnits,
} from '@/features/cart/model'
import { selectCurrentUser } from '@/features/auth/model'
import { resolveApiAssetUrl } from '@/shared/api/resolveApiAssetUrl'
import { getOrderSuccessPath } from '@/shared/config/routePaths'
import { formatCurrency } from '@/shared/lib/formatCurrency'

export function Component() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const submissionInFlightRef = useRef(false)
  const authenticatedUser = useAppSelector(selectCurrentUser)
  const checkoutUser =
    authenticatedUser?.role === 'customer' ? authenticatedUser : null
  const cartItems = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartSubtotal)
  const totalUnits = useAppSelector(selectCartTotalUnits)
  const orderMutation = useCreateOrderMutation()
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: checkoutUser?.firstName ?? '',
      lastName: checkoutUser?.lastName ?? '',
      email: checkoutUser?.email ?? '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      shippingMethod: 'standard',
      paymentMethod: 'cash_on_delivery',
    },
  })
  const shippingMethod = useWatch({ control, name: 'shippingMethod' })
  const shippingFee = getShippingFee(shippingMethod)
  const total = getCheckoutTotal(subtotal, shippingFee)
  const currencies = new Set(cartItems.map((item) => item.currency))
  const hasInconsistentCurrency = currencies.size > 1
  const currency = cartItems[0]?.currency ?? 'USD'

  if (cartItems.length === 0) {
    return <EmptyCheckout />
  }

  const submitOrder = async (values: CheckoutFormValues) => {
    if (
      submissionInFlightRef.current ||
      orderMutation.isPending ||
      hasInconsistentCurrency
    ) {
      return
    }

    submissionInFlightRef.current = true

    const orderOwner =
      checkoutUser
        ? { id: checkoutUser.id, email: checkoutUser.email }
        : null

    const submittedCartItems = cartItems.map((item) => ({
      productId: item.productId,
      selectedColor: { ...item.selectedColor },
      selectedSize: item.selectedSize,
      quantity: item.quantity,
    }))

    const orderNumber = createOrderId()
    const order: Order = {
      id: orderNumber,
      userId: orderOwner?.id,
      customerEmailNormalized: values.email.trim().toLowerCase(),
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'pending',
      customer: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
      },
      deliveryAddress: {
        address: values.address,
        city: values.city,
        postalCode: values.postalCode,
      },
      shippingMethod: values.shippingMethod,
      paymentMethod: values.paymentMethod,
      items: cartItems.map((item) => ({
        productId: item.productId,
        slug: item.slug,
        sku: item.sku,
        name: item.name,
        image: item.image,
        unitPrice: item.unitPrice,
        currency: item.currency,
        selectedColor: { ...item.selectedColor },
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        lineTotal: item.unitPrice * item.quantity,
      })),
      totalQuantity: totalUnits,
      subtotal,
      shippingFee: getShippingFee(values.shippingMethod),
      total: getCheckoutTotal(subtotal, getShippingFee(values.shippingMethod)),
      currency,
    }

    try {
      const savedOrder = await orderMutation.mutateAsync(order)

      if (orderOwner) {
        void queryClient.invalidateQueries({
          queryKey: orderQueryKeys.customer(
            orderOwner.id,
            orderOwner.email.trim().toLowerCase(),
          ),
        })
      }
      void queryClient.invalidateQueries({ queryKey: orderQueryKeys.admin() })

      dispatch(removeSubmittedItems(submittedCartItems))
      navigate(getOrderSuccessPath(savedOrder.id))
    } catch {
      submissionInFlightRef.current = false
      // Mutation state renders the API error while cart and form values stay intact.
    }
  }

  return (
    <Container component="section" className="py-10 sm:py-14 lg:py-16">
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ fontWeight: 700, letterSpacing: '0.16em' }}
      >
        SECURE DEMO CHECKOUT
      </Typography>
      <Typography component="h1" variant="h2" className="mt-2">
        Checkout
      </Typography>
      <Typography className="mt-3" color="text.secondary">
        Enter delivery details and review your FitLand order. No real payment
        information is collected.
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={(event) => void handleSubmit(submitOrder)(event)}
        className="mt-8 sm:mt-10"
        sx={{
          alignItems: 'start',
          display: 'grid',
          gap: { xs: 3, lg: 4 },
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            lg: 'minmax(0, 1fr) minmax(300px, 380px)',
          },
          minWidth: 0,
        }}
      >
        <Stack spacing={3} sx={{ minWidth: 0 }}>
          <CheckoutSection title="Contact Information">
            <Box sx={twoColumnFields}>
              <TextField
                label="First name"
                autoComplete="given-name"
                error={Boolean(errors.firstName)}
                helperText={errors.firstName?.message}
                {...register('firstName')}
              />
              <TextField
                label="Last name"
                autoComplete="family-name"
                error={Boolean(errors.lastName)}
                helperText={errors.lastName?.message}
                {...register('lastName')}
              />
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register('email')}
              />
              <TextField
                label="Phone"
                type="tel"
                autoComplete="tel"
                error={Boolean(errors.phone)}
                helperText={errors.phone?.message}
                {...register('phone')}
              />
            </Box>
          </CheckoutSection>

          <CheckoutSection title="Delivery Address">
            <Stack spacing={2}>
              <TextField
                label="Address"
                autoComplete="street-address"
                error={Boolean(errors.address)}
                helperText={errors.address?.message}
                {...register('address')}
              />
              <Box sx={twoColumnFields}>
                <TextField
                  label="City"
                  autoComplete="address-level2"
                  error={Boolean(errors.city)}
                  helperText={errors.city?.message}
                  {...register('city')}
                />
                <TextField
                  label="Postal code"
                  autoComplete="postal-code"
                  error={Boolean(errors.postalCode)}
                  helperText={errors.postalCode?.message}
                  {...register('postalCode')}
                />
              </Box>
            </Stack>
          </CheckoutSection>

          <CheckoutSection title="Shipping Method">
            <Controller
              control={control}
              name="shippingMethod"
              render={({ field }) => (
                <FormControl error={Boolean(errors.shippingMethod)}>
                  <FormLabel id="shipping-method-label">Choose shipping</FormLabel>
                  <RadioGroup
                    {...field}
                    aria-labelledby="shipping-method-label"
                    sx={{ mt: 1 }}
                  >
                    <FormControlLabel
                      value="standard"
                      control={<Radio />}
                      label="Standard shipping — Free"
                    />
                    <FormControlLabel
                      value="express"
                      control={<Radio />}
                      label={`Express shipping — ${formatCurrency(getShippingFee('express'), currency)}`}
                    />
                  </RadioGroup>
                  <FormHelperText>{errors.shippingMethod?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </CheckoutSection>

          <CheckoutSection title="Payment Method">
            <Controller
              control={control}
              name="paymentMethod"
              render={({ field }) => (
                <FormControl error={Boolean(errors.paymentMethod)}>
                  <FormLabel id="payment-method-label">Choose payment</FormLabel>
                  <RadioGroup
                    {...field}
                    aria-labelledby="payment-method-label"
                    sx={{ mt: 1 }}
                  >
                    <FormControlLabel
                      value="cash_on_delivery"
                      control={<Radio />}
                      label="Cash on Delivery"
                    />
                    <FormControlLabel
                      value="demo_card"
                      control={<Radio />}
                      label="Demo Card Payment"
                    />
                  </RadioGroup>
                  <FormHelperText>
                    Demo Card Payment never requests or processes card details.
                  </FormHelperText>
                  <FormHelperText error>{errors.paymentMethod?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </CheckoutSection>

          {hasInconsistentCurrency ? (
            <Alert severity="error" role="alert">
              This cart contains multiple currencies and cannot be submitted.
            </Alert>
          ) : null}
          {orderMutation.isError ? (
            <Alert severity="error" aria-live="assertive">
              {getOrderApiErrorMessage(orderMutation.error)} Your cart and form
              details have been preserved. Please try again.
            </Alert>
          ) : null}
        </Stack>

        <CheckoutSummary
          currency={currency}
          items={cartItems}
          shippingFee={shippingFee}
          subtotal={subtotal}
          total={total}
          totalUnits={totalUnits}
        >
          <Button
            disabled={orderMutation.isPending || hasInconsistentCurrency}
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
          >
            {orderMutation.isPending ? 'Placing Order...' : 'Place Order'}
          </Button>
          <Typography
            aria-live="polite"
            color="text.secondary"
            variant="caption"
            sx={{ display: 'block', minHeight: '1.5em', mt: 1.5 }}
          >
            {orderMutation.isPending ? 'Your order is being submitted.' : ''}
          </Typography>
        </CheckoutSummary>
      </Box>
    </Container>
  )
}

function EmptyCheckout() {
  return (
    <Container component="section" className="py-10 sm:py-14 lg:py-16">
      <Card className="mx-auto px-5 py-10 text-center sm:px-10 sm:py-14" sx={{ maxWidth: 680 }}>
        <ShoppingBagOutlinedIcon aria-hidden="true" sx={{ color: 'text.secondary', fontSize: 56 }} />
        <Typography component="h1" variant="h4" className="mt-4" sx={{ fontWeight: 800 }}>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary" className="mx-auto mt-2" sx={{ maxWidth: 480 }}>
          Add a FitLand product before starting checkout.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1.5, justifyContent: 'center', mt: 4 }}>
          <Button component={Link} to="/shop" variant="contained">Return to Shop</Button>
          <Button component={Link} to="/cart" variant="outlined">Return to Cart</Button>
        </Stack>
      </Card>
    </Container>
  )
}

function CheckoutSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <Card component="section" sx={{ minWidth: 0, p: { xs: 2.5, sm: 3 } }}>
      <Typography component="h2" variant="h5" sx={{ fontWeight: 800, mb: 2.5 }}>
        {title}
      </Typography>
      {children}
    </Card>
  )
}

function CheckoutSummary({
  children,
  currency,
  items,
  shippingFee,
  subtotal,
  total,
  totalUnits,
}: {
  children: React.ReactNode
  currency: string
  items: ReturnType<typeof selectCartItems>
  shippingFee: number
  subtotal: number
  total: number
  totalUnits: number
}) {
  return (
    <Card component="aside" aria-labelledby="checkout-summary-title" sx={{ minWidth: 0, p: { xs: 2.5, sm: 3 } }}>
      <Typography id="checkout-summary-title" component="h2" variant="h5" sx={{ fontWeight: 800 }}>
        Order summary
      </Typography>
      <Stack spacing={2} className="mt-5">
        {items.map((item) => (
          <Stack
            key={JSON.stringify([item.productId, item.selectedColor.name, item.selectedColor.hex, item.selectedSize])}
            direction="row"
            sx={{ gap: 1.5, minWidth: 0 }}
          >
            <Box
              component="img"
              src={resolveApiAssetUrl(item.image)}
              alt={`${item.name} order thumbnail`}
              sx={{ aspectRatio: '4 / 5', borderRadius: 1, flexShrink: 0, objectFit: 'cover', width: 64 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}>{item.name}</Typography>
              <Typography color="text.secondary" variant="caption" sx={{ display: 'block' }}>
                {item.selectedColor.name} / {item.selectedSize} / Qty {item.quantity}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 700 }}>
                {formatCurrency(item.unitPrice * item.quantity, item.currency)}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
      <Divider sx={{ my: 2.5 }} />
      <Stack spacing={1.25}>
        <SummaryRow label="Total units" value={String(totalUnits)} />
        <SummaryRow label="Subtotal" value={formatCurrency(subtotal, currency)} />
        <SummaryRow label="Shipping" value={shippingFee === 0 ? 'Free' : formatCurrency(shippingFee, currency)} />
        <Divider />
        <SummaryRow label="Total" value={formatCurrency(total, currency)} strong />
      </Stack>
      {children}
    </Card>
  )
}

function SummaryRow({ label, strong = false, value }: { label: string; strong?: boolean; value: string }) {
  return (
    <Stack direction="row" sx={{ alignItems: 'baseline', gap: 2, justifyContent: 'space-between', minWidth: 0 }}>
      <Typography color={strong ? 'text.primary' : 'text.secondary'} sx={{ fontWeight: strong ? 800 : 400 }}>{label}</Typography>
      <Typography sx={{ fontWeight: strong ? 800 : 700, overflowWrap: 'anywhere', textAlign: 'right' }}>{value}</Typography>
    </Stack>
  )
}

function createOrderId() {
  return `FIT-${globalThis.crypto.randomUUID()}`
}

const twoColumnFields = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
  minWidth: 0,
} as const
