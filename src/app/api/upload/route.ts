import { NextResponse } from 'next/server'
import { deleteFromStorage, uploadToStorage } from '@/lib/r2'
import { adminLimiter, checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { tooManyRequests, badRequest, internalError } from '@/lib/api-response'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

function validateFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Tipe file "${file.name}" tidak didukung. Gunakan JPEG, PNG, WebP, GIF, atau AVIF.`
  }
  if (file.size > MAX_SIZE) {
    return `File "${file.name}" melebihi batas 10MB`
  }
  return null
}

/**
 * POST /api/upload
 * FormData params:
 *   - file (single) atau files (multiple)
 *   - path: `{table}/{id}/{kelompok-file}` (e.g. `portfolio/abc-123/thumbnail`)
 *
 * Bucket = R2 bucket (default: monark)
 * Prefix diambil dari APP_ENV/NODE_ENV: production/prod -> prod, staging/stag -> stag, selain itu -> dev
 * Final storage path: `{prefix}/{table}/{id}/{name}/{filename}.{ext}`
 *
 * Single file  → `{ path: string }`
 * Multiple files → `{ paths: string[] }`
 */
export async function POST(req: Request) {
  const ip = getClientIP(req)
  const rateCheck = await checkRateLimit(adminLimiter, ip)
  if (!rateCheck.allowed) {
    return tooManyRequests(rateCheck.retryAfter!)
  }

  try {
    const formData = await req.formData()
    const path = formData.get('path') as string | null

    if (!path) {
      return badRequest('Path wajib diisi (table/id/kelompok-file)')
    }

    const singleFile = formData.get('file') as File | null
    const multipleFiles = formData.getAll('files') as File[]

    if (singleFile) {
      const err = validateFile(singleFile)
      if (err) return badRequest(err)

      const uploadedPath = await uploadToStorage(singleFile, path)
      return NextResponse.json({ path: uploadedPath })
    }

    if (multipleFiles.length > 0) {
      for (const file of multipleFiles) {
        const err = validateFile(file)
        if (err) return badRequest(err)
      }

      const paths = await Promise.all(
        multipleFiles.map(file => uploadToStorage(file, path))
      )
      return NextResponse.json({ paths })
    }

    return badRequest('Tidak ada file yang dikirim')
  } catch (error) {
    console.error('[UPLOAD_POST]', error)
    return internalError('Gagal mengupload file')
  }
}

/**
 * DELETE /api/upload
 * Body JSON:
 *   - url: string        → hapus 1 file dari path atau public URL
 *   - urls: string[]     → hapus banyak file dari path atau public URL
 *
 * Returns: `{ success: true }`
 */
export async function DELETE(req: Request) {
  const ip = getClientIP(req)
  const rateCheck = await checkRateLimit(adminLimiter, ip)
  if (!rateCheck.allowed) {
    return tooManyRequests(rateCheck.retryAfter!)
  }

  try {
    const body = await req.json()
    const { url, urls } = body as { url?: string; urls?: string[] }

    const publicUrls = urls || (url ? [url] : [])
    if (publicUrls.length === 0) {
      return badRequest('URL file wajib diisi')
    }

    await deleteFromStorage(publicUrls)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[UPLOAD_DELETE]', error)
    return internalError('Gagal menghapus file')
  }
}
