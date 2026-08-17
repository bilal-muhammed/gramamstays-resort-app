import { PrismaClient } from '@/lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createClient() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('[Prisma] DATABASE_URL not set')
    return null
  }
  try {
    const pool = new pg.Pool({
      connectionString: url,
      ssl: url.includes('localhost') ? false : { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 15000,
    })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  } catch (error) {
    console.error('[Prisma] Failed to create client:', error)
    return null
  }
}

export const prisma = globalForPrisma.prisma || createClient()

if (prisma) globalForPrisma.prisma = prisma
