'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Code, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface TechStack {
  id: string
  name: string
  icon_url: string | null
  color_hex: string | null
}

interface TechStackFormProps {
  initialData?: TechStack
  id?: string
}

export default function TechStackForm({ initialData, id }: TechStackFormProps) {
  const router = useRouter()
  const isEdit = !!initialData

  const [name, setName] = useState(initialData?.name || '')
  const [iconUrl, setIconUrl] = useState(initialData?.icon_url || '')
  const [colorHex, setColorHex] = useState(initialData?.color_hex || '#3b82f6')
  const [loading, setLoading] = useState(false)
  const [iconError, setIconError] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    setLoading(true)

    try {
      const url = isEdit
        ? `/api/monolith-core/tech-stacks/${id}`
        : '/api/monolith-core/tech-stacks'
      const method = isEdit ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          icon_url: iconUrl || null,
          color_hex: colorHex,
        }),
      })

      if (res.ok) {
        toast.success(isEdit ? 'Tech Stack berhasil diperbarui!' : 'Tech Stack baru berhasil dibuat!')
        router.push('/monolith-core/tech-stacks')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Terjadi kesalahan')
      }
    } catch {
      toast.error('Gagal menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/monolith-core/tech-stacks" className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
          <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isEdit ? 'Edit Tech Stack' : 'Tambah Tech Stack Baru'}
          </h1>
          <p className="text-gray-500 text-sm">
            {isEdit ? 'Perbarui data teknologi yang sudah ada' : 'Tambahkan teknologi baru ke dalam daftar'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Form Fields */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
            <Code className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Detail Stack</h2>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Stack *</label>
            <input
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              placeholder="Contoh: React, Next.js, Tailwind CSS"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Icon */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Icon (Opsional)</label>

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
                      src={iconUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={() => setIconError(true)}
                      onLoad={() => setIconError(false)}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-gray-500">
                    {isSvgContent(iconUrl) ? 'Inline SVG' : iconError ? 'URL tidak valid' : 'External URL'}
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

          {/* Color Hex */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pill Color (Opsional)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="w-12 h-12 rounded-xl border border-gray-100 cursor-pointer bg-transparent p-1"
                value={colorHex}
                onChange={e => setColorHex(e.target.value)}
              />
              <input
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono font-medium lowercase"
                placeholder="#3b82f6"
                value={colorHex}
                onChange={e => setColorHex(e.target.value)}
              />
            </div>
            {/* Color Preview */}
            <div className="flex items-center gap-2 pt-2">
              <div
                className="w-3 h-3 rounded-full border border-gray-200"
                style={{ backgroundColor: colorHex }}
              />
              <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs font-mono border border-gray-100 lowercase">
                {colorHex}
              </span>
              <span className="text-xs text-gray-400 ml-1">Preview pill color</span>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            disabled={loading || !name.trim()}
            type="submit"
            className="px-10 py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-blue-700 transition-all flex items-center shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            )}
            {isEdit ? 'Simpan Perubahan' : 'Tambah Stack'}
          </button>
        </div>
      </form>
    </div>
  )
}
