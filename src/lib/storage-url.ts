function isAbsoluteOrLocalUrl(value: string) {
  return /^(https?:|data:|blob:|\/)/.test(value) || value.trimStart().startsWith('<')
}

function encodePath(path: string) {
  return path
    .split('/')
    .filter(Boolean)
    .map(segment => encodeURIComponent(segment))
    .join('/')
}

export function getStoragePublicUrl(path: string | null | undefined) {
  if (!path) return ''

  if (isAbsoluteOrLocalUrl(path)) return path

  if (process.env.NODE_ENV === 'development') {
    return `/api/storage/${encodePath(path)}`
  }

  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL
  if (!baseUrl) return path

  return `${baseUrl.replace(/\/$/, '')}/${encodePath(path)}`
}

export function getStoragePath(value: string | null | undefined) {
  if (!value) return ''

  const publicUrls = [
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
    process.env.R2_PUBLIC_URL,
  ]
    .filter((url): url is string => Boolean(url))
    .map(url => url.replace(/\/$/, ''))

  for (const publicUrl of publicUrls) {
    if (value.startsWith(`${publicUrl}/`)) {
      return decodeURIComponent(value.slice(publicUrl.length + 1))
    }
  }

  return value
}

export function withStoragePublicUrls<T extends { image_url?: string | null; gallery?: string[] | null }>(item: T) {
  return {
    ...item,
    image_url: item.image_url ? getStoragePublicUrl(item.image_url) : item.image_url,
    gallery: Array.isArray(item.gallery)
      ? item.gallery.map(path => getStoragePublicUrl(path))
      : item.gallery,
  }
}
