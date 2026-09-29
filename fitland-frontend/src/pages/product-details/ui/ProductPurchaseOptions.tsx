import { Box, Button, ButtonGroup, Stack, Typography } from '@mui/material'
import { useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import type { Product } from '@/entities/product/model/product.schema'
import {
  addItem,
  selectCartProductStockLimit,
  selectCartQuantityByProductId,
  type CartItem,
} from '@/features/cart/model'

type ProductPurchaseOptionsProps = {
  product: Product
}

type CartFeedback = {
  color: 'error.main' | 'success.dark' | 'warning.dark'
  message: string
}

export function ProductPurchaseOptions({ product }: ProductPurchaseOptionsProps) {
  const dispatch = useAppDispatch()
  const allocatedProductQuantity = useAppSelector((state) =>
    selectCartQuantityByProductId(state, product.id),
  )
  const productStockLimit = useAppSelector((state) =>
    selectCartProductStockLimit(state, product.id, product.stock),
  )
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(
    product.colors.length > 0 ? 0 : null,
  )
  const [selectedSize, setSelectedSize] = useState<
    Product['sizes'][number] | null
  >(null)
  const [quantity, setQuantity] = useState(product.stock > 0 ? 1 : 0)
  const [sizeError, setSizeError] = useState(false)
  const [cartFeedback, setCartFeedback] = useState<CartFeedback | null>(null)
  const isOutOfStock = product.stock === 0
  const sizeErrorId = `product-size-error-${product.id}`

  const clearConfirmation = () => {
    setCartFeedback(null)
  }

  const selectColor = (colorIndex: number) => {
    setSelectedColorIndex(colorIndex)
    clearConfirmation()
  }

  const selectSize = (size: Product['sizes'][number]) => {
    setSelectedSize(size)
    setSizeError(false)
    clearConfirmation()
  }

  const decrementQuantity = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))
    clearConfirmation()
  }

  const incrementQuantity = () => {
    setQuantity((currentQuantity) => Math.min(product.stock, currentQuantity + 1))
    clearConfirmation()
  }

  const addSelectedItemToCart = () => {
    if (isOutOfStock) {
      return
    }

    if (product.sizes.length > 0 && selectedSize === null) {
      setSizeError(true)
      setCartFeedback(null)
      return
    }

    const selectedColor =
      selectedColorIndex === null ? undefined : product.colors[selectedColorIndex]
    const primaryImage = product.images[0]
    const safeQuantity = Number.isFinite(quantity)
      ? Math.min(product.stock, Math.max(1, Math.trunc(quantity)))
      : 1
    const remainingStock = Math.max(
      0,
      productStockLimit - allocatedProductQuantity,
    )
    const acceptedQuantity = Math.min(safeQuantity, remainingStock)

    if (!selectedColor || !selectedSize || !primaryImage || safeQuantity < 1) {
      return
    }

    if (acceptedQuantity < 1) {
      setCartFeedback({
        color: 'error.main',
        message: 'All available stock for this product is already in your cart.',
      })
      return
    }

    const cartItem: CartItem = {
      productId: product.id,
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      image: primaryImage.url,
      unitPrice: product.price,
      currency: product.currency,
      selectedColor: {
        name: selectedColor.name,
        hex: selectedColor.hex,
      },
      selectedSize,
      quantity: acceptedQuantity,
      maxStock: product.stock,
    }

    dispatch(addItem(cartItem))

    if (acceptedQuantity < safeQuantity) {
      const itemLabel = acceptedQuantity === 1 ? 'item was' : 'items were'

      setCartFeedback({
        color: 'warning.dark',
        message: `Only ${acceptedQuantity} ${itemLabel} added because the stock limit was reached.`,
      })
      return
    }

    setCartFeedback({
      color: 'success.dark',
      message: 'Added to cart.',
    })
  }

  return (
    <Box sx={{ minWidth: 0 }}>
      {product.colors.length > 0 ? (
        <OptionSection title="Available colors">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, minWidth: 0 }}>
            {product.colors.map((color, colorIndex) => {
              const isSelected = selectedColorIndex === colorIndex

              return (
                <Button
                  key={`${color.name}-${color.hex}-${colorIndex}`}
                  aria-label={`${color.name} color${isSelected ? ', selected' : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => selectColor(colorIndex)}
                  variant={isSelected ? 'contained' : 'outlined'}
                  sx={{
                    bgcolor: isSelected ? 'primary.main' : 'background.paper',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    color: isSelected ? 'primary.contrastText' : 'text.primary',
                    maxWidth: '100%',
                    minWidth: 0,
                    px: 1.5,
                    '&:hover': {
                      bgcolor: isSelected ? 'primary.main' : 'action.hover',
                      borderColor: 'text.primary',
                    },
                  }}
                >
                  <Box
                    component="span"
                    aria-hidden="true"
                    sx={{
                      bgcolor: color.hex,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '50%',
                      boxShadow: 'inset 0 0 0 1px rgb(21 23 19 / 12%)',
                      flexShrink: 0,
                      height: 22,
                      mr: 0.75,
                      width: 22,
                    }}
                  />
                  <Box component="span" sx={{ overflowWrap: 'anywhere' }}>
                    {color.name}
                  </Box>
                </Button>
              )
            })}
          </Box>
        </OptionSection>
      ) : null}

      {product.sizes.length > 0 ? (
        <OptionSection title="Available sizes">
          <Box
            role="group"
            aria-label="Available sizes"
            aria-describedby={sizeError ? sizeErrorId : undefined}
            aria-invalid={sizeError}
            sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minWidth: 0 }}
          >
            {product.sizes.map((size) => {
              const isSelected = selectedSize === size

              return (
                <Button
                  key={size}
                  aria-pressed={isSelected}
                  onClick={() => selectSize(size)}
                  variant={isSelected ? 'contained' : 'outlined'}
                  sx={{
                    bgcolor: isSelected ? 'primary.main' : 'background.paper',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    color: isSelected ? 'primary.contrastText' : 'text.primary',
                    minWidth: 48,
                    px: 1.5,
                  }}
                >
                  {size}
                </Button>
              )
            })}
          </Box>
          {sizeError ? (
            <Typography
              id={sizeErrorId}
              role="alert"
              color="error.main"
              variant="body2"
              sx={{ mt: 1, overflowWrap: 'anywhere' }}
            >
              Select a size before adding this product to your cart.
            </Typography>
          ) : null}
        </OptionSection>
      ) : null}

      <OptionSection title="Quantity">
        <ButtonGroup
          aria-label="Product quantity"
          variant="outlined"
          sx={{ bgcolor: 'background.paper', maxWidth: '100%' }}
        >
          <Button
            aria-label="Decrease quantity"
            disabled={isOutOfStock || quantity <= 1}
            onClick={decrementQuantity}
            sx={{ minHeight: 44, minWidth: 44, px: 1 }}
          >
            −
          </Button>
          <Box
            aria-live="polite"
            aria-label={`Quantity ${isOutOfStock ? 0 : quantity}`}
            role="status"
            sx={{
              alignItems: 'center',
              borderBlock: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              fontWeight: 800,
              justifyContent: 'center',
              minHeight: 44,
              minWidth: 52,
              px: 1,
            }}
          >
            {isOutOfStock ? 0 : quantity}
          </Box>
          <Button
            aria-label="Increase quantity"
            disabled={isOutOfStock || quantity >= product.stock}
            onClick={incrementQuantity}
            sx={{ minHeight: 44, minWidth: 44, px: 1 }}
          >
            +
          </Button>
        </ButtonGroup>
      </OptionSection>

      <Box
        aria-label="Current product options"
        sx={{
          bgcolor: 'action.hover',
          borderRadius: 1,
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 0.75, sm: 1.5 },
          minWidth: 0,
          px: 2,
          py: 1.5,
        }}
      >
        {selectedColorIndex !== null && product.colors[selectedColorIndex] ? (
          <SummaryItem
            label="Color"
            value={product.colors[selectedColorIndex].name}
          />
        ) : null}
        <SummaryItem label="Size" value={selectedSize ?? 'Select a size'} />
        {!isOutOfStock ? <SummaryItem label="Quantity" value={String(quantity)} /> : null}
      </Box>

      <Button
        type="button"
        variant="contained"
        disabled={isOutOfStock}
        onClick={addSelectedItemToCart}
        sx={{
          minHeight: 44,
          mt: 2,
          px: 4,
          width: { xs: '100%', sm: 'auto' },
          '&:focus-visible': {
            outline: '3px solid',
            outlineColor: 'secondary.dark',
            outlineOffset: 2,
          },
        }}
      >
        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </Button>

      <Typography
        aria-live="polite"
        role="status"
        color={cartFeedback?.color ?? 'text.secondary'}
        variant="body2"
        sx={{ minHeight: '1.5em', mt: 1, overflowWrap: 'anywhere' }}
      >
        {cartFeedback?.message ?? ''}
      </Typography>
    </Box>
  )
}

function OptionSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <Box component="section" className="mb-7" sx={{ minWidth: 0 }}>
      <Typography
        component="h2"
        className="mb-3"
        sx={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <Stack component="span" direction="row" sx={{ columnGap: 0.5, minWidth: 0 }}>
      <Typography component="span" color="text.secondary" variant="caption">
        {label}:
      </Typography>
      <Typography component="span" variant="caption" sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}>
        {value}
      </Typography>
    </Stack>
  )
}
