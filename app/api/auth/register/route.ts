import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { hashPassword, generateToken, type UserRole } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

const ALLOWED_ROLES: UserRole[] = ['super_admin', 'admin', 'staff']

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })

  const cookie = request.headers.get('cookie') || ''
  const tokenMatch = cookie.match(/ga_token=([^;]+)/)
  if (!tokenMatch) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { verifyToken } = await import('@/lib/auth')
  const requester = verifyToken(tokenMatch[1])
  if (!requester || requester.role !== 'super_admin') {
    return NextResponse.json({ error: 'Only Super Admin can register users' }, { status: 403 })
  }

  try {
    const { username, email, phone, password, role } = await request.json()

    if (!username || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const userRole = (ALLOWED_ROLES.includes(role) ? role : 'staff') as UserRole

    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    })
    if (existing) {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 409 })
    }

    const hashed = await hashPassword(password)
    const user = await prisma.user.create({
      data: { username, email, phone, password: hashed, role: userRole },
    })

    createAuditLog({
      userId: requester.userId,
      username: requester.username,
      action: 'user.created',
      entity: 'user',
      entityId: user.id,
      details: { newUsername: user.username, role: user.role },
    })

    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    }, { status: 201 })
  } catch (error) {
    console.error('[Auth] Register error:', error)
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 })
  }
}
