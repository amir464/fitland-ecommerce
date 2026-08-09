import { z } from 'zod'

export const SHIPPING_METHODS = ['standard', 'express'] as const
export const PAYMENT_METHODS = ['cash_on_delivery', 'demo_card'] as const

const trimmedRequiredString = (label: string, minimum: number, maximum: number) =>
  z
    .string()
    .trim()
    .min(minimum, `${label} must be at least ${minimum} characters`)
    .max(maximum, `${label} must be ${maximum} characters or fewer`)

export const checkoutSchema = z.object({
  firstName: trimmedRequiredString('First name', 2, 50),
  lastName: trimmedRequiredString('Last name', 2, 50),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(/^[+()\d\s-]+$/, 'Use numbers, spaces, +, parentheses, or hyphens')
    .refine(
      (value) => {
        const digitCount = value.replace(/\D/g, '').length
        return digitCount >= 7 && digitCount <= 15
      },
      'Enter a valid phone number',
    ),
  address: trimmedRequiredString('Address', 5, 120),
  city: trimmedRequiredString('City', 2, 60),
  postalCode: z
    .string()
    .trim()
    .min(1, 'Postal code is required')
    .regex(
      /^[A-Za-z0-9][A-Za-z0-9\s-]{2,11}$/,
      'Enter a valid postal code',
    ),
  shippingMethod: z.enum(SHIPPING_METHODS),
  paymentMethod: z.enum(PAYMENT_METHODS),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>
export type ShippingMethod = CheckoutFormValues['shippingMethod']
export type PaymentMethod = CheckoutFormValues['paymentMethod']
