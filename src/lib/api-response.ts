import { NextResponse } from 'next/server'

export function badRequest(message: string) {
  return NextResponse.json({ error: message, code: 'BAD_REQUEST' }, { status: 400 })
}

export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ error: message, code: 'UNAUTHORIZED' }, { status: 401 })
}

export function forbidden(message = 'Forbidden') {
  return NextResponse.json({ error: message, code: 'FORBIDDEN' }, { status: 403 })
}

export function notFound(message = 'Resource not found') {
  return NextResponse.json({ error: message, code: 'NOT_FOUND' }, { status: 404 })
}

export function internalError(message = 'Internal Server Error') {
  console.error('[API Error]', message)
  return NextResponse.json({ error: message, code: 'INTERNAL_ERROR' }, { status: 500 })
}

export function tooManyRequests(retryAfter: number) {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.', code: 'RATE_LIMITED', retryAfter },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  )
}
