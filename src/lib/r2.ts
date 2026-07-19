import { createHash, createHmac } from 'crypto'

const R2_REGION = 'auto'
const R2_SERVICE = 's3'

function requiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

function requiredAnyEnv(keys: string[]): string {
  for (const key of keys) {
    const value = process.env[key]
    if (value) return value
  }

  throw new Error(`Missing required environment variable: ${keys.join(' or ')}`)
}

export function getBucket() {
  return requiredAnyEnv(['R2_BUCKET', 'R2_BUCKET_NAME'])
}

export function getStoragePrefix() {
  const env = process.env.APP_ENV || process.env.NODE_ENV || 'development'
  const normalized = env.replace(/^\/+|\/+$/g, '')

  if (normalized === 'production' || normalized === 'prod') return 'prod'
  if (normalized === 'staging' || normalized === 'stag') return 'stag'

  return 'dev'
}

function getR2Endpoint() {
  const endpoint = process.env.R2_ENDPOINT
  if (endpoint) return endpoint.replace(/\/$/, '')

  const accountId = requiredEnv('R2_ACCOUNT_ID')
  return `https://${accountId}.r2.cloudflarestorage.com`
}

function hash(value: Buffer | string) {
  return createHash('sha256').update(value).digest('hex')
}

function hmac(key: Buffer | string, value: string) {
  return createHmac('sha256', key).update(value).digest()
}

function encodePathSegment(segment: string) {
  return encodeURIComponent(segment).replace(/[!'()*]/g, char =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  )
}

function encodeObjectPath(path: string) {
  return path.split('/').map(encodePathSegment).join('/')
}

function normalizeStoragePath(path: string) {
  const segments = path
    .split('/')
    .map(segment => segment.trim())
    .filter(Boolean)

  if (segments.length < 3 || segments.some(segment => segment === '.' || segment === '..')) {
    throw new Error('Path wajib berformat table/id/kelompok-file')
  }

  return segments.join('/')
}

function sanitizeFilename(filename: string) {
  const name = filename.split(/[\\/]/).pop() || 'file'
  return name
    .normalize('NFKD')
    .replace(/[^\w.\- ]+/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/^\.+/, '') || 'file'
}

export function createObjectKey(path: string, filename: string) {
  return `${getStoragePrefix()}/${normalizeStoragePath(path)}/${sanitizeFilename(filename)}`
}

function extractObjectKey(urlOrKey: string) {
  const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '')
  if (publicUrl && urlOrKey.startsWith(`${publicUrl}/`)) {
    return decodeURIComponent(urlOrKey.slice(publicUrl.length + 1))
  }

  if (/^(dev|stag|prod)\//.test(urlOrKey)) return urlOrKey

  return null
}

async function r2Request(method: 'GET' | 'PUT' | 'DELETE', key: string, body?: Buffer, contentType?: string) {
  const bucket = getBucket()
  const accessKeyId = requiredEnv('R2_ACCESS_KEY_ID')
  const secretAccessKey = requiredAnyEnv(['R2_SECRET_ACCESS_KEY', 'R2_API_KEY'])
  const endpoint = getR2Endpoint()
  const endpointUrl = new URL(endpoint)
  const payload = body || Buffer.from('')
  const payloadHash = hash(payload)
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.slice(0, 8)
  const canonicalUri = `/${encodePathSegment(bucket)}/${encodeObjectPath(key)}`
  const credentialScope = `${dateStamp}/${R2_REGION}/${R2_SERVICE}/aws4_request`
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'
  const canonicalHeaders =
    `host:${endpointUrl.host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`

  const canonicalRequest = [
    method,
    canonicalUri,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n')

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    hash(canonicalRequest),
  ].join('\n')

  const dateKey = hmac(`AWS4${secretAccessKey}`, dateStamp)
  const regionKey = hmac(dateKey, R2_REGION)
  const serviceKey = hmac(regionKey, R2_SERVICE)
  const signingKey = hmac(serviceKey, 'aws4_request')
  const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex')

  const headers: HeadersInit = {
    Authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
  }

  if (contentType) headers['Content-Type'] = contentType

  const response = await fetch(`${endpoint}${canonicalUri}`, {
    method,
    headers,
    body: method === 'PUT' ? (payload as BodyInit) : undefined,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`R2 ${method} failed (${response.status}): ${message}`)
  }

  return response
}

export async function uploadToStorage(file: File, path: string): Promise<string> {
  const key = createObjectKey(path, file.name)
  const buffer = Buffer.from(await file.arrayBuffer())

  await r2Request('PUT', key, buffer, file.type)

  return key
}

export async function getFromStorage(path: string): Promise<Response> {
  return r2Request('GET', path)
}

export async function deleteFromStorage(urls: string[]): Promise<void> {
  const keys = urls
    .map(extractObjectKey)
    .filter((key): key is string => key !== null)

  await Promise.all(keys.map(key => r2Request('DELETE', key)))
}
