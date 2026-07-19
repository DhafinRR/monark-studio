import { NextResponse } from 'next/server'
import { getFromStorage } from '@/lib/r2'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Storage proxy hanya aktif di development' }, { status: 404 })
  }

  try {
    const { path } = await params
    const objectPath = path.map(segment => decodeURIComponent(segment)).join('/')

    if (!objectPath || objectPath.includes('..')) {
      return NextResponse.json({ error: 'Invalid storage path' }, { status: 400 })
    }

    const r2Response = await getFromStorage(objectPath)
    const headers = new Headers()
    const contentType = r2Response.headers.get('content-type')
    const contentLength = r2Response.headers.get('content-length')
    const etag = r2Response.headers.get('etag')
    const cacheControl = r2Response.headers.get('cache-control')

    if (contentType) headers.set('content-type', contentType)
    if (contentLength) headers.set('content-length', contentLength)
    if (etag) headers.set('etag', etag)
    if (cacheControl) headers.set('cache-control', cacheControl)

    return new Response(r2Response.body, {
      status: r2Response.status,
      headers,
    })
  } catch (error) {
    console.error('[STORAGE_PROXY_GET]', error)
    return NextResponse.json({ error: 'Gagal mengambil file storage' }, { status: 502 })
  }
}
