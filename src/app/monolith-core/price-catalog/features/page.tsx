'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDialog from '@/components/monolith-core/ConfirmDialog'

interface Feature {
  id: string
  name: string
  category: string
  price: string
  description: string | null
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Authentication',
    price: '',
    description: ''
  })

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'info' | 'warning' | 'danger';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  useEffect(() => {
    fetchFeatures()
  }, [])

  const fetchFeatures = async () => {
    try {
      const res = await fetch('/api/monolith-core/features')
      const data = await res.json()
      if (res.ok && Array.isArray(data)) setFeatures(data)
      else setFeatures([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/monolith-core/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setIsModalOpen(false)
        fetchFeatures()
        setFormData({ name: '', category: 'Authentication', price: '', description: '' })
        toast.success('Fitur baru berhasil ditambahkan ke katalog!')
      } else {
        toast.error('Gagal menambahkan fitur.')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Fitur?',
      message: 'Apakah Anda yakin ingin menghapus fitur ini dari katalog? Tindakan ini tidak dapat dibatalkan.',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/monolith-core/features/${id}`, { method: 'DELETE' })
          if (res.ok) {
            fetchFeatures()
            toast.success('Fitur berhasil dihapus dari katalog.')
          } else {
            toast.error('Gagal menghapus fitur.')
          }
        } catch (error) {
          toast.error('Terjadi kesalahan sistem.')
        }
      }
    })
  }

  const filteredFeatures = (Array.isArray(features) ? features : []).filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Feature Catalog</h1>
          <p className="text-gray-500 text-sm">Manage standard features and their pricing</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10 text-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Feature
        </button>
      </div>

      {/* Search & Stats */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search feature or category..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-100 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Found <span className="text-gray-900">{filteredFeatures.length}</span> entries
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Feature & Description</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Base Price</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {loading && features.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Syncing Catalog...</span>
                  </td>
                </tr>
              ) : filteredFeatures.length === 0 ? (
                <tr>
                   <td colSpan={4} className="px-6 py-16 text-center text-gray-400 italic text-sm">
                    No features matched your search criteria.
                  </td>
                </tr>
              ) : (
                filteredFeatures.map((feature) => (
                  <tr key={feature.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{feature.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{feature.description || 'No description provided'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white border border-gray-200 text-gray-500">
                        {feature.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900 text-right text-sm">
                      Rp {Number(feature.price).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(feature.id)}
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

      {/* Modal Add Feature */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">New Feature</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900"
              >
                <Plus className="rotate-45 w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Feature Identity</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                  placeholder="e.g., Google OAuth 2.0"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Logic Category</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm appearance-none"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option>Authentication</option>
                  <option>Payment Integration</option>
                  <option>Cloud Storage</option>
                  <option>UI/UX Components</option>
                  <option>Messaging/Notification</option>
                  <option>Custom Development</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Cost (IDR)</label>
                <input 
                  required
                  type="number" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                  placeholder="e.g., 750000"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Implementation Details</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm italic text-gray-500"
                  placeholder="Briefly describe what this feature provides..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="pt-4">
                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full py-4 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-gray-900/10 disabled:bg-gray-400 active:scale-95"
                >
                  {loading ? 'Processing...' : 'Catalog Feature'}
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
