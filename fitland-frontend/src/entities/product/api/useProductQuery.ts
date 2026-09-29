import { useQuery } from '@tanstack/react-query'

import { productQueryOptions } from './product.queries'

export function useProductQuery(id: string) {
  return useQuery(productQueryOptions(id))
}
