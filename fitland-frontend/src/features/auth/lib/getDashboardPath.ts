import type { UserRole } from '@/entities/auth/model/auth.types'

export function getDashboardPath(role: UserRole) {
  return role === 'admin' ? '/admin/dashboard' : '/account/dashboard'
}
