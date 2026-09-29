import type { AuthState } from './auth.slice'

type StateWithAuth = { auth: AuthState }

export const selectCurrentUser = (state: StateWithAuth) => state.auth.user
export const selectIsAuthenticated = (state: StateWithAuth) =>
  state.auth.isAuthenticated
export const selectIsAdmin = (state: StateWithAuth) =>
  state.auth.isAuthenticated && state.auth.user?.role === 'admin'
