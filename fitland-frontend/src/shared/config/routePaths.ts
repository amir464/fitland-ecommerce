import { generatePath } from 'react-router'

export const PRODUCT_DETAILS_ROUTE_PATH = 'products/:productId'
export const CHECKOUT_ROUTE_PATH = 'checkout'
export const CHECKOUT_PATH = `/${CHECKOUT_ROUTE_PATH}`
export const ORDER_SUCCESS_ROUTE_PATH = 'order-success/:orderId'

export function getProductDetailsPath(productId: string): string {
  return `/${generatePath(PRODUCT_DETAILS_ROUTE_PATH, {
    productId: encodeURIComponent(productId),
  })}`
}

export function getOrderSuccessPath(orderId: string): string {
  return `/${generatePath(ORDER_SUCCESS_ROUTE_PATH, {
    orderId: encodeURIComponent(orderId),
  })}`
}
