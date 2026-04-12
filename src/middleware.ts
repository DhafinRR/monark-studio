import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  const token = request.cookies.get('admin_token')?.value

  if (request.nextUrl.pathname.startsWith('/monolith-core')) {
    if (!token) {
      return NextResponse.redirect(new URL('/gatekeeper', request.url))
    }
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.redirect(new URL('/gatekeeper', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/api/monolith-core')) {
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
