'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Save, Loader2, ArrowLeft, Trash2, Upload, X, Code } from 'lucide-react'
import Link from 'next/link'
import RichTextEditor from '@/components/RichTextEditor'
import { getStoragePublicUrl } from '@/lib/storage-url'

interface KetentuanEditFormProps {
  initialData: {
    id: string
    order_number: number
    title: string
    content: string
    icon: string | null
    is_active: boolean
  }
}

export default function KetentuanEditForm({ initialData }: KetentuanEditFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [iconUrl, setIconUrl] = useState(initialData.icon || '')
  const [iconError, setIconError] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    order_number: initialData.order_number.toString(),
    title: initialData.title,
    content: initialData.content,
    is_active: initialData.is_active,
  })

  const isSvgContent = (value: string) => value.trimStart().startsWith('<svg') || value.trimStart().startsWith('<?xml')

  const handleSvgFile = (file: File) => {
    if (file.type !== 'image/svg+xml' && !file.name.endsWith('.svg')) {
      toast.error('Hanya file SVG yang didukung untuk upload')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (content && isSvgContent(content)) {
        setIconUrl(content)
        setIconError(false)
        toast.success('SVG berhasil diekstrak')
      } else {
        toast.error('File bukan SVG yang valid')
      }
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleSvgFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/ketentuan/${initialData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order_number: parseInt(formData.order_number),
          icon: iconUrl || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update ketentuan')
      }

      toast.success('Ketentuan updated successfully!')
      router.push('/monolith-core/ketentuan')
      router.refresh()
    } catch (error) {
      console.error('Error updating ketentuan:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update ketentuan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Hapus ketentuan "${initialData.title}"? Aksi ini tidak bisa dibatalkan.`)) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/ketentuan/${initialData.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete ketentuan')
      }

      toast.success('Ketentuan deleted successfully!')
      router.push('/monolith-core/ketentuan')
      router.refresh()
    } catch (error) {
      console.error('Error deleting ketentuan:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete ketentuan')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/monolith-core/ketentuan"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Ketentuan</h1>
            <p className="text-gray-500 text-sm">Update ketentuan pemesanan.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-200 active:scale-95 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menghapus...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Order Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="order_number" className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="order_number"
                  required
                  min="1"
                  value={formData.order_number}
                  onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Icon */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Opsional)</label>

              {/* SVG Upload Zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,image/svg+xml"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) handleSvgFile(file)
                    e.target.value = ''
                  }}
                />
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-medium">
                  Drop file SVG di sini atau <span className="text-blue-600">klik untuk upload</span>
                </p>
                <p className="text-[10px] text-gray-400 mt-1">Isi SVG akan diekstrak otomatis sebagai icon</p>
              </div>

              {/* Manual input: SVG string atau URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Atau masukkan SVG / URL manual</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs resize-y"
                  placeholder={'<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>\natau\nhttps://cdn.example.com/icon.png'}
                  value={iconUrl}
                  onChange={e => {
                    setIconUrl(e.target.value)
                    setIconError(false)
                  }}
                />
              </div>

              {/* Icon Preview */}
              {iconUrl && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center p-2 shadow-sm shrink-0">
                    {isSvgContent(iconUrl) ? (
                      <div
                        className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                        dangerouslySetInnerHTML={{ __html: iconUrl }}
                      />
                    ) : iconError ? (
                      <Code className="w-6 h-6 text-red-300" />
                    ) : (
                      <img
                        src={getStoragePublicUrl(iconUrl)}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={() => setIconError(true)}
                        onLoad={() => setIconError(false)}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-gray-500">
                      {isSvgContent(iconUrl) ? 'Inline SVG' : iconError ? 'URL tidak valid' : 'URL / Storage Path'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIconUrl(''); setIconError(false) }}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Content (Rich Text) */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
                placeholder="Ketentuan ini mengatur hubungan kerja sama..."
              />
            </div>

            {/* Is Active */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active (tampilkan di halaman publik)
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
            <Link
              href="/monolith-core/ketentuan"
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
