import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient
const connectionString = process.env.DATABASE_URL || 'file:./dev.db'
const dbPath = connectionString.replace('file:', '')

// @ts-ignore
if (typeof Bun !== 'undefined') {
  const { PrismaBunSqlite } = eval('require')('prisma-adapter-bun-sqlite');
  const { Database } = eval('require')('bun:sqlite');
  const sqlite = new Database(dbPath);
  const adapter = new PrismaBunSqlite(sqlite);
  prisma = new PrismaClient({ adapter });
} else {
  const { PrismaBetterSqlite3 } = eval('require')('@prisma/adapter-better-sqlite3');
  const Database = eval('require')('better-sqlite3');
  const sqlite = new Database(dbPath);
  const adapter = new PrismaBetterSqlite3(sqlite);
  prisma = new PrismaClient({ adapter });
}

async function main() {
  const products = [
    { name: 'iPhone 15 Pro', sku: 'IPH15P-256-BLUE', quantity: 25, zone: 'A1' },
    { name: 'MacBook Air M3', sku: 'MBA-M3-13-SG', quantity: 12, zone: 'B2' },
    { name: 'iPad Pro 11"', sku: 'IPP-11-M2-SL', quantity: 5, zone: 'A2' },
    { name: 'AirPods Pro 2', sku: 'APP2-USB-C', quantity: 45, zone: 'C1' },
    { name: 'Magic Mouse', sku: 'MM-WH-V2', quantity: 8, zone: 'C2' },
    { name: 'Studio Display', sku: 'SD-27-5K', quantity: 2, zone: 'B1' },
  ]

  console.log('Seeding products...')
  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    })
  }
  console.log('Seed finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
