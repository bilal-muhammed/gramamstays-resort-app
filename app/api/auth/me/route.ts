import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken, AUTH_COOKIE } from '@/lib/auth'

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie') || ''
  const tokenMatch = cookie.match(/ga_token=([^;]+)/)
  if (!tokenMatch) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const payload = verifyToken(tokenMatch[1])
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, username: true, email: true, phone: true, role: true, createdAt: true },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json(user)
  } catch (error) {
    console.error('[Auth] Me error:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}
