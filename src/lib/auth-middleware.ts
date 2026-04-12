import { NextResponse } from 'next/server'
import { verifyToken } from './auth'

export async function requireAuth(request: Request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [key, ...val] = c.split('=')
      return [key, val.join('=')]
    })
  )
  const token = cookies['admin_token']

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
      { status: 401 }
    )
  }

  return payload
}
