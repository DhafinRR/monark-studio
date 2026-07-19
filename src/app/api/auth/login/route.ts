import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { signToken } from '@/lib/auth'

// In a real app, use environment variables. We are providing a fallback for easy test.
const ADMIN_USER = process.env.ADMIN_USERNAME || 'operator'
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'launchpad2026'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // Create JWT token
      const token = await signToken({ user: 'admin', role: 'superadmin' })
      
      // Detect if the original request was HTTPS (behind reverse proxy like Coolify/Traefik)
      const forwardedProto = req.headers.get('x-forwarded-proto')
      const isSecure = forwardedProto === 'https'
      
      // Set the token inside an HTTP-only cookie using Next/Headers
      const cookieStore = await cookies()
      cookieStore.set({
        name: 'admin_token',
        value: token,
        httpOnly: true,
        secure: isSecure,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      })
      
      return NextResponse.json({ success: true, message: 'Welcome back' })
    }

    return NextResponse.json({ error: 'Invalid access credentials' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
