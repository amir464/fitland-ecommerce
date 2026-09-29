import { Box, Stack, Typography } from '@mui/material'

import type { ProductColor } from '@/entities/product/model/product.schema'

type ProductColorPreviewProps = {
  colors: readonly ProductColor[]
}

export function ProductColorPreview({ colors }: ProductColorPreviewProps) {
  const visibleColors = colors.slice(0, 4)
  const remainingCount = colors.length - visibleColors.length

  return (
    <Stack
      aria-label={`${colors.length} available ${colors.length === 1 ? 'color' : 'colors'}`}
      direction="row"
      spacing={0.75}
      sx={{ alignItems: 'center', flexShrink: 0, minHeight: 22, minWidth: 0 }}
    >
      {visibleColors.map((color) => (
        <Box
          key={`${color.name}-${color.hex}`}
          component="span"
          aria-label={color.name}
          title={color.name}
          sx={{
            bgcolor: color.hex,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '50%',
            display: 'inline-block',
            height: 18,
            width: 18,
          }}
        />
      ))}
      {remainingCount > 0 ? (
        <Typography color="text.secondary" variant="caption">
          +{remainingCount}
        </Typography>
      ) : null}
    </Stack>
  )
}
