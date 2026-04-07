import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

export function getBucket() {
  const env = process.env.APP_ENV || process.env.NODE_ENV || 'development'
  if (env === 'production') return 'prod'
  if (env === 'staging') return 'stag'
  return 'dev'
}

/**
 * Ekstrak storage path dari public URL.
 * Format: `{supabaseUrl}/storage/v1/object/public/{bucket}/{path}`
 */
function extractStoragePath(publicUrl: string): string | null {
  const bucket = getBucket()
  const marker = `/storage/v1/object/public/${bucket}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return null
  return publicUrl.slice(idx + marker.length)
}

/**
 * Hapus file dari Supabase Storage berdasarkan public URL.
 * Menerima 1 atau banyak URL. Mengabaikan URL yang tidak valid.
 */
export async function deleteFromStorage(urls: string[]): Promise<void> {
  if (urls.length === 0) return

  const paths = urls
    .map(extractStoragePath)
    .filter((p): p is string => p !== null)

  if (paths.length === 0) return

  const { error } = await supabase.storage.from(getBucket()).remove(paths)
  if (error) {
    console.error('[STORAGE_DELETE_ERROR]', error)
    throw error
  }
}
