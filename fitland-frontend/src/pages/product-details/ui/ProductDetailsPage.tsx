import {
  Alert,
  Box,
  Chip,
  Container,
  Divider,
  Rating,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { useParams } from 'react-router'

import { getProductDiscountPercentage } from '@/entities/product/lib/getProductDiscountPercentage'
import { useProductQuery } from '@/entities/product/api/useProductQuery'
import { getApiErrorMessage } from '@/shared/api/getApiErrorMessage'
import { resolveApiAssetUrl } from '@/shared/api/resolveApiAssetUrl'
import { formatCurrency } from '@/shared/lib/formatCurrency'

import { ProductPurchaseOptions } from './ProductPurchaseOptions'

export function Component() {
  const { productId: routeProductId } = useParams<{ productId: string }>()
  const productId = routeProductId?.trim() ?? ''
  const productQuery = useProductQuery(productId)

  if (!productId) {
    return (
      <Container component="main" className="py-12 sm:py-16">
        <Alert severity="error" sx={{ maxWidth: 720 }}>
          A product ID is required to load this product.
        </Alert>
      </Container>
    )
  }

  if (productQuery.isPending) {
    return (
      <Container
        component="main"
        aria-busy="true"
        aria-label="Loading product"
        className="py-12 sm:py-16"
      >
        <Stack spacing={2} sx={{ maxWidth: 560 }}>
          <Skeleton
            variant="rectangular"
            sx={{ aspectRatio: '4 / 5', borderRadius: 1.5, width: '100%' }}
          />
          <Skeleton width="35%" />
          <Skeleton height={48} width="75%" />
          <Skeleton width="45%" />
        </Stack>
      </Container>
    )
  }

  if (productQuery.isError) {
    return (
      <Container component="main" className="py-12 sm:py-16">
        <Alert severity="error" sx={{ maxWidth: 720 }}>
          {getApiErrorMessage(productQuery.error)}
        </Alert>
      </Container>
    )
  }

  const product = productQuery.data
  const mainImage = product.images[0]
  const thumbnailImages = product.images.slice(1)
  const discountPercentage = getProductDiscountPercentage(
    product.price,
    product.compareAtPrice,
  )

  return (
    <Container component="main" className="py-8 sm:py-12 lg:py-16">
      <Box
        component="article"
        sx={{
          display: 'grid',
          gap: { xs: 4, sm: 5, lg: 7 },
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1.08fr) minmax(0, 0.92fr)' },
          minWidth: 0,
          width: '100%',
        }}
      >
        <Box component="section" aria-label="Product images" sx={{ minWidth: 0 }}>
          <Box
            component="img"
            src={resolveApiAssetUrl(mainImage.url)}
            alt={mainImage.alt}
            fetchPriority="high"
            decoding="async"
            sx={{
              aspectRatio: '4 / 5',
              bgcolor: 'action.hover',
              borderRadius: 1.5,
              display: 'block',
              objectFit: 'cover',
              width: '100%',
            }}
          />

          {thumbnailImages.length > 0 ? (
            <Box
              aria-label="Additional product images"
              className="mt-3 sm:mt-4"
              sx={{
                display: 'grid',
                gap: { xs: 1, sm: 1.5 },
                gridTemplateColumns: 'repeat(auto-fit, minmax(64px, 88px))',
                minWidth: 0,
              }}
            >
              {thumbnailImages.map((image) => (
                <Box
                  key={image.id}
                  component="img"
                  src={resolveApiAssetUrl(image.url)}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  sx={{
                    aspectRatio: '4 / 5',
                    bgcolor: 'action.hover',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    display: 'block',
                    objectFit: 'cover',
                    width: '100%',
                  }}
                />
              ))}
            </Box>
          ) : null}
        </Box>

        <Stack component="section" spacing={0} sx={{ minWidth: 0 }}>
          <Stack
            direction="row"
            sx={{ columnGap: 1, flexWrap: 'wrap', rowGap: 0.5 }}
          >
            <Typography sx={eyebrowStyles}>{product.brand}</Typography>
            <Typography aria-hidden="true" color="text.secondary">/</Typography>
            <Typography sx={eyebrowStyles}>{product.category}</Typography>
            <Typography aria-hidden="true" color="text.secondary">/</Typography>
            <Typography sx={eyebrowStyles}>{product.sports.join(' / ')}</Typography>
          </Stack>

          <Typography
            component="h1"
            className="mt-3"
            sx={{
              fontSize: { xs: '2rem', sm: '2.25rem', lg: '2.75rem' },
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.08,
              overflowWrap: 'anywhere',
            }}
          >
            {product.name}
          </Typography>
          <Typography
            className="mt-4"
            color="text.secondary"
            sx={{ fontSize: { xs: '1rem', lg: '1.1rem' }, lineHeight: 1.7, maxWidth: '62ch' }}
          >
            {product.shortDescription}
          </Typography>

          <Stack
            className="mt-5"
            direction="row"
            sx={{ alignItems: 'center', columnGap: 1, flexWrap: 'wrap', rowGap: 0.5 }}
          >
            <Rating
              aria-label={`${product.rating} out of 5 stars from ${product.reviewCount} reviews`}
              value={product.rating}
              precision={0.1}
              readOnly
              size="small"
            />
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700 }}>
              {product.rating.toFixed(1)}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
              ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
            </Typography>
          </Stack>

          <Stack
            className="mt-6"
            direction="row"
            sx={{ alignItems: 'baseline', columnGap: 1.5, flexWrap: 'wrap', rowGap: 0.5 }}
          >
            <Typography
              aria-label={discountPercentage ? `Current price ${formatCurrency(product.price, product.currency)}` : undefined}
              sx={{ fontSize: { xs: '1.6rem', lg: '2rem' }, fontWeight: 800, whiteSpace: 'nowrap' }}
            >
              {formatCurrency(product.price, product.currency)}
            </Typography>
            {product.compareAtPrice !== null ? (
              <Typography
                aria-label={`Original price ${formatCurrency(product.compareAtPrice, product.currency)}`}
                color="text.secondary"
                sx={{ fontSize: { xs: '1rem', lg: '1.125rem' }, textDecoration: 'line-through', whiteSpace: 'nowrap' }}
              >
                {formatCurrency(product.compareAtPrice, product.currency)}
              </Typography>
            ) : null}
            {discountPercentage !== null ? (
              <Chip
                label={`${discountPercentage}% off`}
                size="small"
                sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', fontWeight: 800 }}
              />
            ) : null}
          </Stack>

          <Typography
            className="mt-3"
            color={product.stock > 0 ? 'success.dark' : 'error.dark'}
            sx={{ fontSize: '0.9rem', fontWeight: 800 }}
          >
            {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
          </Typography>

          <Divider className="my-7 sm:my-8" />

          <ProductPurchaseOptions
            key={`${product.id}-${product.stock}`}
            product={product}
          />

          <Box
            sx={{
              display: 'grid',
              gap: { xs: 3, sm: 4 },
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
            }}
          >
            {product.materials.length > 0 ? (
              <InfoSection title="Materials">
                <Box component="ul" sx={listStyles}>
                  {product.materials.map((material) => <li key={material}>{material}</li>)}
                </Box>
              </InfoSection>
            ) : null}
            {product.features.length > 0 ? (
              <InfoSection title="Features">
                <Box component="ul" sx={listStyles}>
                  {product.features.map((feature) => <li key={feature}>{feature}</li>)}
                </Box>
              </InfoSection>
            ) : null}
          </Box>

          <Divider className="mb-4 mt-7" />
          <Typography color="text.secondary" variant="body2" sx={{ overflowWrap: 'anywhere' }}>
            SKU: <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>{product.sku}</Box>
          </Typography>
        </Stack>
      </Box>
    </Container>
  )
}

const eyebrowStyles = {
  color: 'text.secondary',
  fontSize: { xs: '0.8rem', sm: '0.85rem' },
  fontWeight: 700,
  letterSpacing: '0.06em',
  overflowWrap: 'anywhere',
  textTransform: 'uppercase',
} as const

const listStyles = {
  color: 'text.secondary',
  lineHeight: 1.7,
  margin: 0,
  paddingLeft: 2.5,
  overflowWrap: 'anywhere',
} as const

function InfoSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <Box component="section" className="mb-7" sx={{ minWidth: 0 }}>
      <Typography component="h2" className="mb-3" sx={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}
