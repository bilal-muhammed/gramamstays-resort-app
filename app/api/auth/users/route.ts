import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken, AUTH_COOKIE } from '@/lib/auth'

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie') || ''
  const tokenMatch = cookie.match(/ga_token=([^;]+)/)
  if (!tokenMatch) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const payload = verifyToken(tokenMatch[1])
  if (!payload || payload.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })

  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, phone: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error('[Auth] Users list error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
