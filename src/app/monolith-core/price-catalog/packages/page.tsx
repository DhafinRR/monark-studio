'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Loader2, Search, X, Star, ToggleLeft, ToggleRight } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDialog from '@/components/monolith-core/ConfirmDialog'

interface Package {
  id: string
  name: string
  tagline: string | null
  target: string | null
  price_note: string | null
  floor_price: string
  max_slots: number
  benefits: string[]
  default_features: string[]
  is_popular: boolean
  is_active: boolean
}

const emptyForm = {
  id: '',
  name: '',
  tagline: '',
  target: '',
  price_note: '',
  floor_price: '',
  max_slots: '',
  benefits: [] as string[],
  default_features: [] as string[],
  is_popular: false,
  is_active: true,
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [formData, setFormData] = useState(emptyForm)
  const [newBenefit, setNewBenefit] = useState('')
  const [newFeature, setNewFeature] = useState('')

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    type?: 'info' | 'warning' | 'danger'
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/monolith-core/pricing-packages')
      const data = await res.json()
      if (res.ok && Array.isArray(data)) setPackages(data)
      else setPackages([])
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setNewBenefit('')
    setNewFeature('')
    setIsModalOpen(true)
  }

  const openEdit = (pkg: Package) => {
    setEditingId(pkg.id)
    setFormData({
      id: pkg.id,
      name: pkg.name,
      tagline: pkg.tagline || '',
      target: pkg.target || '',
      price_note: pkg.price_note || '',
      floor_price: String(pkg.floor_price),
      max_slots: String(pkg.max_slots),
      benefits: pkg.benefits || [],
      default_features: pkg.default_features || [],
      is_popular: pkg.is_popular,
      is_active: pkg.is_active,
    })
    setNewBenefit('')
    setNewFeature('')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...(!editingId && { id: formData.id }),
        name: formData.name,
        tagline: formData.tagline || null,
        target: formData.target || null,
        price_note: formData.price_note || null,
        floor_price: Number(formData.floor_price),
        max_slots: Number(formData.max_slots),
        benefits: formData.benefits,
        default_features: formData.default_features,
        is_popular: formData.is_popular,
        is_active: formData.is_active,
      }

      const url = editingId
        ? `/api/monolith-core/pricing-packages/${editingId}`
        : '/api/monolith-core/pricing-packages'
      const method = editingId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        setIsModalOpen(false)
        fetchPackages()
        toast.success(editingId ? 'Paket berhasil diperbarui!' : 'Paket baru berhasil ditambahkan!')
      } else {
        toast.error(data.error || 'Gagal menyimpan paket.')
      }
    } catch {
      toast.error('Terjadi kesalahan sistem.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (pkg: Package) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Paket?',
      message: `Apakah Anda yakin ingin menghapus paket "${pkg.name}"? Tindakan ini tidak dapat dibatalkan.`,
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/monolith-core/pricing-packages/${pkg.id}`, { method: 'DELETE' })
          const data = await res.json()
          if (res.ok) {
            fetchPackages()
            toast.success('Paket berhasil dihapus.')
          } else {
            toast.error(data.error || 'Gagal menghapus paket.')
          }
        } catch {
          toast.error('Terjadi kesalahan sistem.')
        }
      },
    })
  }

  const addBenefit = () => {
    if (!newBenefit.trim()) return
    setFormData({ ...formData, benefits: [...formData.benefits, newBenefit.trim()] })
    setNewBenefit('')
  }

  const removeBenefit = (index: number) => {
    setFormData({ ...formData, benefits: formData.benefits.filter((_, i) => i !== index) })
  }

  const addFeature = () => {
    if (!newFeature.trim()) return
    setFormData({ ...formData, default_features: [...formData.default_features, newFeature.trim()] })
    setNewFeature('')
  }

  const removeFeature = (index: number) => {
    setFormData({ ...formData, default_features: formData.default_features.filter((_, i) => i !== index) })
  }

  const filteredPackages = packages.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.tagline && p.tagline.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pricing Packages</h1>
          <p className="text-gray-500 text-sm">Manage pricing tiers and their benefits</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10 text-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Package
        </button>
      </div>

      {/* Search & Stats */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search package..."
            className="w-full pl-10 pr-4 py-2 border border-gray-100 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Found <span className="text-gray-900">{filteredPackages.length}</span> packages
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Package</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Target</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Floor Price</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Max Slots</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Popular</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Active</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {loading && packages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading packages...</span>
                  </td>
                </tr>
              ) : filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-400 italic text-sm">
                    No packages found.
                  </td>
                </tr>
              ) : (
                filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{pkg.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{pkg.tagline || '—'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white border border-gray-200 text-gray-500">
                        {pkg.target || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900 text-right text-sm">
                      Rp {Number(pkg.floor_price).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                      {pkg.max_slots}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {pkg.is_popular ? (
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500 mx-auto" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          pkg.is_active
                            ? 'bg-green-50 text-green-600 border border-green-200'
                            : 'bg-red-50 text-red-500 border border-red-200'
                        }`}
                      >
                        {pkg.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(pkg)}
                          className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg)}
                          className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 max-h-[90vh] flex flex-col">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">
                {editingId ? 'Edit Package' : 'New Package'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto flex-1">
              {/* ID (create only) */}
              {!editingId && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Package ID / Slug</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                    placeholder="e.g., basic_web"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  />
                </div>
              )}

              {/* Name & Target row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Package Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                    placeholder="e.g., Basic Web"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Audience</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                    placeholder="e.g., UMKM & Personal"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Tagline</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                  placeholder="e.g., Website profesional untuk bisnis kecil"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>

              {/* Price Note & Floor Price & Max Slots */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Price Note</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                    placeholder="e.g., Mulai dari"
                    value={formData.price_note}
                    onChange={(e) => setFormData({ ...formData, price_note: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Floor Price (IDR)</label>
                  <input
                    required
                    type="number"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                    placeholder="e.g., 600000"
                    value={formData.floor_price}
                    onChange={(e) => setFormData({ ...formData, floor_price: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Slots</label>
                  <input
                    required
                    type="number"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                    placeholder="e.g., 5"
                    value={formData.max_slots}
                    onChange={(e) => setFormData({ ...formData, max_slots: e.target.value })}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-8">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_popular: !formData.is_popular })}
                  className="flex items-center gap-2 text-sm font-bold text-gray-700"
                >
                  {formData.is_popular ? (
                    <ToggleRight className="w-8 h-8 text-amber-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-300" />
                  )}
                  Popular
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className="flex items-center gap-2 text-sm font-bold text-gray-700"
                >
                  {formData.is_active ? (
                    <ToggleRight className="w-8 h-8 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-300" />
                  )}
                  Active
                </button>
              </div>

              {/* Benefits list */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Benefits</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Add a benefit..."
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addBenefit()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all text-sm font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.benefits.length > 0 && (
                  <div className="space-y-1.5 mt-2">
                    {formData.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="flex-1 text-sm text-gray-700">{b}</span>
                        <button
                          type="button"
                          onClick={() => removeBenefit(i)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Default Features list */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Default Features</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Add a default feature..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addFeature()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all text-sm font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.default_features.length > 0 && (
                  <div className="space-y-1.5 mt-2">
                    {formData.default_features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="flex-1 text-sm text-gray-700">{f}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  disabled={saving}
                  type="submit"
                  className="w-full py-4 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-gray-900/10 disabled:bg-gray-400 active:scale-95"
                >
                  {saving ? 'Processing...' : editingId ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
    </div>
  )
}
