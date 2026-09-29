import { useMutation } from '@tanstack/react-query'

import { createOrder } from './order.api'

export function useCreateOrderMutation() {
  return useMutation({ mutationFn: createOrder })
}
