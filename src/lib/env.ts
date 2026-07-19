export function validateEnv() {
  const required = ['DATABASE_URL', 'GOOGLE_API_KEY']

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  if (!process.env.JWT_SECRET) {
    console.warn('⚠️ JWT_SECRET not set. Using insecure default. Set JWT_SECRET in production.')
  }
}
