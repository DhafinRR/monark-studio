import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

const PUBLIC_PATHS = [
  '/monolith-core/orders',
  '/monolith-core/orders/:id/print',
  '/monolith-core/orders/:id/print/:path*',
]

function isPublicPath(pathname: string): boolean {
  if (pathname.startsWith('/monolith-core/orders/') && pathname.includes('/print/')) {
    return true
  }
  return false
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const pathname = request.nextUrl.pathname

  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  if (isPublicPath(pathname)) {
    return response
  }

  const token = request.cookies.get('admin_token')?.value

  if (pathname.startsWith('/monolith-core')) {
    if (!token) {
      return NextResponse.redirect(new URL('/gatekeeper', request.url))
    }
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.redirect(new URL('/gatekeeper', request.url))
    }
  }

  if (pathname.startsWith('/api/monolith-core')) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return response
}

export const config = {
  matcher: [
    '/monolith-core',
    '/monolith-core/:path*',
    '/api/monolith-core',
    '/api/monolith-core/:path*',
  ],
}
