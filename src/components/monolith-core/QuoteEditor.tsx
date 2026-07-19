'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Save, Loader2, Quote as QuoteIcon } from 'lucide-react'

interface QuoteEditorProps {
  initialData: {
    id: string
    text: string
    author: string | null
    position: string | null
    created_at: Date
    updated_at: Date
  }
}

export default function QuoteEditor({ initialData }: QuoteEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    text: initialData.text,
    author: initialData.author || '',
    position: initialData.position || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/quote', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update quote')
      }

      toast.success('Quote updated successfully!')
      router.refresh()
    } catch (error) {
      console.error('Error updating quote:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update quote')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Preview Quote */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
            <div className="flex items-start gap-4">
              <QuoteIcon className="w-8 h-8 text-gray-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-lg text-gray-700 italic leading-relaxed mb-3">
                  "{formData.text || 'Your quote will appear here...'}"
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  — {formData.author || 'Author Name'}
                  {formData.position && <span className="text-gray-500">, {formData.position}</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Quote Text */}
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
              Quote Text <span className="text-red-500">*</span>
            </label>
            <textarea
              id="text"
              required
              rows={4}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Great software isn't just about code..."
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Quote inspirational yang ditampilkan di bagian bawah halaman About
            </p>
          </div>

          {/* Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Monark Team"
              />
            </div>

            {/* Position */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                Position / Title
              </label>
              <input
                type="text"
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Founders & Developers"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(initialData.updated_at).toLocaleString('id-ID')}
          </p>
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
  )
}
