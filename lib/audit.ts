import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

interface LogParams {
  userId: string
  username: string
  action: string
  entity: string
  entityId?: string
  details?: Record<string, unknown>
}

export async function createAuditLog({ userId, username, action, entity, entityId, details }: LogParams) {
  if (!prisma) return
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        username,
        action,
        entity,
        entityId: entityId || null,
        details: details ? JSON.stringify(details) : null,
      },
    })
  } catch (error) {
    console.error('[Audit] Failed to create log:', error)
  }
}

export function getUserFromRequest(request: Request): { userId: string; username: string } | null {
  const cookie = request.headers.get('cookie') || ''
  const tokenMatch = cookie.match(/ga_token=([^;]+)/)
  if (!tokenMatch) return null
  const payload = verifyToken(tokenMatch[1])
  if (!payload) return null
  return { userId: payload.userId, username: payload.username }
}

export function parseDetails(details: string | null): Record<string, unknown> | null {
  if (!details) return null
  try {
    return JSON.parse(details)
  } catch {
    return null
  }
}
