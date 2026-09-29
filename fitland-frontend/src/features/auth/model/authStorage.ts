import type { SafeUser, UserRole } from '@/entities/auth/model/auth.types'

import { loggedOutAuthState, type AuthState } from './auth.slice'

export const AUTH_STORAGE_KEY = 'fitland-auth-session-v1'

export function loadPersistedAuthSession(): AuthState {
  if (typeof window === 'undefined') {
    return loggedOutAuthState
  }

  try {
    const value: unknown = JSON.parse(
      window.localStorage.getItem(AUTH_STORAGE_KEY) ?? 'null',
    )

    if (!isAuthState(value)) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
      return loggedOutAuthState
    }

    return value
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return loggedOutAuthState
  }
}

export function savePersistedAuthSession(state: AuthState) {
  if (typeof window === 'undefined') {
    return
  }

  if (!state.isAuthenticated) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state))
}

function isAuthState(value: unknown): value is AuthState {
  if (!isRecord(value)) return false
  if (value.isAuthenticated !== true) return false
  if (typeof value.token !== 'string' || value.token.length === 0) return false
  return isSafeUser(value.user)
}

function isSafeUser(value: unknown): value is SafeUser {
  if (!isRecord(value) || 'password' in value) return false

  return (
    ['id', 'firstName', 'lastName', 'email', 'createdAt'].every(
      (key) => typeof value[key] === 'string' && value[key].length > 0,
    ) && isUserRole(value.role)
  )
}

function isUserRole(value: unknown): value is UserRole {
  return value === 'customer' || value === 'admin'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
