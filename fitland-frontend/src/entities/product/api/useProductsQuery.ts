import { useQuery } from '@tanstack/react-query'

import { productsQueryOptions } from './product.queries'

export function useProductsQuery(enabled = true) {
  return useQuery(productsQueryOptions(enabled))
}
