import { configureStore } from '@reduxjs/toolkit'

import { authReducer } from '@/features/auth/model/auth.slice'
import {
  loadPersistedAuthSession,
  savePersistedAuthSession,
} from '@/features/auth/model/authStorage'
import { addItem, cartReducer } from '@/features/cart/model/cart.slice'
import {
  loadPersistedCartItems,
  savePersistedCartItems,
} from '@/features/cart/model/cartStorage'

const hydratedCartState = loadPersistedCartItems().reduce(
  (cartState, item) => cartReducer(cartState, addItem(item)),
  cartReducer(undefined, { type: '@@cart/initialize' }),
)

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  preloadedState: {
    auth: loadPersistedAuthSession(),
    cart: hydratedCartState,
  },
})

let previousCartItems = store.getState().cart.items
let previousAuthState = store.getState().auth

store.subscribe(() => {
  const currentCartItems = store.getState().cart.items

  if (currentCartItems !== previousCartItems) {
    previousCartItems = currentCartItems
    savePersistedCartItems(currentCartItems)
  }

  const currentAuthState = store.getState().auth

  if (currentAuthState !== previousAuthState) {
    previousAuthState = currentAuthState
    savePersistedAuthSession(currentAuthState)
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
