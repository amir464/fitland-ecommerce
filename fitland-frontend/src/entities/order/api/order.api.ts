import { orderSchema, type Order } from '@/entities/order/model/order.schema'
import { httpClient } from '@/shared/api/httpClient'

export async function createOrder(order: Order): Promise<Order> {
  const validOrder = orderSchema.parse(order)
  const response = await httpClient.post<unknown>('/orders', validOrder)

  return orderSchema.parse(response.data)
}

export async function getOrderById(
  orderId: string,
  signal: AbortSignal,
): Promise<Order> {
  const normalizedOrderId = orderId.trim()

  if (!normalizedOrderId) {
    throw new Error('Order ID is required.')
  }

  const response = await httpClient.get<unknown>(
    `/orders/${encodeURIComponent(normalizedOrderId)}`,
    { signal },
  )

  return orderSchema.parse(response.data)
}

export async function getAllOrders(signal: AbortSignal): Promise<Order[]> {
  const response = await httpClient.get<unknown>('/orders', { signal })

  return parseValidOrders(response.data)
}

export async function getCustomerOrders(
  userId: string,
  email: string,
  signal: AbortSignal,
): Promise<Order[]> {
  const normalizedUserId = userId.trim()
  const normalizedEmail = normalizeEmail(email)

  if (!normalizedUserId || !normalizedEmail) {
    return []
  }

  const [userOrdersResponse, legacyEmailOrdersResponse] = await Promise.all([
    httpClient.get<unknown>('/orders', {
      params: { userId: normalizedUserId },
      signal,
    }),
    httpClient.get<unknown>('/orders', {
      params: { customerEmailNormalized: normalizedEmail },
      signal,
    }),
  ])
  const userOrders = parseValidOrders(userOrdersResponse.data).filter(
    (order) => order.userId === normalizedUserId,
  )
  const legacyEmailOrders = parseValidOrders(legacyEmailOrdersResponse.data).filter(
    (order) =>
      !order.userId && order.customerEmailNormalized === normalizedEmail,
  )
  const ordersById = new Map(userOrders.map((order) => [order.id, order]))

  for (const order of legacyEmailOrders) {
    if (!ordersById.has(order.id)) {
      ordersById.set(order.id, order)
    }
  }

  return [...ordersById.values()]
}

function parseValidOrders(value: unknown) {
  return getOrderCollection(value).flatMap((order) => {
    const result = orderSchema.safeParse(order)
    return result.success ? [result.data] : []
  })
}

function getOrderCollection(value: unknown): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error('The order service returned invalid data.')
  }

  return value
}

function normalizeEmail(email: unknown) {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}
