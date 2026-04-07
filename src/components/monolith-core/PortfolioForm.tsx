'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Save, Loader2, Upload, X, Plus, Trash2,
  Image as ImageIcon, Layers, FileText, Globe, GripVertical
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface TechStack {
  id: string
  name: string
  icon_url: string | null
  color_hex: string | null
}

interface PortfolioData {
  id: string
  title: string
  description: string
  full_description: string | null
  type: 'WEB' | 'MOBILE'
  image_url: string
  gallery: string[]
  stacks: TechStack[]
  features: string[]
  client_name: string | null
  project_url: string | null
}

interface PortfolioFormProps {
  initialData?: PortfolioData
  id?: string
}

type ImageItem = { type: 'url'; value: string } | { type: 'file'; file: File; preview: string }

const ASPECT_RATIO = 16 / 9
const ASPECT_TOLERANCE = 0.2

function validateAspectRatio(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => {
      const ratio = img.width / img.height
      resolve(Math.abs(ratio - ASPECT_RATIO) <= ASPECT_TOLERANCE)
    }
    img.onerror = () => resolve(false)
    img.src = URL.createObjectURL(file)
  })
}

async function uploadFile(file: File, path: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', path)

  const res = await fetch('/api/upload', { method: 'POST', body: formData })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Upload gagal')
  }
  const data = await res.json()
  return data.url
}

async function uploadFiles(files: File[], path: string): Promise<string[]> {
  const formData = new FormData()
  files.forEach(f => formData.append('files', f))
  formData.append('path', path)

  const res = await fetch('/api/upload', { method: 'POST', body: formData })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Upload gagal')
  }
  const data = await res.json()
  return data.urls
}

async function deleteFile(url: string): Promise<void> {
  const res = await fetch('/api/upload', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Gagal menghapus file')
  }
}

async function deleteFiles(urls: string[]): Promise<void> {
  if (urls.length === 0) return
  const res = await fetch('/api/upload', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Gagal menghapus file')
  }
}

