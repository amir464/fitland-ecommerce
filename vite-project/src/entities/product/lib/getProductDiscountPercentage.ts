export function getProductDiscountPercentage(
  price: number,
  compareAtPrice: number | null,
): number | null {
  if (
    !Number.isFinite(price) ||
    !Number.isFinite(compareAtPrice) ||
    price <= 0 ||
    compareAtPrice === null ||
    compareAtPrice <= price
  ) {
    return null
  }

  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}
