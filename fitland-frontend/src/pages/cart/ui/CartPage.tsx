import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import {
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeItem,
  selectCartItems,
  selectCartRemainingStockByProductId,
  selectCartSubtotal,
  selectCartTotalUnits,
  type CartItem,
} from '@/features/cart/model'
import { resolveApiAssetUrl } from '@/shared/api/resolveApiAssetUrl'
import {
  CHECKOUT_PATH,
  getProductDetailsPath,
} from '@/shared/config/routePaths'
import { formatCurrency } from '@/shared/lib/formatCurrency'

export function Component() {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectCartItems)
  const totalUnits = useAppSelector(selectCartTotalUnits)
  const subtotal = useAppSelector(selectCartSubtotal)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)

  const confirmClearCart = () => {
    dispatch(clearCart())
    setClearDialogOpen(false)
  }

  return (
    <Container component="section" className="py-10 sm:py-14 lg:py-16">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 2, justifyContent: 'space-between' }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontWeight: 700, letterSpacing: '0.16em' }}
          >
            YOUR BAG
          </Typography>
          <Typography component="h1" variant="h2" className="mt-2">
            Shopping Cart
          </Typography>
          <Typography className="mt-3" color="text.secondary">
            {cartItems.length === 0
              ? 'Your selected FitLand gear will appear here.'
              : `${totalUnits} ${totalUnits === 1 ? 'unit' : 'units'} across ${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'}.`}
          </Typography>
        </Box>
        {cartItems.length > 0 ? (
          <Button
            color="error"
            onClick={() => setClearDialogOpen(true)}
            startIcon={<DeleteOutlineRoundedIcon />}
            sx={{ flexShrink: 0, '&:focus-visible': focusStyles }}
            variant="outlined"
          >
            Clear Cart
          </Button>
        ) : null}
      </Stack>

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <Box
          className="mt-8 sm:mt-10"
          sx={{
            alignItems: 'start',
            display: 'grid',
            gap: { xs: 3, md: 4 },
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              md: 'minmax(0, 1fr) minmax(260px, 340px)',
            },
            minWidth: 0,
          }}
        >
          <Stack component="section" aria-label="Cart items" spacing={2}>
            {cartItems.map((item) => (
              <CartLineItem
                key={JSON.stringify([
                  item.productId,
                  item.selectedColor?.name,
                  item.selectedColor?.hex,
                  item.selectedSize,
                ])}
                item={item}
              />
            ))}
          </Stack>
          <OrderSummary
            currency={cartItems[0]?.currency ?? 'USD'}
            subtotal={subtotal}
            totalUnits={totalUnits}
          />
        </Box>
      )}

      <Dialog
        aria-describedby="clear-cart-dialog-description"
        aria-labelledby="clear-cart-dialog-title"
        fullWidth
        maxWidth="xs"
        onClose={() => setClearDialogOpen(false)}
        open={clearDialogOpen}
      >
        <DialogTitle id="clear-cart-dialog-title">Clear your cart</DialogTitle>
        <DialogContent>
          <DialogContentText id="clear-cart-dialog-description">
            All items and selected variants will be removed from your cart.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ flexWrap: 'wrap', gap: 1, px: 3, pb: 3 }}>
          <Button
            autoFocus
            onClick={() => setClearDialogOpen(false)}
            sx={{ '&:focus-visible': focusStyles }}
          >
            Cancel
          </Button>
          <Button
            color="error"
            onClick={confirmClearCart}
            sx={{ '&:focus-visible': focusStyles }}
            variant="contained"
          >
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

function EmptyCart() {
  return (
    <Card
      className="mt-8 px-5 py-10 text-center sm:mt-10 sm:px-10 sm:py-14"
      sx={{ mx: 'auto', maxWidth: 680 }}
    >
      <ShoppingBagOutlinedIcon
        aria-hidden="true"
        sx={{ color: 'text.secondary', fontSize: 56 }}
      />
      <Typography component="h2" variant="h5" className="mt-4" sx={{ fontWeight: 800 }}>
        Your cart is empty
      </Typography>
      <Typography color="text.secondary" className="mx-auto mt-2" sx={{ maxWidth: 460 }}>
        Explore FitLand performance essentials and add your preferred color and size.
      </Typography>
      <Button
        component={Link}
        to="/shop"
        variant="contained"
        className="mt-6"
        sx={{ '&:focus-visible': focusStyles }}
      >
        Continue Shopping
      </Button>
    </Card>
  )
}

