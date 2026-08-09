import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { AuthSession, SafeUser } from '@/entities/auth/model/auth.types'

export type AuthState = {
  user: SafeUser | null
  token: string | null
  isAuthenticated: boolean
}

export const loggedOutAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loggedOutAuthState,
  reducers: {
    setSession(_state, action: PayloadAction<AuthSession>) {
      return action.payload
    },
    logout() {
      return loggedOutAuthState
    },
  },
})

export const { logout, setSession } = authSlice.actions
export const authReducer = authSlice.reducer
