import { useQuery } from '@tanstack/react-query'

import { getOrderById } from './order.api'
import { orderQueryKeys } from './order.queryKeys'

export function useOrderQuery(orderId: string) {
  return useQuery({
    queryKey: orderQueryKeys.detail(orderId),
    queryFn: ({ signal }) => getOrderById(orderId, signal),
    enabled: Boolean(orderId.trim()),
  })
}
