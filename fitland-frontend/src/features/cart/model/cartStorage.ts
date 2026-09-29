import {
  PRODUCT_CURRENCIES,
  PRODUCT_SIZES,
} from '@/entities/product/model/product.constants'

import type { CartItem } from './cart.types'

export const CART_STORAGE_KEY = 'fitland.cart.v1'
export const CART_STORAGE_VERSION = 1

type PersistedCartEnvelope = {
  version: typeof CART_STORAGE_VERSION
  items: CartItem[]
}

export function loadPersistedCartItems(): CartItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedValue = window.localStorage.getItem(CART_STORAGE_KEY)

    if (storedValue === null) {
      return []
    }

    const parsedValue: unknown = JSON.parse(storedValue)

    if (!isPersistedEnvelope(parsedValue)) {
      removePersistedCart()
      return []
    }

    const validItems = parsedValue.items
      .map(validateCartItem)
      .filter((item): item is CartItem => item !== null)

    if (validItems.length !== parsedValue.items.length) {
      savePersistedCartItems(validItems)
    }

    return validItems
  } catch {
    removePersistedCart()
    return []
  }
}

export function savePersistedCartItems(items: readonly CartItem[]) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const persistedCart: PersistedCartEnvelope = {
      version: CART_STORAGE_VERSION,
      items: items.map((item) => ({
        ...item,
        selectedColor: { ...item.selectedColor },
      })),
    }

    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(persistedCart),
    )
  } catch {
    // The in-memory Redux cart remains usable when browser storage is unavailable.
  }
}

function removePersistedCart() {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(CART_STORAGE_KEY)
  } catch {
    // Invalid storage can be ignored when removal is blocked by the browser.
  }
}

function isPersistedEnvelope(
  value: unknown,
): value is { version: typeof CART_STORAGE_VERSION; items: unknown[] } {
  return (
    isRecord(value) &&
    value.version === CART_STORAGE_VERSION &&
    Array.isArray(value.items)
  )
}

function validateCartItem(value: unknown): CartItem | null {
  if (!isRecord(value) || !isRecord(value.selectedColor)) {
    return null
  }

  const productId = readRequiredString(value.productId)
  const slug = readRequiredString(value.slug)
  const sku = readRequiredString(value.sku)
  const name = readRequiredString(value.name)
  const image = readRequiredString(value.image)
  const selectedColorName = readRequiredString(value.selectedColor.name)
  const selectedColorHex = readRequiredString(value.selectedColor.hex)
  const quantity = normalizePositiveInteger(value.quantity)
  const maxStock = normalizePositiveInteger(value.maxStock)

  if (
    productId === null ||
    slug === null ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    sku === null ||
    !/^[A-Z0-9][A-Z0-9-]*$/.test(sku) ||
    name === null ||
    image === null ||
    selectedColorName === null ||
    selectedColorHex === null ||
    !/^#[0-9A-Fa-f]{6}$/.test(selectedColorHex) ||
    !isProductSize(value.selectedSize) ||
    !isProductCurrency(value.currency) ||
    !isNonNegativeFiniteNumber(value.unitPrice) ||
    quantity === null ||
    maxStock === null
  ) {
    return null
  }

  return {
    productId,
    slug,
    sku,
    name,
    image,
    unitPrice: value.unitPrice,
    currency: value.currency,
    selectedColor: {
      name: selectedColorName,
      hex: selectedColorHex,
    },
    selectedSize: value.selectedSize,
    quantity,
    maxStock,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readRequiredString(value: unknown) {
  if (typeof value !== 'string') {
    return null
  }

  const normalizedValue = value.trim()
  return normalizedValue ? normalizedValue : null
}

function normalizePositiveInteger(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null
  }

  const normalizedValue = Math.min(Number.MAX_SAFE_INTEGER, Math.trunc(value))
  return normalizedValue >= 1 ? normalizedValue : null
}

function isNonNegativeFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function isProductSize(value: unknown): value is CartItem['selectedSize'] {
  return (
    typeof value === 'string' &&
    PRODUCT_SIZES.some((productSize) => productSize === value)
  )
}

function isProductCurrency(value: unknown): value is CartItem['currency'] {
  return (
    typeof value === 'string' &&
    PRODUCT_CURRENCIES.some((currency) => currency === value)
  )
}
