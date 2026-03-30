import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  
  // Protect Next.js frontend route
  if (request.nextUrl.pathname.startsWith('/monolith-core')) {
    if (!token) {
      return NextResponse.redirect(new URL('/gatekeeper', request.url))
    }
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.redirect(new URL('/gatekeeper', request.url))
    }
  }

  // Protect Backend API route
  if (request.nextUrl.pathname.startsWith('/api/monolith-core')) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/monolith-core', 
    '/monolith-core/:path*', 
    '/api/monolith-core', 
    '/api/monolith-core/:path*'
  ],
}
