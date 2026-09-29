import { Stack, Typography } from '@mui/material'

import { formatCurrency } from '@/shared/lib/formatCurrency'

type ProductPriceProps = {
  price: number
  compareAtPrice: number | null
  currency: string
}

export function ProductPrice({
  price,
  compareAtPrice,
  currency,
}: ProductPriceProps) {
  const hasDiscount = compareAtPrice !== null && compareAtPrice > price

  return (
    <Stack
      direction="row"
      sx={{
        alignContent: 'flex-start',
        alignItems: 'baseline',
        columnGap: 1,
        flexWrap: 'wrap',
        minHeight: { xs: 48, sm: 28 },
        minWidth: 0,
        rowGap: 0,
      }}
    >
      <Typography
        aria-label={hasDiscount ? `Current price ${formatCurrency(price, currency)}` : undefined}
        sx={{
          fontSize: { xs: '0.95rem', sm: '1.05rem' },
          fontWeight: 800,
          whiteSpace: 'nowrap',
        }}
      >
        {formatCurrency(price, currency)}
      </Typography>
      {hasDiscount ? (
        <Typography
          aria-label={`Original price ${formatCurrency(compareAtPrice, currency)}`}
          color="text.secondary"
          variant="body2"
          sx={{ textDecoration: 'line-through', whiteSpace: 'nowrap' }}
        >
          {formatCurrency(compareAtPrice, currency)}
        </Typography>
      ) : null}
    </Stack>
  )
}
