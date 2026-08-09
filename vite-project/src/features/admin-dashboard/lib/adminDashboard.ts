import type { SafeUser } from '@/entities/auth/model/auth.types'
import type { Order } from '@/entities/order/model/order.schema'
import type { Product } from '@/entities/product/model/product.schema'
import {
  getLastSixMonths,
  getOrderItemCount,
  groupCustomerSpendingByMonth,
  groupOrdersByStatus,
  normalizeStatus,
} from '@/features/customer-dashboard/lib/orderDashboard'

export type MonthlyCountPoint = {
  key: string
  label: string
  count: number
}

export type TopSellingProduct = {
  productId: string
  name: string
  quantity: number
}

export function calculateTotalRevenue(orders: readonly Order[]) {
  return orders.reduce((total, order) => {
    if (normalizeStatus(order.status) === 'cancelled') return total
    return total + getSafeNonNegativeNumber(order.total)
  }, 0)
}

export function countCustomerUsers(users: readonly SafeUser[]) {
  return users.filter((user) => user.role === 'customer').length
}

export function groupRevenueByMonth(
  orders: readonly Order[],
  referenceDate = new Date(),
) {
  return groupCustomerSpendingByMonth(orders, referenceDate)
}

export function groupOrderCountByMonth(
  orders: readonly Order[],
  referenceDate = new Date(),
): MonthlyCountPoint[] {
  const months = getLastSixMonths(referenceDate)
  const counts = new Map(months.map((month) => [month.key, 0]))

  for (const order of orders) {
    const key = getMonthKey(order.createdAt)
    if (key && counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return months.map(({ key, label }) => ({
    key,
    label,
    count: counts.get(key) ?? 0,
  }))
}

export function calculateOrderStatusCounts(orders: readonly Order[]) {
  return groupOrdersByStatus(orders)
}

export function calculateTopSellingProducts(
  orders: readonly Order[],
  products: readonly Product[],
  limit = 5,
): TopSellingProduct[] {
  const productNames = new Map(products.map((product) => [product.id, product.name]))
  const totals = new Map<string, TopSellingProduct>()

  for (const order of orders) {
    if (normalizeStatus(order.status) === 'cancelled') continue

    for (const item of order.items) {
      const quantity = getSafePositiveQuantity(item.quantity)
      if (quantity === 0) continue

      const current = totals.get(item.productId)
      totals.set(item.productId, {
        productId: item.productId,
        name:
          item.name.trim() ||
          productNames.get(item.productId)?.trim() ||
          `Product ${item.productId}`,
        quantity: (current?.quantity ?? 0) + quantity,
      })
    }
  }

  return [...totals.values()]
    .sort((first, second) =>
      second.quantity - first.quantity || first.name.localeCompare(second.name),
    )
    .slice(0, Math.max(0, limit))
}

export function calculateOrderItemCount(order: Order) {
  return getOrderItemCount(order)
}

export function sortOrdersNewestFirst(orders: readonly Order[]) {
  return [...orders].sort(
    (first, second) => getTimestamp(second.createdAt) - getTimestamp(first.createdAt),
  )
}

function getSafeNonNegativeNumber(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

function getSafePositiveQuantity(value: number) {
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : 0
}

function getMonthKey(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function getTimestamp(value: string) {
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? 0 : timestamp
}
