import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const databasePath = path.join(root, 'db.json')

let database
try {
  database = JSON.parse(await readFile(databasePath, 'utf8'))
} catch (error) {
  console.error(`Backfill failed: db.json could not be parsed (${error.message}).`)
  process.exit(1)
}

if (!Array.isArray(database.orders)) {
  console.error('Backfill failed: orders must be an array.')
  process.exit(1)
}

let updatedOrders = 0

for (const order of database.orders) {
  const email = order?.customer?.email
  if (typeof email !== 'string' || email.trim().length === 0) continue

  const normalizedEmail = email.trim().toLowerCase()
  if (order.customerEmailNormalized !== normalizedEmail) {
    order.customerEmailNormalized = normalizedEmail
    updatedOrders += 1
  }
}

if (updatedOrders > 0) {
  await writeFile(databasePath, `${JSON.stringify(database, null, 2)}\n`, 'utf8')
}

console.log(`Backfill complete: ${updatedOrders} order(s) updated.`)
