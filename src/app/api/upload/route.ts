import { NextResponse } from 'next/server'
import { supabase, getBucket, deleteFromStorage } from '@/lib/supabase'
import { randomUUID } from 'crypto'

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

async function uploadToStorage(file: File, path: string): Promise<string> {
  const bucket = getBucket()
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${path}/${randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
  return data.publicUrl
}

/**
 * POST /api/upload
 * FormData params:
 *   - file (single) atau files (multiple)
 *   - path: `{table}/{id}/{name}` (e.g. `portfolio/abc-123/thumbnail`)
 *
 * Bucket = mode (dev/stag/prod)
 * Final storage path: `{table}/{id}/{name}/{uuid}.{ext}`
 *
 * Single file  → `{ url: string }`
 * Multiple files → `{ urls: string[] }`
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const path = formData.get('path') as string | null

    if (!path) {
      return NextResponse.json({ error: 'Path wajib diisi (table/id/name)' }, { status: 400 })
    }

    const singleFile = formData.get('file') as File | null
    const multipleFiles = formData.getAll('files') as File[]

    // Single file upload
    if (singleFile) {
      const err = validateFile(singleFile)
      if (err) return NextResponse.json({ error: err }, { status: 400 })

      const url = await uploadToStorage(singleFile, path)
      return NextResponse.json({ url })
    }

    // Multiple files upload
    if (multipleFiles.length > 0) {
      for (const file of multipleFiles) {
        const err = validateFile(file)
        if (err) return NextResponse.json({ error: err }, { status: 400 })
      }

      const urls = await Promise.all(
        multipleFiles.map(file => uploadToStorage(file, path))
      )
      return NextResponse.json({ urls })
    }

    return NextResponse.json({ error: 'Tidak ada file yang dikirim' }, { status: 400 })
  } catch (error) {
    console.error('[UPLOAD_POST]', error)
    return NextResponse.json({ error: 'Gagal mengupload file' }, { status: 500 })
  }
}

/**
 * DELETE /api/upload
 * Body JSON:
 *   - url: string        → hapus 1 file
 *   - urls: string[]     → hapus banyak file
 *
 * Returns: `{ success: true }`
 */
export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { url, urls } = body as { url?: string; urls?: string[] }

    const publicUrls = urls || (url ? [url] : [])
    if (publicUrls.length === 0) {
      return NextResponse.json({ error: 'URL file wajib diisi' }, { status: 400 })
    }

    await deleteFromStorage(publicUrls)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[UPLOAD_DELETE]', error)
    return NextResponse.json({ error: 'Gagal menghapus file' }, { status: 500 })
  }
}
