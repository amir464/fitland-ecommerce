import type { CartLineIdentity } from './cart.types'

export function isSameCartLine(
  first: CartLineIdentity,
  second: CartLineIdentity,
) {
  return (
    first.productId === second.productId &&
    first.selectedColor.name === second.selectedColor.name &&
    first.selectedColor.hex === second.selectedColor.hex &&
    first.selectedSize === second.selectedSize
  )
}