function CartLineItem({ item }: { item: CartItem }) {
  const dispatch = useAppDispatch()
  const remainingProductStock = useAppSelector((state) =>
    selectCartRemainingStockByProductId(state, item.productId),
  )
  const productPath = getProductDetailsPath(item.productId)
  const safeQuantity = normalizeQuantity(item.quantity)
  const safeUnitPrice = normalizeMoney(item.unitPrice)
  const lineSubtotal = normalizeMoney(safeUnitPrice * safeQuantity)
  const colorName = item.selectedColor?.name?.trim() || 'Not specified'
  const colorHex = item.selectedColor?.hex?.trim()
  const selectedSize = item.selectedSize || 'Not specified'
  const variantLabel = `${colorName}, size ${selectedSize}`
  const lineIdentity = {
    productId: item.productId,
    selectedColor: {
      name: item.selectedColor.name,
      hex: item.selectedColor.hex,
    },
    selectedSize: item.selectedSize,
  }
  const incrementDisabled = remainingProductStock < 1

  return (
    <Card
      component="article"
      sx={{
        display: 'grid',
        gap: { xs: 2, sm: 2.5 },
        gridTemplateColumns: {
          xs: '88px minmax(0, 1fr)',
          sm: '120px minmax(0, 1fr) auto',
        },
        minWidth: 0,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Box
        component={Link}
        to={productPath}
        aria-label={`View ${item.name}`}
        sx={{ borderRadius: 1, display: 'block', minWidth: 0, '&:focus-visible': focusStyles }}
      >
        <Box
          component="img"
          src={resolveApiAssetUrl(item.image)}
          alt={`${item.name} cart thumbnail`}
          loading="lazy"
          decoding="async"
          sx={{
            aspectRatio: '4 / 5',
            bgcolor: 'action.hover',
            borderRadius: 1,
            display: 'block',
            objectFit: 'cover',
            width: '100%',
          }}
        />
      </Box>

      <Stack spacing={1} sx={{ minWidth: 0 }}>
        <Typography
          component={Link}
          to={productPath}
          color="text.primary"
          sx={{
            fontSize: { xs: '1rem', sm: '1.1rem' },
            fontWeight: 800,
            overflowWrap: 'anywhere',
            textDecoration: 'none',
            width: 'fit-content',
            '&:focus-visible': focusStyles,
          }}
        >
          {item.name}
        </Typography>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75, minWidth: 0 }}>
          {colorHex ? (
            <Box
              component="span"
              aria-hidden="true"
              sx={{
                bgcolor: colorHex,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '50%',
                flexShrink: 0,
                height: 18,
                width: 18,
              }}
            />
          ) : null}
          <Typography color="text.secondary" variant="body2" sx={{ overflowWrap: 'anywhere' }}>
            Color: {colorName}
          </Typography>
        </Stack>
        <Typography color="text.secondary" variant="body2">
          Size: {selectedSize}
        </Typography>
        <Box sx={{ minWidth: 0 }}>
          <Typography color="text.secondary" variant="caption">
            Quantity
          </Typography>
          <Stack
            direction="row"
            sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 0.5, minWidth: 0 }}
          >
            <ButtonGroup
              aria-label={`Quantity controls for ${item.name}, ${variantLabel}`}
              variant="outlined"
              sx={{ bgcolor: 'background.paper', maxWidth: '100%' }}
            >
              <Button
                aria-label={`Decrease quantity of ${item.name}, ${variantLabel}`}
                disabled={safeQuantity <= 1}
                onClick={() => dispatch(decrementQuantity(lineIdentity))}
                sx={{ minHeight: 44, minWidth: 44, px: 1 }}
              >
                <RemoveRoundedIcon fontSize="small" />
              </Button>
              <Box
                aria-label={`Current quantity ${safeQuantity}`}
                aria-live="polite"
                role="status"
                sx={{
                  alignItems: 'center',
                  borderBlock: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  fontWeight: 800,
                  justifyContent: 'center',
                  minHeight: 44,
                  minWidth: 48,
                  px: 1,
                }}
              >
                {safeQuantity}
              </Box>
              <Button
                aria-label={
                  incrementDisabled
                    ? `Increase quantity of ${item.name}, ${variantLabel}. Stock limit reached`
                    : `Increase quantity of ${item.name}, ${variantLabel}`
                }
                disabled={incrementDisabled}
                onClick={() => dispatch(incrementQuantity(lineIdentity))}
                title={incrementDisabled ? 'Product stock limit reached' : undefined}
                sx={{ minHeight: 44, minWidth: 44, px: 1 }}
              >
                <AddRoundedIcon fontSize="small" />
              </Button>
            </ButtonGroup>
            <Button
              aria-label={`Remove ${item.name}, ${variantLabel} from cart`}
              color="error"
              onClick={() => dispatch(removeItem(lineIdentity))}
              size="small"
              startIcon={<DeleteOutlineRoundedIcon />}
              sx={{ minHeight: 44, '&:focus-visible': focusStyles }}
              variant="text"
            >
              Remove
            </Button>
          </Stack>
          {incrementDisabled ? (
            <Typography
              color="text.secondary"
              variant="caption"
              sx={{ display: 'block', mt: 0.75, overflowWrap: 'anywhere' }}
            >
              Product stock limit reached.
            </Typography>
          ) : null}
        </Box>
        <Typography variant="body2">
          Unit price: {formatCurrency(safeUnitPrice, item.currency)}
        </Typography>
      </Stack>

      <Box
        sx={{
          gridColumn: { xs: '1 / -1', sm: 'auto' },
          minWidth: 0,
          textAlign: { xs: 'left', sm: 'right' },
        }}
      >
        <Typography color="text.secondary" variant="caption">
          Line subtotal
        </Typography>
        <Typography sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}>
          {formatCurrency(lineSubtotal, item.currency)}
        </Typography>
      </Box>
    </Card>
  )
}

