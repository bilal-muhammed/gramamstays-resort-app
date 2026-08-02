import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyPassword, generateToken, AUTH_COOKIE } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { checkRateLimit, recordFailedAttempt, resetAttempts } from '@/lib/rate-limit'

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })

  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateLimitKey = `login:${ip}:${username}`

    const { allowed, retryAfter } = checkRateLimit(rateLimitKey)
    if (!allowed) {
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${retryAfter} seconds.` },
        { status: 429 }
      )
    }

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      recordFailedAttempt(rateLimitKey)
      createAuditLog({ userId: 'unknown', username, action: 'login.failed', entity: 'auth', details: { reason: 'user_not_found' } })
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      recordFailedAttempt(rateLimitKey)
      createAuditLog({ userId: user.id, username, action: 'login.failed', entity: 'auth', details: { reason: 'wrong_password' } })
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    resetAttempts(rateLimitKey)

    const token = generateToken({ userId: user.id, username: user.username, role: user.role as 'super_admin' | 'admin' | 'staff' })

    const response = NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
    })

    response.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    createAuditLog({ userId: user.id, username, action: 'login.success', entity: 'auth' })

    return response
  } catch (error) {
    console.error('[Auth] Login error:', error)
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
  }
}
