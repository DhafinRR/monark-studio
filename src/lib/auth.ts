import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || ''

if (!JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET not set. Authentication will use insecure default.')
}

const key = new TextEncoder().encode(JWT_SECRET || 'insecure-default-key-change-in-production')

export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key)
    return payload
  } catch (error) {
    return null
  }
}
