import { z } from 'zod'

import {
  PRODUCT_CATEGORIES,
  PRODUCT_CURRENCIES,
  PRODUCT_GENDERS,
  PRODUCT_SIZES,
  PRODUCT_SPORTS,
} from './product.constants'

export const productColorSchema = z.object({
  name: z.string().trim().min(1, 'Color name is required'),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Use a six-digit hex color'),
})

export const productImageSchema = z.object({
  id: z.string().trim().min(1, 'Image ID is required'),
  url: z.string().trim().min(1, 'Image URL is required'),
  alt: z.string().trim().min(1, 'Image alt text is required'),
})

export const productSchema = z
  .object({
    id: z.string().trim().min(1, 'Product ID is required'),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase kebab-case'),
    sku: z
      .string()
      .trim()
      .min(1, 'SKU is required')
      .regex(/^[A-Z0-9][A-Z0-9-]*$/, 'SKU must use uppercase letters, numbers, or hyphens'),
    brand: z.literal('FitLand'),
    name: z.string().trim().min(1, 'Product name is required'),
    shortDescription: z
      .string()
      .trim()
      .min(1, 'Short description is required')
      .max(180, 'Short description must be 180 characters or fewer'),
    description: z.string().trim().min(1, 'Description is required'),
    gender: z.enum(PRODUCT_GENDERS),
    category: z.enum(PRODUCT_CATEGORIES),
    sports: z.array(z.enum(PRODUCT_SPORTS)).min(1, 'Select at least one sport'),
    price: z.number().finite().positive('Price must be positive'),
    compareAtPrice: z.number().finite().positive('Compare-at price must be positive').nullable(),
    currency: z.enum(PRODUCT_CURRENCIES),
    rating: z.number().min(0, 'Rating cannot be negative').max(5, 'Rating cannot exceed 5'),
    reviewCount: z.number().int().nonnegative('Review count cannot be negative'),
    stock: z.number().int().nonnegative('Stock cannot be negative'),
    isFeatured: z.boolean(),
    isNew: z.boolean(),
    isBestSeller: z.boolean(),
    colors: z.array(productColorSchema).min(1, 'Add at least one color'),
    sizes: z.array(z.enum(PRODUCT_SIZES)).min(1, 'Add at least one size'),
    materials: z.array(z.string().trim().min(1)).min(1, 'Add at least one material'),
    features: z.array(z.string().trim().min(1)).min(1, 'Add at least one feature'),
    images: z.array(productImageSchema).min(1, 'Add at least one image'),
    createdAt: z.string().datetime({ message: 'Use a valid ISO date-time' }),
  })
  .refine(
    ({ compareAtPrice, price }) => compareAtPrice === null || compareAtPrice > price,
    {
      message: 'Compare-at price must be greater than price',
      path: ['compareAtPrice'],
    },
  )

export const productListSchema = z.array(productSchema)

export type ProductColor = z.infer<typeof productColorSchema>
export type ProductImage = z.infer<typeof productImageSchema>
export type Product = z.infer<typeof productSchema>
export type ProductList = z.infer<typeof productListSchema>
