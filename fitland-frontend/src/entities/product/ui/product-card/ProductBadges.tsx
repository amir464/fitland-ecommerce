import { Chip, Stack } from '@mui/material'

import { getProductDiscountPercentage } from '@/entities/product/lib/getProductDiscountPercentage'

type ProductBadgesProps = {
  price: number
  compareAtPrice: number | null
  isNew: boolean
  isBestSeller: boolean
}

export function ProductBadges({
  price,
  compareAtPrice,
  isNew,
  isBestSeller,
}: ProductBadgesProps) {
  const discount = getProductDiscountPercentage(price, compareAtPrice)
  const badges = [
    discount === null ? null : { label: `-${discount}%`, discount: true },
    isNew ? { label: 'New', discount: false } : null,
    isBestSeller ? { label: 'Best seller', discount: false } : null,
  ].filter((badge): badge is { label: string; discount: boolean } => badge !== null)

  if (badges.length === 0) {
    return null
  }

  return (
    <Stack
      className="absolute left-2 top-2 sm:left-3 sm:top-3"
      direction="row"
      sx={{
        flexWrap: 'wrap',
        gap: 0.5,
        maxWidth: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 24px)' },
        zIndex: 2,
      }}
    >
      {badges.slice(0, 3).map((badge) => (
        <Chip
          key={badge.label}
          label={badge.label}
          size="small"
          sx={{
            bgcolor: badge.discount ? 'secondary.main' : 'background.paper',
            color: 'text.primary',
            fontSize: '0.7rem',
            fontWeight: 800,
            height: 26,
            maxWidth: '100%',
            whiteSpace: 'nowrap',
            '& .MuiChip-label': {
              overflow: 'hidden',
              paddingInline: { xs: 0.75, sm: 1.5 },
              textOverflow: 'ellipsis',
            },
          }}
        />
      ))}
    </Stack>
  )
}
