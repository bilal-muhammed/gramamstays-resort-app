import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

async function verifyToken(token: string): Promise<{ exp?: number } | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '')
    if (!secret.length) return null
    const { payload } = await jwtVerify(token, secret)
    return payload as { exp?: number }
  } catch {
    return null
  }
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('ga_token')?.value
  if (!token) return false
  const payload = await verifyToken(token)
  if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) return false
  return true
}

function getSecretPath(): string {
  return process.env.ADMIN_SECRET_PATH || 'admin'
}

export async function middleware(request: NextRequest) {
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

    if (isAdminRoot && !(await isAuthenticated(request))) {
      // Not logged in → rewrite directly to /admin/login
      const rewriteUrl = request.nextUrl.clone()
      rewriteUrl.pathname = '/5AUUVwJHVzM/login'
      return NextResponse.rewrite(rewriteUrl)
    }

    if (isAdminRoot && (await isAuthenticated(request))) {
      // Logged in at root → rewrite to /admin
      const rewriteUrl = request.nextUrl.clone()
      rewriteUrl.pathname = '/admin'
      return NextResponse.rewrite(rewriteUrl)
    }

    if (isLogin) {
      // Login page → rewrite to /admin/login
      const rewriteUrl = request.nextUrl.clone()
      rewriteUrl.pathname = '/5AUUVwJHVzM/login'
      return NextResponse.rewrite(rewriteUrl)
    }

    // All other admin routes — require auth
    if (!(await isAuthenticated(request))) {
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

    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*', '/:path*'],
}
