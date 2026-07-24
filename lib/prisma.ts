import { PrismaClient } from '@/lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('[Prisma] DATABASE_URL is missing from .env')
    return null
  }
  console.log('[Prisma] Connecting to database...')
  try {
    const adapter = new PrismaPg({ connectionString: url })
    const client = new PrismaClient({ adapter })
    console.log('[Prisma] Client created successfully')
    return client
  } catch (error) {
    console.error('[Prisma] Failed to create client:', error)
    return null
  }
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export function isDbConnected(): boolean {
  return prisma !== null
}
