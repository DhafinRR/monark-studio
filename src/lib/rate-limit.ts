import { RateLimiterMemory } from 'rate-limiter-flexible'

export const aiRateLimiter = new RateLimiterMemory({
  points: 20,
  duration: 60,
})

export const publicApiLimiter = new RateLimiterMemory({
  points: 30,
  duration: 60,
})

export const adminLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
})

export async function checkRateLimit(
  limiter: RateLimiterMemory,
  identifier: string
) {
  try {
    await limiter.consume(identifier)
    return { allowed: true }
  } catch {
    return {
      allowed: false,
      retryAfter: Math.ceil(limiter.msDuration / 1000),
    }
  }
}

export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return req.headers.get('x-real-ip') || 'unknown'
}