function OrderSummary({
  currency,
  subtotal,
  totalUnits,
}: {
  currency: string
  subtotal: number
  totalUnits: number
}) {
  return (
    <Card component="aside" aria-labelledby="order-summary-title" sx={{ minWidth: 0, p: { xs: 2.5, sm: 3 } }}>
      <Typography id="order-summary-title" component="h2" variant="h5" sx={{ fontWeight: 800 }}>
        Order summary
      </Typography>
      <Stack spacing={1.5} className="mt-5">
        <SummaryRow label="Total units" value={String(totalUnits)} />
        <Divider />
        <SummaryRow label="Subtotal" value={formatCurrency(subtotal, currency)} strong />
      </Stack>
      <Button
        component={Link}
        fullWidth
        to={CHECKOUT_PATH}
        variant="contained"
        sx={{ mt: 3 }}
      >
        Proceed to Checkout
      </Button>
    </Card>
  )
}

function SummaryRow({
  label,
  strong = false,
  value,
}: {
  label: string
  strong?: boolean
  value: string
}) {
  return (
    <Stack direction="row" sx={{ alignItems: 'baseline', gap: 2, justifyContent: 'space-between', minWidth: 0 }}>
      <Typography color={strong ? 'text.primary' : 'text.secondary'} sx={{ fontWeight: strong ? 800 : 400 }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: strong ? 800 : 700, overflowWrap: 'anywhere', textAlign: 'right' }}>
        {value}
      </Typography>
    </Stack>
  )
}

function normalizeQuantity(quantity: number) {
  return Number.isFinite(quantity)
    ? Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Math.trunc(quantity)))
    : 0
}

function normalizeMoney(amount: number) {
  return Number.isFinite(amount) ? Math.max(0, amount) : 0
}

const focusStyles = {
  outline: '3px solid',
  outlineColor: 'secondary.dark',
  outlineOffset: 2,
} as const
