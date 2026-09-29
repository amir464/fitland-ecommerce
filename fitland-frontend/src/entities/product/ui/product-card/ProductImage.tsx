import { Box, Typography } from '@mui/material'
import { useState } from 'react'

import { resolveApiAssetUrl } from '@/shared/api/resolveApiAssetUrl'

type ProductImageProps = {
  name: string
  imageUrl: string
  alt: string
  isOutOfStock: boolean
}

export function ProductImage({
  name,
  imageUrl,
  alt,
  isOutOfStock,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false)
  const resolvedImageUrl = resolveApiAssetUrl(imageUrl)

  return (
    <Box
      className="relative aspect-[4/5] overflow-hidden"
      sx={{ bgcolor: 'action.hover' }}
    >
      {hasError ? (
        <Box
          className="flex h-full flex-col items-center justify-center p-6 text-center"
          role="img"
          aria-label={`${alt}. Image unavailable.`}
        >
          <Typography
            variant="overline"
            sx={{ fontWeight: 800, letterSpacing: '0.2em' }}
          >
            FITLAND
          </Typography>
          <Typography className="mt-3" sx={{ fontWeight: 700 }}>
            {name}
          </Typography>
          <Typography className="mt-2" color="text.secondary" variant="caption">
            Image unavailable
          </Typography>
        </Box>
      ) : (
        <Box
          component="img"
          src={resolvedImageUrl}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          className="block h-full w-full object-cover object-center"
        />
      )}

      {isOutOfStock ? (
        <Box className="absolute inset-0 flex items-center justify-center bg-white/35">
          <Typography
            className="rounded-sm bg-fitland-charcoal px-3 py-1.5 text-white"
            variant="caption"
            sx={{ fontWeight: 700 }}
          >
            Out of stock
          </Typography>
        </Box>
      ) : null}
    </Box>
  )
}
