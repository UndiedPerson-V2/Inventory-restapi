import { PrismaClient } from '@prisma/client'
import { PrismaBunSqlite } from 'prisma-adapter-bun-sqlite'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const connectionString = process.env.DATABASE_URL || 'file:./dev.db'
const adapter = new PrismaBunSqlite({ url: connectionString })

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
