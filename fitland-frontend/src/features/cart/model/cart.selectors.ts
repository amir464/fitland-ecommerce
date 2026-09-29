import {
  getAllocatedProductQuantity,
  getConservativeProductStock,
} from './cartAllocation'
import type { CartLineIdentity, CartState } from './cart.types'

type StateWithCart = {
  cart: CartState
}

function normalizeNonNegativeInteger(value: number) {
  return Number.isFinite(value)
    ? Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Math.trunc(value)))
    : 0
}

function normalizeNonNegativeNumber(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

export const selectCartItems = (state: StateWithCart) => state.cart.items

export const selectCartTotalUnits = (state: StateWithCart) =>
  selectCartItems(state).reduce((total, item) => {
    const safeQuantity = normalizeNonNegativeInteger(item.quantity)

    return Math.min(Number.MAX_SAFE_INTEGER, total + safeQuantity)
  }, 0)

export const selectCartLineCount = (state: StateWithCart) =>
  selectCartItems(state).length

export const selectCartQuantityByProductId = (
  state: StateWithCart,
  productId: CartLineIdentity['productId'],
) => getAllocatedProductQuantity(selectCartItems(state), productId)

export const selectCartProductStockLimit = (
  state: StateWithCart,
  productId: CartLineIdentity['productId'],
  currentProductStock: number,
) =>
  getConservativeProductStock(
    selectCartItems(state),
    productId,
    currentProductStock,
  )

export const selectCartRemainingStockByProductId = (
  state: StateWithCart,
  productId: CartLineIdentity['productId'],
) => {
  const items = selectCartItems(state)
  const stockLimit = getConservativeProductStock(items, productId)
  const allocatedQuantity = getAllocatedProductQuantity(items, productId)
  const safeAllocatedQuantity = Number.isFinite(allocatedQuantity)
    ? Math.max(0, Math.trunc(allocatedQuantity))
    : stockLimit

  return Math.max(0, stockLimit - safeAllocatedQuantity)
}

export const selectCartSubtotal = (state: StateWithCart) =>
  selectCartItems(state).reduce((subtotal, item) => {
    const lineSubtotal =
      normalizeNonNegativeNumber(item.unitPrice) *
      normalizeNonNegativeInteger(item.quantity)
    const safeLineSubtotal = Number.isFinite(lineSubtotal)
      ? lineSubtotal
      : Number.MAX_VALUE

    return Math.min(Number.MAX_VALUE, subtotal + safeLineSubtotal)
  }, 0)

export const selectIsCartEmpty = (state: StateWithCart) =>
  selectCartLineCount(state) === 0
