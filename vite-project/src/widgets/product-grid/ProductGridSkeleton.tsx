import { Typography } from '@mui/material'

import { ProductCardSkeleton } from '@/entities/product/ui/product-card/ProductCardSkeleton'
import { productGridClasses } from '@/widgets/product-grid/productGridClasses'

const skeletonKeys = Array.from({ length: 8 }, (_, index) => `product-skeleton-${index}`)

export function ProductGridSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <Typography className="sr-only">Loading products</Typography>
      <ul aria-hidden="true" className={productGridClasses}>
        {skeletonKeys.map((key) => (
          <li className="flex h-full min-w-0 w-full" key={key}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  )
}
