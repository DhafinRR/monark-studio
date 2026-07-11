'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Save, Loader2, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import RichTextEditor from '@/components/RichTextEditor'

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
  const [formData, setFormData] = useState({
    order_number: initialData.order_number.toString(),
    title: initialData.title,
    content: initialData.content,
    icon: initialData.icon || '',
    is_active: initialData.is_active,
  })

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
            {/* Order Number & Icon */}
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

              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
                  Icon / Emoji
                </label>
                <input
                  type="text"
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="📜"
                />
              </div>
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
