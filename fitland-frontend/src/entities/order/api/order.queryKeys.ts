export const orderQueryKeys = {
  all: ['orders'] as const,
  admin: () => [...orderQueryKeys.all, 'admin'] as const,
  details: () => [...orderQueryKeys.all, 'detail'] as const,
  detail: (orderId: string) => [...orderQueryKeys.details(), orderId] as const,
  customer: (userId: string, email: string) =>
    [...orderQueryKeys.all, 'customer', userId, email] as const,
} as const
