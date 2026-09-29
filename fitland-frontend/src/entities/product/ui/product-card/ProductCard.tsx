import { Box, Card, CardContent, Rating, Stack, Typography } from '@mui/material'
import { Link } from 'react-router'

import type { Product } from '@/entities/product/model/product.schema'
import { ProductBadges } from '@/entities/product/ui/product-card/ProductBadges'
import { ProductColorPreview } from '@/entities/product/ui/product-card/ProductColorPreview'
import { ProductImage } from '@/entities/product/ui/product-card/ProductImage'
import { ProductPrice } from '@/entities/product/ui/product-card/ProductPrice'
import { getProductDetailsPath } from '@/shared/config/routePaths'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0]
  const isOutOfStock = product.stock === 0
  const categoryLabel = `${product.sports[0]} / ${product.category}`.toUpperCase()

  return (
    <Card
      component="article"
      className="flex h-full w-full min-w-0 flex-col overflow-hidden"
      sx={{ borderRadius: 1.5, position: 'relative' }}
    >
      <Box className="relative">
        <ProductImage
          name={product.name}
          imageUrl={primaryImage.url}
          alt={primaryImage.alt}
          isOutOfStock={isOutOfStock}
        />
        <ProductBadges
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          isNew={product.isNew}
          isBestSeller={product.isBestSeller}
        />
      </Box>

      <CardContent
        className="p-3 sm:p-5"
        sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}
      >
        <Typography
          className="line-clamp-2"
          color="text.secondary"
          variant="overline"
          sx={{
            fontSize: '0.65rem',
            fontWeight: 800,
            letterSpacing: '0.13em',
            lineHeight: 1.3,
            minHeight: '2.6em',
            overflowWrap: 'anywhere',
          }}
        >
          {categoryLabel}
        </Typography>
        <Typography
          component="h2"
          className="mt-1 line-clamp-2"
          sx={{ fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.3 }}
          style={{ minHeight: '2.6em' }}
        >
          <Box
            component={Link}
            to={getProductDetailsPath(product.id)}
            aria-label={`View ${product.name}`}
            sx={{
              color: 'text.primary',
              textDecoration: 'none',
              '&::after': {
                content: '""',
                inset: 0,
                position: 'absolute',
                zIndex: 1,
              },
              '&:focus-visible': {
                outline: 'none',
              },
              '&:focus-visible::after': {
                borderRadius: 1.5,
                outline: '3px solid',
                outlineColor: 'secondary.dark',
                outlineOffset: '-3px',
              },
            }}
          >
            {product.name}
          </Box>
        </Typography>
        <Typography
          className="mt-2 line-clamp-2"
          color="text.secondary"
          variant="body2"
          sx={{ lineHeight: 1.55, minHeight: '3.1em' }}
        >
          {product.shortDescription}
        </Typography>

        <Stack className="pt-4" spacing={1.5} sx={{ marginTop: 'auto' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: 'flex-start',
              alignItems: 'center',
              columnGap: 0.75,
              flexWrap: 'wrap',
              minHeight: { xs: 44, sm: 24 },
              minWidth: 0,
              rowGap: 0.25,
            }}
          >
            <Rating
              aria-label={`${product.rating} out of 5 stars from ${product.reviewCount} reviews`}
              value={product.rating}
              precision={0.1}
              readOnly
              size="small"
              sx={{ flexShrink: 0 }}
            />
            <Typography
              color="text.secondary"
              variant="caption"
              sx={{ whiteSpace: 'nowrap' }}
            >
              {product.rating.toFixed(1)} ({product.reviewCount})
            </Typography>
          </Stack>
          <ProductPrice
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            currency={product.currency}
          />
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              columnGap: 1,
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              minHeight: 22,
              rowGap: 0.5,
            }}
          >
            <ProductColorPreview colors={product.colors} />
            {isOutOfStock ? (
              <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700 }}>
                Unavailable
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
