import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import {
  getAllocatedProductQuantity,
  getConservativeProductStock,
} from './cartAllocation'
import { isSameCartLine } from './cartLineIdentity'
import type {
  CartItem,
  CartLineIdentity,
  CartState,
  SubmittedCartLine,
} from './cart.types'

const initialState: CartState = {
  items: [],
}

function normalizeMaxStock(maxStock: number) {
  if (!Number.isFinite(maxStock)) {
    return 0
  }

  return Math.max(0, Math.trunc(maxStock))
}

function normalizeQuantity(quantity: number, maxStock: number) {
  return Math.min(maxStock, Math.max(1, Math.trunc(quantity)))
}

function restoreProductAllocation(
  items: CartItem[],
  productId: CartLineIdentity['productId'],
  stockLimit: number,
) {
  let remainingStock = stockLimit

  for (let index = 0; index < items.length; ) {
    const item = items[index]

    if (item.productId !== productId) {
      index += 1
      continue
    }

    if (remainingStock < 1) {
      items.splice(index, 1)
      continue
    }

    const safeQuantity = Number.isFinite(item.quantity)
      ? Math.max(1, Math.trunc(item.quantity))
      : 1

    item.maxStock = stockLimit
    item.quantity = Math.min(safeQuantity, remainingStock)
    remainingStock -= item.quantity
    index += 1
  }
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const incomingItem = action.payload
      const maxStock = normalizeMaxStock(incomingItem.maxStock)

      if (maxStock < 1) {
        return
      }

      const productStock = getConservativeProductStock(
        state.items,
        incomingItem.productId,
        maxStock,
      )

      restoreProductAllocation(
        state.items,
        incomingItem.productId,
        productStock,
      )

      const incomingQuantity = Number.isFinite(incomingItem.quantity)
        ? normalizeQuantity(incomingItem.quantity, productStock)
        : 1
      const productQuantity = getAllocatedProductQuantity(
        state.items,
        incomingItem.productId,
      )
      const remainingStock = productStock - productQuantity

      if (remainingStock < 1) {
        return
      }

      const existingItem = state.items.find((item) =>
        isSameCartLine(item, incomingItem),
      )

      if (existingItem) {
        existingItem.quantity += Math.min(incomingQuantity, remainingStock)
        return
      }

      state.items.push({
        ...incomingItem,
        selectedColor: { ...incomingItem.selectedColor },
        quantity: Math.min(incomingQuantity, remainingStock),
        maxStock: productStock,
      })
    },
    removeItem(state, action: PayloadAction<CartLineIdentity>) {
      const productStock = getConservativeProductStock(
        state.items,
        action.payload.productId,
      )

      state.items = state.items.filter(
        (item) => !isSameCartLine(item, action.payload),
      )

      restoreProductAllocation(
        state.items,
        action.payload.productId,
        productStock,
      )
    },
    setQuantity(
      state,
      action: PayloadAction<CartLineIdentity & { quantity: number }>,
    ) {
      if (!Number.isFinite(action.payload.quantity)) {
        return
      }

      const item = state.items.find((cartItem) =>
        isSameCartLine(cartItem, action.payload),
      )

      if (item) {
        const productId = item.productId
        const productStock = getConservativeProductStock(
          state.items,
          productId,
        )

        restoreProductAllocation(state.items, productId, productStock)

        const currentItem = state.items.find((cartItem) =>
          isSameCartLine(cartItem, action.payload),
        )
        const otherVariantQuantity = getAllocatedProductQuantity(
          state.items,
          productId,
          action.payload,
        )
        const availableForLine = productStock - otherVariantQuantity

        if (currentItem && availableForLine >= 1) {
          currentItem.quantity = normalizeQuantity(
            action.payload.quantity,
            availableForLine,
          )
        }
      }
    },
    incrementQuantity(state, action: PayloadAction<CartLineIdentity>) {
      const item = state.items.find((cartItem) =>
        isSameCartLine(cartItem, action.payload),
      )

      if (item) {
        const productId = item.productId
        const productStock = getConservativeProductStock(
          state.items,
          productId,
        )

        restoreProductAllocation(state.items, productId, productStock)

        const currentItem = state.items.find((cartItem) =>
          isSameCartLine(cartItem, action.payload),
        )
        const productQuantity = getAllocatedProductQuantity(
          state.items,
          productId,
        )

        if (currentItem && productQuantity < productStock) {
          currentItem.quantity += 1
        }
      }
    },
    decrementQuantity(state, action: PayloadAction<CartLineIdentity>) {
      const item = state.items.find((cartItem) =>
        isSameCartLine(cartItem, action.payload),
      )

      if (item) {
        const productId = item.productId
        const productStock = getConservativeProductStock(
          state.items,
          productId,
        )

        restoreProductAllocation(state.items, productId, productStock)

        const currentItem = state.items.find((cartItem) =>
          isSameCartLine(cartItem, action.payload),
        )

        if (currentItem) {
          currentItem.quantity = Math.max(1, currentItem.quantity - 1)
        }
      }
    },
    removeSubmittedItems(
      state,
      action: PayloadAction<readonly SubmittedCartLine[]>,
    ) {
      for (const submittedItem of action.payload) {
        if (!Number.isFinite(submittedItem.quantity)) {
          continue
        }

        const submittedQuantity = Math.trunc(submittedItem.quantity)

        if (submittedQuantity < 1) {
          continue
        }

        const currentItemIndex = state.items.findIndex((item) =>
          isSameCartLine(item, submittedItem),
        )

        if (currentItemIndex === -1) {
          continue
        }

        const currentItem = state.items[currentItemIndex]

        if (currentItem.quantity > submittedQuantity) {
          currentItem.quantity -= submittedQuantity
        } else {
          state.items.splice(currentItemIndex, 1)
        }
      }
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const {
  addItem,
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeItem,
  removeSubmittedItems,
  setQuantity,
} = cartSlice.actions

export const cartReducer = cartSlice.reducer
