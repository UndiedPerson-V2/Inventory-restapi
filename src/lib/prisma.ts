import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const connectionString = process.env.STORAGE_POSTGRES_PRISMA_URL || process.env.POSTGRES_PRISMA_URL

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
