import type { Product, ProductColor } from '@/entities/product/model/product.schema'

export type CartSelectedColor = Pick<ProductColor, 'name' | 'hex'>

export type CartLineIdentity = {
  productId: Product['id']
  selectedColor: CartSelectedColor
  selectedSize: Product['sizes'][number]
}

export type CartItem = CartLineIdentity & {
  slug: Product['slug']
  sku: Product['sku']
  name: Product['name']
  image: Product['images'][number]['url']
  unitPrice: Product['price']
  currency: Product['currency']
  quantity: number
  maxStock: Product['stock']
}

export type SubmittedCartLine = CartLineIdentity & {
  quantity: number
}

export type CartState = {
  items: CartItem[]
}
