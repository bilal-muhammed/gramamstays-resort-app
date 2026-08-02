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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin/login') || pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('ga_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const payload = decodeToken(token)
    if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('ga_token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
