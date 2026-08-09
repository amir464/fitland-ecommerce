import type { ShippingMethod } from '../model/checkout.schema'

export const EXPRESS_SHIPPING_FEE = 12

export function getShippingFee(shippingMethod: ShippingMethod) {
  return shippingMethod === 'express' ? EXPRESS_SHIPPING_FEE : 0
}

export function getCheckoutTotal(subtotal: number, shippingFee: number) {
  const safeSubtotal = Number.isFinite(subtotal) ? Math.max(0, subtotal) : 0
  const safeShippingFee = Number.isFinite(shippingFee)
    ? Math.max(0, shippingFee)
    : 0

  return safeSubtotal + safeShippingFee
}
