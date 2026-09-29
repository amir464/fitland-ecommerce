import type { Order } from '@/entities/order/model/order.schema'

export type MonthlySpendingPoint = {
  key: string
  label: string
  total: number
}

export type OrderStatusPoint = {
  key: string
  label: string
  count: number
}

const ACTIVE_STATUSES = new Set(['pending', 'processing', 'shipped'])

export function getCustomerOrderSummary(orders: readonly Order[]) {
  return orders.reduce(
    (summary, order) => {
      const total = getSafeTotal(order.total)
      const status = normalizeStatus(order.status)

      summary.totalOrders += 1
      if (status !== 'cancelled') summary.totalSpent += total
      if (status === 'delivered') summary.deliveredOrders += 1
      if (ACTIVE_STATUSES.has(status)) summary.activeOrders += 1

      return summary
    },
    { totalOrders: 0, totalSpent: 0, deliveredOrders: 0, activeOrders: 0 },
  )
}

export function getLastSixMonths(referenceDate = new Date()): MonthlySpendingPoint[] {
  const months: MonthlySpendingPoint[] = []

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() - offset,
      1,
    )
    months.push({
      key: getMonthKey(date),
      label: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
      total: 0,
    })
  }

  return months
}

export function groupCustomerSpendingByMonth(
  orders: readonly Order[],
  referenceDate = new Date(),
): MonthlySpendingPoint[] {
  const months = getLastSixMonths(referenceDate)
  const monthTotals = new Map(months.map((month) => [month.key, 0]))

  for (const order of orders) {
    if (normalizeStatus(order.status) === 'cancelled') continue

    const date = new Date(order.createdAt)
    if (Number.isNaN(date.getTime())) continue

    const key = getMonthKey(date)
    if (monthTotals.has(key)) {
      monthTotals.set(key, (monthTotals.get(key) ?? 0) + getSafeTotal(order.total))
    }
  }

  return months.map((month) => ({
    ...month,
    total: monthTotals.get(month.key) ?? 0,
  }))
}

export function groupOrdersByStatus(
  orders: readonly Order[],
): OrderStatusPoint[] {
  const counts = new Map<string, number>()

  for (const order of orders) {
    const status = normalizeStatus(order.status)
    const key = isKnownStatus(status) ? status : 'other'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return [...counts.entries()].map(([key, count]) => ({
    key,
    label: getStatusLabel(key),
    count,
  }))
}

export function getRecentOrders(orders: readonly Order[], limit = 6) {
  return [...orders]
    .sort((first, second) => getTimestamp(second.createdAt) - getTimestamp(first.createdAt))
    .slice(0, Math.max(0, limit))
}

export function getOrderItemCount(order: Order) {
  return order.items.reduce((total, item) => {
    return total + (Number.isFinite(item.quantity) ? Math.max(0, item.quantity) : 0)
  }, 0)
}

export function getStatusLabel(status: string) {
  const normalized = normalizeStatus(status)
  return normalized === 'other'
    ? 'Other'
    : normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

export function normalizeStatus(status: string) {
  return status.trim().toLowerCase()
}

function isKnownStatus(status: string) {
  return ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function getSafeTotal(total: number) {
  return Number.isFinite(total) ? Math.max(0, total) : 0
}

function getTimestamp(value: string) {
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? 0 : timestamp
}
