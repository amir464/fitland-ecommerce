import {
  Alert,
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material'

import { useProductsQuery } from '@/entities/product/api/useProductsQuery'
import { getApiErrorMessage } from '@/shared/api/getApiErrorMessage'
import { ProductGrid } from '@/widgets/product-grid/ProductGrid'
import { ProductGridSkeleton } from '@/widgets/product-grid/ProductGridSkeleton'

export function Component() {
  const productsQuery = useProductsQuery()

  return (
    <Container component="main" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-3xl">
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ fontWeight: 700, letterSpacing: '0.16em' }}
        >
          SHOP FITLAND
        </Typography>
        <Typography component="h1" variant="h2" className="mt-3">
          Performance essentials
        </Typography>
        <Typography className="mt-5 max-w-2xl" color="text.secondary">
          Purpose-built sportswear with considered materials, technical comfort,
          and a refined FitLand point of view.
        </Typography>
        {productsQuery.isSuccess ? (
          <Typography className="mt-5" color="text.secondary" variant="body2">
            {productsQuery.data.length} products
          </Typography>
        ) : null}
      </div>

      {productsQuery.isPending ? (
        <Box className="mt-10">
          <ProductGridSkeleton />
        </Box>
      ) : null}

      {productsQuery.isError ? (
        <Alert
          className="mt-10 sm:mt-12"
          severity="error"
          action={
            <Button
              color="inherit"
              disabled={productsQuery.isFetching}
              onClick={() => void productsQuery.refetch()}
              size="small"
            >
              Retry
            </Button>
          }
          sx={{ maxWidth: 760 }}
        >
          {getApiErrorMessage(productsQuery.error)}
        </Alert>
      ) : null}

      {productsQuery.isSuccess && productsQuery.data.length === 0 ? (
        <Box
          className="mt-10 max-w-2xl border border-slate-300 bg-white p-8 sm:p-10"
          sx={{ borderRadius: 1.5 }}
        >
          <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>
            No products available
          </Typography>
          <Typography className="mt-2" color="text.secondary">
            The FitLand catalog is currently empty. Please check back soon.
          </Typography>
        </Box>
      ) : null}

      {productsQuery.isSuccess && productsQuery.data.length > 0 ? (
        <Box className="mt-8 sm:mt-10">
          <ProductGrid products={productsQuery.data} />
        </Box>
      ) : null}
    </Container>
  )
}
