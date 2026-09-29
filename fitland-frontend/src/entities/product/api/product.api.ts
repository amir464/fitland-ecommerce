import { productListSchema, productSchema } from '@/entities/product/model/product.schema'
import type { Product } from '@/entities/product/model/product.schema'
import { httpClient } from '@/shared/api/httpClient'

export async function getProducts(signal: AbortSignal): Promise<Product[]> {
  const response = await httpClient.get<unknown>('/products', { signal })

  return productListSchema.parse(response.data)
}

export async function getProductById(
  id: string,
  signal: AbortSignal,
): Promise<Product> {
  const normalizedId = id.trim()

  if (!normalizedId) {
    throw new Error('Product ID is required.')
  }

  const response = await httpClient.get<unknown>(
    `/products/${encodeURIComponent(normalizedId)}`,
    { signal },
  )

  return productSchema.parse(response.data)
}
