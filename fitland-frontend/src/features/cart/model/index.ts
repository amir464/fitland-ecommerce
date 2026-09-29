export {
  addItem,
  cartReducer,
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeItem,
  removeSubmittedItems,
  setQuantity,
} from './cart.slice'
export {
  selectCartItems,
  selectCartLineCount,
  selectCartProductStockLimit,
  selectCartQuantityByProductId,
  selectCartRemainingStockByProductId,
  selectCartSubtotal,
  selectCartTotalUnits,
  selectIsCartEmpty,
} from './cart.selectors'
export { isSameCartLine } from './cartLineIdentity'
export type {
  CartItem,
  CartLineIdentity,
  CartSelectedColor,
  CartState,
  SubmittedCartLine,
} from './cart.types'
