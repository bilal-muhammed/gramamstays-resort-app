import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function decodeToken(token: string): { exp?: number } | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload
  } catch {
    return null
  }
}

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('ga_token')?.value
  if (!token) return false
  const payload = decodeToken(token)
  if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) return false
  return true
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method

  if (pathname.startsWith('/admin/login') || pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated(request)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  if (pathname.startsWith('/api/')) {
    if (pathname === '/api/bookings' && method === 'POST') {
      return NextResponse.next()
    }

    if (pathname === '/api/properties' && method === 'GET') {
      return NextResponse.next()
    }

    if (pathname.startsWith('/api/properties/') && method === 'GET') {
      return NextResponse.next()
    }

    if (pathname === '/api/testimonials' && method === 'GET') {
      return NextResponse.next()
    }

    if (pathname === '/api/inquiries' && method === 'POST') {
      return NextResponse.next()
    }

    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
