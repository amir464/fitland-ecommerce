import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router'

import { useAppSelector } from '@/app/store/hooks'
import type { UserRole } from '@/entities/auth/model/auth.types'
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '@/features/auth/model'
import { getDashboardPath } from '@/features/auth/lib/getDashboardPath'

export function GuestOnlyRoute() {
  const user = useAppSelector(selectCurrentUser)

  if (user) {
    return <Navigate replace to={getDashboardPath(user.role)} />
  }

  return <Outlet />
}

export function ProtectedRoute({
  allowedRole,
  children,
}: {
  allowedRole: UserRole
  children?: ReactNode
}) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectCurrentUser)

  if (!isAuthenticated || !user) {
    return <Navigate replace to="/login" />
  }

  if (user.role !== allowedRole) {
    return <Navigate replace to={getDashboardPath(user.role)} />
  }

  return children ?? <Outlet />
}

export function AccountRedirect() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectCurrentUser)

  if (!isAuthenticated || !user) {
    return <Navigate replace to="/login" />
  }

  return <Navigate replace to={getDashboardPath(user.role)} />
}
