import type { Product } from '@/entities/product/model/product.schema'
import { ProductCard } from '@/entities/product/ui/product-card/ProductCard'
import { productGridClasses } from '@/widgets/product-grid/productGridClasses'

type ProductGridProps = {
  products: readonly Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <ul className={productGridClasses}>
      {products.map((product) => (
        <li className="flex h-full min-w-0 w-full" key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}
