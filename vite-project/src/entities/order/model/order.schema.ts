import { z } from 'zod'

import {
  PAYMENT_METHODS,
  SHIPPING_METHODS,
} from '@/features/checkout/model/checkout.schema'

const orderColorSchema = z.object({
  name: z.string().trim().min(1),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
})

export const orderItemSchema = z.object({
  productId: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  sku: z.string().trim().min(1),
  name: z.string().trim().min(1),
  image: z.string().trim().min(1),
  unitPrice: z.number().finite().nonnegative(),
  currency: z.string().trim().min(1),
  selectedColor: orderColorSchema,
  selectedSize: z.string().trim().min(1),
  quantity: z.number().int().positive(),
  lineTotal: z.number().finite().nonnegative(),
})

export const orderSchema = z.object({
  id: z.string().trim().min(1),
  userId: z.string().trim().min(1).optional(),
  customerEmailNormalized: z.string().trim().toLowerCase().email().optional(),
  orderNumber: z.string().trim().min(1),
  createdAt: z.string().datetime(),
  status: z.string().trim().min(1),
  customer: z.object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    email: z.string().trim().email(),
    phone: z.string().trim().min(1),
  }),
  deliveryAddress: z.object({
    address: z.string().trim().min(1),
    city: z.string().trim().min(1),
    postalCode: z.string().trim().min(1),
  }),
  shippingMethod: z.enum(SHIPPING_METHODS),
  paymentMethod: z.enum(PAYMENT_METHODS),
  items: z.array(orderItemSchema).min(1),
  totalQuantity: z.number().int().positive(),
  subtotal: z.number().finite().nonnegative(),
  shippingFee: z.number().finite().nonnegative(),
  total: z.number().finite().nonnegative(),
  currency: z.string().trim().min(1),
})

export type OrderItem = z.infer<typeof orderItemSchema>
export type Order = z.infer<typeof orderSchema>

export const KNOWN_ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const

export type KnownOrderStatus = (typeof KNOWN_ORDER_STATUSES)[number]
