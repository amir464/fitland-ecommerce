import { useQuery } from '@tanstack/react-query'

import { getCustomerOrders } from './order.api'
import { orderQueryKeys } from './order.queryKeys'

export function useCustomerOrdersQuery(userId: string, email: string) {
  const normalizedEmail = email.trim().toLowerCase()

  return useQuery({
    queryKey: orderQueryKeys.customer(userId, normalizedEmail),
    queryFn: ({ signal }) => getCustomerOrders(userId, normalizedEmail, signal),
    enabled: Boolean(userId.trim() && normalizedEmail),
  })
}
