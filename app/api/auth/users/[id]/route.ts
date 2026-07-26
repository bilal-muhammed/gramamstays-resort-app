import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken, AUTH_COOKIE } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookie = _request.headers.get('cookie') || ''
  const tokenMatch = cookie.match(/ga_token=([^;]+)/)
  if (!tokenMatch) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const payload = verifyToken(tokenMatch[1])
  if (!payload || payload.role !== 'super_admin') {
    return NextResponse.json({ error: 'Only Super Admin can delete users' }, { status: 403 })
  }

  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })

  try {
    const { id } = await params
    if (id === payload.userId) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
    }
    await prisma.user.delete({ where: { id } })

    createAuditLog({
      userId: payload.userId,
      username: payload.username,
      action: 'user.deleted',
      entity: 'user',
      entityId: id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Auth] Delete user error:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
