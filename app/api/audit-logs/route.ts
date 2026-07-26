import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  if (!prisma) return NextResponse.json([])

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')))
  const user = searchParams.get('user')
  const action = searchParams.get('action')
  const entity = searchParams.get('entity')

  try {
    const where: Record<string, unknown> = {}
    if (user) where.username = user
    if (action) where.action = action
    if (entity) where.entity = entity

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ])

    return NextResponse.json({ logs, total, page, limit })
  } catch (error) {
    console.error('[AuditLogs] GET error:', error)
    return NextResponse.json({ logs: [], total: 0, page: 1, limit: 50 })
  }
}
