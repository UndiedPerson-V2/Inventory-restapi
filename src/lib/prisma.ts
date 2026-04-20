import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

let prisma: PrismaClient

const connectionString = process.env.DATABASE_URL || 'file:./dev.db'
const dbPath = connectionString.replace('file:', '')

// @ts-ignore
if (typeof Bun !== 'undefined') {
  // --- BUN RUNTIME (Local) ---
  const { PrismaBunSqlite } = require('prisma-adapter-bun-sqlite')
  const { Database } = require('bun:sqlite')
  const sqlite = new Database(dbPath)
  const adapter = new PrismaBunSqlite(sqlite)
  prisma = globalForPrisma.prisma || new PrismaClient({ adapter, log: ['query'] })
} else {
  // --- NODE RUNTIME (Vercel) ---
  try {
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
    const Database = require('better-sqlite3')
    const sqlite = new Database(dbPath)
    const adapter = new PrismaBetterSqlite3(sqlite)
    prisma = globalForPrisma.prisma || new PrismaClient({ adapter, log: ['query'] })
  } catch (e) {
    // Fallback for environments where better-sqlite3 might not be needed or fails to load
    prisma = globalForPrisma.prisma || new PrismaClient({ log: ['query'] })
  }
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
