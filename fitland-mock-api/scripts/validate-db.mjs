import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const failures = []
const genders = new Set(['men', 'women', 'unisex'])
const categories = new Set(['tops', 'bottoms', 'outerwear', 'footwear', 'accessories'])
const sports = new Set([
  'running',
  'training',
  'football',
  'volleyball',
  'skating',
  'wrestling',
  'lifestyle',
])
const sizes = new Set(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE_SIZE'])
const localImagePattern = /^\/images\/products\/[a-z0-9-]+\.(?:jpe?g|png|webp)$/i
const httpsImagePattern = /^https:\/\/[^\s]+$/i

const fail = (message) => failures.push(message)
const nonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0
const nonEmptyArray = (value) => Array.isArray(value) && value.length > 0

let database
try {
  database = JSON.parse(await readFile(path.join(root, 'db.json'), 'utf8'))
} catch (error) {
  console.error(`Validation failed: db.json could not be parsed (${error.message}).`)
  process.exit(1)
}

if (!Array.isArray(database.products)) {
  console.error('Validation failed: products must be an array.')
  process.exit(1)
}

if (!Array.isArray(database.orders)) {
  console.error('Validation failed: orders must be an array.')
  process.exit(1)
}

if (!Array.isArray(database.users)) {
  console.error('Validation failed: users must be an array.')
  process.exit(1)
}

const products = database.products
if (products.length !== 24) fail(`Expected 24 products, received ${products.length}`)

for (const [index, order] of database.orders.entries()) {
  const label = nonEmptyString(order?.id) ? order.id : `order ${index + 1}`
  const email = order?.customer?.email

  if (nonEmptyString(email)) {
    const expectedEmail = email.trim().toLowerCase()
    if (order.customerEmailNormalized !== expectedEmail) {
      fail(
        `${label}: customerEmailNormalized must equal customer.email.trim().toLowerCase()`,
      )
    }
  }
}

for (const field of ['id', 'slug', 'sku']) {
  const values = products.map((product) => product[field])
  values.forEach((value, index) => {
    if (!nonEmptyString(value)) fail(`Product ${index + 1}: ${field} must be a non-empty string`)
  })
  if (new Set(values).size !== values.length) fail(`${field} values must be unique`)
}

for (const [index, product] of products.entries()) {
  const label = nonEmptyString(product.id) ? product.id : `product ${index + 1}`
  if (product.brand !== 'FitLand') fail(`${label}: brand must equal FitLand`)
  if (!genders.has(product.gender)) fail(`${label}: invalid gender`)
  if (!categories.has(product.category)) fail(`${label}: invalid category`)
  if (!nonEmptyArray(product.sports) || product.sports.some((sport) => !sports.has(sport))) {
    fail(`${label}: sports must be a non-empty array of valid values`)
  }
  if (!Number.isFinite(product.price) || product.price <= 0) fail(`${label}: invalid price`)
  if (
    product.compareAtPrice !== null &&
    (!Number.isFinite(product.compareAtPrice) || product.compareAtPrice <= product.price)
  ) {
    fail(`${label}: compareAtPrice must be null or greater than price`)
  }
  if (!Number.isFinite(product.rating) || product.rating < 0 || product.rating > 5) {
    fail(`${label}: rating must be between 0 and 5`)
  }
  if (!Number.isInteger(product.reviewCount) || product.reviewCount < 0) {
    fail(`${label}: reviewCount must be a non-negative integer`)
  }
  if (!Number.isInteger(product.stock) || product.stock < 0) {
    fail(`${label}: stock must be a non-negative integer`)
  }
  if (
    !nonEmptyArray(product.colors) ||
    product.colors.some(
      (color) =>
        !nonEmptyString(color?.name) ||
        typeof color?.hex !== 'string' ||
        !/^#[0-9a-f]{6}$/i.test(color.hex),
    )
  ) {
    fail(`${label}: colors must contain valid names and six-digit hex values`)
  }
  if (!nonEmptyArray(product.sizes) || product.sizes.some((size) => !sizes.has(size))) {
    fail(`${label}: sizes must be a non-empty array of valid values`)
  }
  for (const field of ['materials', 'features']) {
    if (!nonEmptyArray(product[field]) || product[field].some((value) => !nonEmptyString(value))) {
      fail(`${label}: ${field} must be a non-empty array of non-empty strings`)
    }
  }
  if (!Array.isArray(product.images) || product.images.length !== 2) {
    fail(`${label}: exactly two images are required`)
  } else {
    for (const image of product.images) {
      if (!nonEmptyString(image.id) || !nonEmptyString(image.alt)) {
        fail(`${label}: image IDs and alt text must be non-empty`)
      }
      if (typeof image.url !== 'string' || (!localImagePattern.test(image.url) && !httpsImagePattern.test(image.url))) {
        fail(`${label}: image URLs must be local JPG, JPEG, PNG, or WebP paths, or valid HTTPS URLs`)
        continue
      }
      if (localImagePattern.test(image.url)) {
        try {
          await access(path.join(root, 'public', image.url.replace(/^\//, '')))
        } catch {
          fail(`${label}: missing referenced image ${image.url}`)
        }
      }
    }
  }
  if (
    !nonEmptyString(product.createdAt) ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(product.createdAt) ||
    Number.isNaN(Date.parse(product.createdAt))
  ) {
    fail(`${label}: createdAt must be a valid ISO date-time`)
  }
}

if (failures.length > 0) {
  console.error(`Database validation failed with ${failures.length} issue(s):`)
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log(
  `Database valid: ${products.length} products, ${products.length * 2} valid images, ${database.orders.length} orders, ${database.users.length} users, unique string IDs/slugs/SKUs.`,
)
