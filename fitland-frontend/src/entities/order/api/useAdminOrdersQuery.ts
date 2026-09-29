import { useQuery } from '@tanstack/react-query'

import { getAllOrders } from './order.api'
import { orderQueryKeys } from './order.queryKeys'

export function useAdminOrdersQuery(enabled: boolean) {
  return useQuery({
    queryKey: orderQueryKeys.admin(),
    queryFn: ({ signal }) => getAllOrders(signal),
    enabled,
  })
}
