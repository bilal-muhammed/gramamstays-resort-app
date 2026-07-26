import { NextResponse } from 'next/server'
import { AUTH_COOKIE, verifyToken } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export async function POST(request: Request) {
  const cookie = request.headers.get('cookie') || ''
  const tokenMatch = cookie.match(/ga_token=([^;]+)/)
  if (tokenMatch) {
    const payload = verifyToken(tokenMatch[1])
    if (payload) {
      createAuditLog({ userId: payload.userId, username: payload.username, action: 'logout', entity: 'auth' })
    }
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(AUTH_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })
  return response
}