export default function PortfolioForm({ initialData, id }: PortfolioFormProps) {
  const router = useRouter()
  const isEdit = !!initialData

  // Form fields
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [fullDescription, setFullDescription] = useState(initialData?.full_description || '')
  const [type, setType] = useState<'WEB' | 'MOBILE'>(initialData?.type || 'WEB')
  const [clientName, setClientName] = useState(initialData?.client_name || '')
  const [projectUrl, setProjectUrl] = useState(initialData?.project_url || '')

  // Image states
  const [thumbnail, setThumbnail] = useState<ImageItem | null>(
    initialData?.image_url ? { type: 'url', value: initialData.image_url } : null
  )
  const [gallery, setGallery] = useState<ImageItem[]>(
    initialData?.gallery?.map(url => ({ type: 'url' as const, value: url })) || []
  )

  // Stacks
  const [allStacks, setAllStacks] = useState<TechStack[]>([])
  const [selectedStackIds, setSelectedStackIds] = useState<string[]>(
    initialData?.stacks?.map(s => s.id) || []
  )

  // Features
  const [features, setFeatures] = useState<string[]>(initialData?.features || [])
  const [newFeature, setNewFeature] = useState('')

  const [loading, setLoading] = useState(false)
  const [thumbDragOver, setThumbDragOver] = useState(false)
  const [galleryDragOver, setGalleryDragOver] = useState(false)
  const thumbInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/monolith-core/tech-stacks')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setAllStacks(data) })
      .catch(() => {})
  }, [])

  const handleImageFile = useCallback(async (file: File, target: 'thumbnail' | 'gallery') => {
    if (!file.type.startsWith('image/')) {
      toast.error('Hanya file gambar yang didukung')
      return
    }
    const valid = await validateAspectRatio(file)
    if (!valid) {
      toast.error('Rasio gambar harus mendekati 16:9')
      return
    }
    const preview = URL.createObjectURL(file)
    const item: ImageItem = { type: 'file', file, preview }

    if (target === 'thumbnail') {
      // Revoke old preview
      if (thumbnail?.type === 'file') URL.revokeObjectURL(thumbnail.preview)
      setThumbnail(item)
    } else {
      setGallery(prev => [...prev, item])
    }
  }, [thumbnail])

  const handleThumbDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setThumbDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageFile(file, 'thumbnail')
  }

  const handleGalleryDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setGalleryDragOver(false)
    Array.from(e.dataTransfer.files).forEach(f => handleImageFile(f, 'gallery'))
  }

  const removeGalleryItem = (index: number) => {
    setGallery(prev => {
      const item = prev[index]
      if (item.type === 'file') URL.revokeObjectURL(item.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const removeThumbnail = () => {
    if (thumbnail?.type === 'file') URL.revokeObjectURL(thumbnail.preview)
    setThumbnail(null)
  }

  const toggleStack = (stackId: string) => {
    setSelectedStackIds(prev =>
      prev.includes(stackId) ? prev.filter(id => id !== stackId) : [...prev, stackId]
    )
  }

  const addFeature = (value?: string) => {
    const val = (value ?? newFeature).trim()
    if (!val) return
    if (features.includes(val)) { toast.error('Fitur sudah ada'); return }
    setFeatures(prev => [...prev, val])
    setNewFeature('')
  }

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index))
  }

  const getImageSrc = (item: ImageItem) =>
    item.type === 'url' ? item.value : item.preview

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!thumbnail) { toast.error('Thumbnail wajib diisi'); return }

    setLoading(true)
    try {
      // For create mode: POST first to get ID, then upload images, then PATCH
      // For edit mode: ID already exists, upload then PATCH
      let recordId = id || ''

      if (!isEdit) {
        // Create record first with placeholder image_url
        const createRes = await fetch('/api/monolith-core/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            full_description: fullDescription || null,
            type,
            image_url: 'pending-upload',
            gallery: [],
            stacks: selectedStackIds,
            features,
            client_name: clientName || null,
            project_url: projectUrl || null,
          }),
        })
        if (!createRes.ok) {
          const data = await createRes.json()
          throw new Error(data.error || 'Gagal membuat portfolio')
        }
        const created = await createRes.json()
        recordId = created.id
      }

      // Delete old images that were removed (edit mode)
      if (isEdit && initialData) {
        const urlsToDelete: string[] = []

        // Thumbnail changed → delete old one
        if (thumbnail.type === 'file' && initialData.image_url) {
          urlsToDelete.push(initialData.image_url)
        }

        // Gallery items removed → collect old URLs no longer present
        const currentGalleryUrls = gallery
          .filter(g => g.type === 'url')
          .map(g => (g as Extract<ImageItem, { type: 'url' }>).value)
        const removedGalleryUrls = initialData.gallery.filter(
          url => !currentGalleryUrls.includes(url)
        )
        urlsToDelete.push(...removedGalleryUrls)

        await deleteFiles(urlsToDelete)
      }

      // Upload thumbnail — path: portfolio/{id}/thumbnail
      let imageUrl: string
      if (thumbnail.type === 'file') {
        imageUrl = await uploadFile(thumbnail.file, `portfolio/${recordId}/thumbnail`)
      } else {
        imageUrl = thumbnail.value
      }

      // Upload gallery files — path: portfolio/{id}/gallery
      const existingGalleryUrls = gallery
        .filter(g => g.type === 'url')
        .map(g => (g as Extract<ImageItem, { type: 'url' }>).value)
      const newGalleryFiles = gallery.filter(g => g.type === 'file') as Extract<ImageItem, { type: 'file' }>[]

      const uploadedGalleryUrls = newGalleryFiles.length > 0
        ? await uploadFiles(newGalleryFiles.map(g => g.file), `portfolio/${recordId}/gallery`)
        : []
      const galleryUrls = [...existingGalleryUrls, ...uploadedGalleryUrls]

      // PATCH with final URLs (both create & edit)
      const patchRes = await fetch(`/api/monolith-core/portfolio/${recordId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          full_description: fullDescription || null,
          type,
          stacks: selectedStackIds,
          features,
          client_name: clientName || null,
          project_url: projectUrl || null,
          image_url: imageUrl,
          gallery: galleryUrls,
        }),
      })

      if (patchRes.ok) {
        toast.success(isEdit ? 'Portfolio berhasil diperbarui!' : 'Portfolio baru berhasil dibuat!')
        router.push('/monolith-core/portfolio')
      } else {
        const data = await patchRes.json()
        toast.error(data.error || 'Terjadi kesalahan')
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/monolith-core/portfolio" className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
          <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isEdit ? 'Edit Portfolio' : 'Tambah Portfolio Baru'}
          </h1>
          <p className="text-gray-500 text-sm">
            {isEdit ? 'Perbarui data proyek portfolio' : 'Tambahkan proyek baru ke portfolio'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Informasi Dasar</h2>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Judul *</label>
            <input
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              placeholder="Nama proyek portfolio"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Deskripsi Singkat *</label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              placeholder="Deskripsi singkat proyek"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Deskripsi Lengkap</label>
            <textarea
              rows={5}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              placeholder="Penjelasan detail proyek (opsional)"
              value={fullDescription}
              onChange={e => setFullDescription(e.target.value)}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipe Proyek</label>
            <div className="flex gap-3">
              {(['WEB', 'MOBILE'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    type === t
                      ? t === 'WEB'
                        ? 'bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200'
                        : 'bg-violet-50 text-violet-700 ring-2 ring-violet-200'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Client & URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Client</label>
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Opsional"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">URL Proyek</label>
              <input
                type="url"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
                value={projectUrl}
                onChange={e => setProjectUrl(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Thumbnail */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Thumbnail *</h2>
          </div>

          {thumbnail ? (
            <div className="relative group">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img src={getImageSrc(thumbnail)} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={removeThumbnail}
                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={e => { e.preventDefault(); setThumbDragOver(true) }}
              onDragLeave={() => setThumbDragOver(false)}
              onDrop={handleThumbDrop}
              onClick={() => thumbInputRef.current?.click()}
              className={`aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                thumbDragOver
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100/50'
              }`}
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 font-medium">
                Drop gambar di sini atau <span className="text-blue-600">klik untuk upload</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-1">Rasio 16:9, maks 10MB</p>
            </div>
          )}
          <input
            ref={thumbInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleImageFile(file, 'thumbnail')
              e.target.value = ''
            }}
          />
        </section>

        {/* Gallery */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Gallery</h2>
          </div>

          {gallery.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery.map((item, i) => (
                <div key={i} className="relative group">
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={getImageSrc(item)} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(i)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            onDragOver={e => { e.preventDefault(); setGalleryDragOver(true) }}
            onDragLeave={() => setGalleryDragOver(false)}
            onDrop={handleGalleryDrop}
            onClick={() => galleryInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              galleryDragOver
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100/50'
            }`}
          >
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-medium">
              Tambah gambar gallery (16:9)
            </p>
          </div>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => {
              Array.from(e.target.files || []).forEach(f => handleImageFile(f, 'gallery'))
              e.target.value = ''
            }}
          />
        </section>

        {/* Tech Stacks */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Tech Stacks</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {allStacks.map(stack => {
              const selected = selectedStackIds.includes(stack.id)
              const color = stack.color_hex || '#3b82f6'
              return (
                <button
                  key={stack.id}
                  type="button"
                  onClick={() => toggleStack(stack.id)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    selected
                      ? 'ring-2 ring-offset-1'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: `${color}15`,
                    color,
                    borderColor: `${color}30`,
                    ...(selected ? { ringColor: color } : {}),
                  }}
                >
                  {stack.name}
                </button>
              )
            })}
            {allStacks.length === 0 && (
              <p className="text-sm text-gray-400">Belum ada tech stack. Tambah dari menu Tech Stacks.</p>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
            <Globe className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Fitur</h2>
          </div>

          <div className="space-y-3">
            {features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
                <span className="flex-1 text-sm text-gray-700">{feat}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <div>
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Ketik fitur lalu tekan Enter atau koma untuk menambah..."
                value={newFeature}
                onChange={e => {
                  const v = e.target.value
                  if (v.endsWith(',')) {
                    addFeature(v.slice(0, -1))
                  } else {
                    setNewFeature(v)
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); addFeature() }
                  if (e.key === 'Backspace' && !newFeature && features.length > 0) {
                    removeFeature(features.length - 1)
                  }
                }}
              />
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            disabled={loading || !title.trim() || !description.trim() || !thumbnail}
            type="submit"
            className="px-10 py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-blue-700 transition-all flex items-center shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            )}
            {loading ? 'Mengupload & Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Portfolio'}
          </button>
        </div>
      </form>
    </div>
  )
}
