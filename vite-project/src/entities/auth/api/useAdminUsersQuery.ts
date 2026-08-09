import { useQuery } from '@tanstack/react-query'

import { getSafeUsers } from './auth.api'
import { userQueryKeys } from './user.queryKeys'

export function useAdminUsersQuery(enabled: boolean) {
  return useQuery({
    queryKey: userQueryKeys.admin(),
    queryFn: ({ signal }) => getSafeUsers(signal),
    enabled,
  })
}
