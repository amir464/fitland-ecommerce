import { isSameCartLine } from './cartLineIdentity'
import type { CartItem, CartLineIdentity } from './cart.types'

export function getAllocatedProductQuantity(
  items: readonly CartItem[],
  productId: CartLineIdentity['productId'],
  excludedLine?: CartLineIdentity,
) {
  return items.reduce((total, item) => {
    if (
      item.productId !== productId ||
      (excludedLine && isSameCartLine(item, excludedLine))
    ) {
      return total
    }

    return total + item.quantity
  }, 0)
}

export function getConservativeProductStock(
  items: readonly CartItem[],
  productId: CartLineIdentity['productId'],
  proposedStock?: number,
) {
  const stockValues = items
    .filter((item) => item.productId === productId)
    .map((item) => item.maxStock)

  if (proposedStock !== undefined) {
    stockValues.push(proposedStock)
  }

  const validStockValues = stockValues.filter(
    (stock) => Number.isFinite(stock) && stock > 0,
  )

  return validStockValues.length > 0
    ? Math.min(...validStockValues.map(Math.trunc))
    : 0
}
