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

function getSecretPath(): string {
  return process.env.ADMIN_SECRET_PATH || 'admin'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method
  const secretPath = getSecretPath()

  // Block direct /admin access — return 404
  if (pathname.startsWith('/admin')) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // API auth routes — always allow
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // Secret admin path — rewrite to /admin internally
  if (pathname.startsWith(`/${secretPath}`)) {
    const isAdminRoot = pathname === `/${secretPath}` || pathname === `/${secretPath}/`
    const isLogin = pathname === `/${secretPath}/login`

    if (isAdminRoot && !isAuthenticated(request)) {
      // Not logged in → rewrite directly to /admin/login
      const rewriteUrl = request.nextUrl.clone()
      rewriteUrl.pathname = '/admin/login'
      return NextResponse.rewrite(rewriteUrl)
    }

    if (isAdminRoot && isAuthenticated(request)) {
      // Logged in at root → rewrite to /admin
      const rewriteUrl = request.nextUrl.clone()
      rewriteUrl.pathname = '/admin'
      return NextResponse.rewrite(rewriteUrl)
    }

    if (isLogin) {
      // Login page → rewrite to /admin/login
      const rewriteUrl = request.nextUrl.clone()
      rewriteUrl.pathname = '/admin/login'
      return NextResponse.rewrite(rewriteUrl)
    }

    // All other admin routes — require auth
    if (!isAuthenticated(request)) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = `/${secretPath}/login`
      return NextResponse.redirect(loginUrl)
    }

    // Rewrite authenticated admin routes to /admin/*
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = pathname.replace(`/${secretPath}`, '/admin')
    return NextResponse.rewrite(rewriteUrl)
  }

  // API routes — apply auth rules
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
  matcher: ['/admin/:path*', '/api/:path*', '/:path*'],
}
