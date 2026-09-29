import { queryOptions } from '@tanstack/react-query'

import { getProductById, getProducts } from './product.api'
import { productQueryKeys } from './product.queryKeys'

export function productsQueryOptions(enabled = true) {
  return queryOptions({
    queryKey: productQueryKeys.list(),
    queryFn: ({ signal }) => getProducts(signal),
    enabled,
  })
}

export function productQueryOptions(id: string) {
  const normalizedId = id.trim()

  return queryOptions({
    queryKey: productQueryKeys.detail(normalizedId),
    queryFn: ({ signal }) => getProductById(normalizedId, signal),
    enabled: normalizedId.length > 0,
  })
}
