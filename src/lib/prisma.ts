import { PrismaClient } from '@prisma/client'
import path from 'path'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

let prisma: PrismaClient

const connectionString = process.env.DATABASE_URL || 'file:./dev.db'
// Ensure we use an absolute path for the SQLite file on Vercel
const dbPath = path.join(process.cwd(), connectionString.replace('file:', ''))

// @ts-ignore
if (typeof Bun !== 'undefined') {
  // --- BUN RUNTIME (Local) ---
  try {
    const { PrismaBunSqlite } = eval('require')('prisma-adapter-bun-sqlite');
    const { Database } = eval('require')('bun:sqlite');
    const sqlite = new Database(dbPath);
    const adapter = new PrismaBunSqlite(sqlite);
    prisma = globalForPrisma.prisma || new PrismaClient({ adapter, log: ['query', 'error', 'warn'] });
  } catch (e) {
    console.error('Bun Prisma Adapter Error:', e);
    prisma = globalForPrisma.prisma || new PrismaClient();
  }
} else {
  // --- NODE RUNTIME (Vercel) ---
  try {
    const { PrismaBetterSqlite3 } = eval('require')('@prisma/adapter-better-sqlite3')
    const Database = eval('require')('better-sqlite3')
    const sqlite = new Database(dbPath)
    const adapter = new PrismaBetterSqlite3(sqlite)
    prisma = globalForPrisma.prisma || new PrismaClient({ adapter, log: ['query', 'error', 'warn'] })
  } catch (e) {
    console.error('Node Prisma Adapter Error:', e);
    // Fallback to standard client
    prisma = globalForPrisma.prisma || new PrismaClient({ log: ['query', 'error', 'warn'] })
  }
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
