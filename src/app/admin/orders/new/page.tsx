'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Sparkles, 
  Loader2, 
  Save, 
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  User,
  ChevronDown,
  Eye,
  X
} from 'lucide-react'
import Link from 'next/link'
import InvoicePreview from '@/components/admin/InvoicePreview'

interface Feature {
  id: string
  name: string
  price: string
}

interface OrderItem {
  id: string
  type: 'CATALOG' | 'CUSTOM'
  description: string
  price: number
  level?: string
  sub_level?: string
  feature_id?: string
  reason?: string
  isAnalyzing?: boolean
}

export default function NewOrderPage() {
  const router = useRouter()
  const [catalog, setCatalog] = useState<Feature[]>([])
  const [complexityPrices, setComplexityPrices] = useState<any[]>([])
  const [client, setClient] = useState({
    name: '',
    whatsapp: '',
    email: '',
    package_type: 'Custom Project'
  })
  const [items, setItems] = useState<OrderItem[]>([
    { id: crypto.randomUUID(), type: 'CATALOG', description: '', price: 0 }
  ])
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Fetch References
  useEffect(() => {
    fetch('/api/admin/features').then(res => res.json()).then(setCatalog)
    fetch('/api/admin/complexity-price').then(res => res.json()).then(setComplexityPrices)
  }, [])

  // Debounce for AI Analysis
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    
    items.forEach((item, index) => {
      if (item.type === 'CUSTOM' && item.description.length > 5 && !item.level && !item.isAnalyzing) {
        const timer = setTimeout(() => {
          analyzeItem(index)
        }, 3000)
        timers.push(timer)
      }
    })

    return () => timers.forEach(clearTimeout)
  }, [items])

  const analyzeItem = async (index: number) => {
    const item = items[index]
    if (!item.description) return

    updateItem(index, { isAnalyzing: true })

    try {
      const res = await fetch('/api/ai/analyze-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: item.description })
      })
      const data = await res.json()
      
      if (data.level) {
        // Find price from our pre-fetched complexityPrices
        const priceObj = complexityPrices.find(p => p.level === data.level && p.sub_level === data.sub_level)
        updateItem(index, {
          level: data.level,
          sub_level: data.sub_level,
          price: priceObj ? Number(priceObj.price) : Number(data.price),
          reason: data.reason,
          isAnalyzing: false
        })
      }
    } catch (error) {
      updateItem(index, { isAnalyzing: false })
    }
  }

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), type: 'CATALOG', description: '', price: 0 }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id))
  }

  const updateItem = (index: number, updates: Partial<OrderItem>) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], ...updates }
    setItems(newItems)
  }

  const handleCatalogSelect = (index: number, featureId: string) => {
    const feature = catalog.find(f => f.id === featureId)
    if (feature) {
      updateItem(index, {
        feature_id: featureId,
        description: feature.name,
        price: Number(feature.price)
      })
    }
  }

  const handleComplexityChange = (index: number, field: 'level' | 'sub_level', value: string) => {
    const item = items[index]
    const nextLevel = field === 'level' ? value : (item.level || 'MUDAH')
    const nextSub = field === 'sub_level' ? value : (item.sub_level || 'MINOR')
    
    const priceObj = complexityPrices.find(p => p.level === nextLevel && p.sub_level === nextSub)
    updateItem(index, {
      [field]: value,
      price: priceObj ? Number(priceObj.price) : item.price
    })
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...client, items })
      })
      if (res.ok) router.push('/admin/orders')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buat Pesanan Baru</h1>
          <p className="text-gray-500 text-sm">Input data klien dan rincian pekerjaan secara manual</p>
        </div>
        <div className="flex-1" />
        <button 
          type="button"
          onClick={() => setShowPreview(true)}
          className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm font-bold text-sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview Invoice
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Client Info Section */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900">Informasi Klien</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Nama Lengkap *</label>
              <input 
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Budi Santoso"
                value={client.name}
                onChange={e => setClient({...client, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Nomor WhatsApp *</label>
              <input 
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="628123456789"
                value={client.whatsapp}
                onChange={e => setClient({...client, whatsapp: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email (Opsional)</label>
              <input 
                type="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="budi@example.com"
                value={client.email}
                onChange={e => setClient({...client, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Judul Proyek</label>
              <input 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Landing Page Startup X"
                value={client.package_type}
                onChange={e => setClient({...client, package_type: e.target.value})}
              />
            </div>
          </div>
        </section>

        {/* Order Items Section */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-50 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-gray-900">Rincian Pekerjaan</h2>
            </div>
            <button 
              type="button"
              onClick={addItem}
              className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center transition-all"
            >
              <Plus className="w-4 h-4 mr-2" /> Tambah Item
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Item Type */}
                  <div className="w-full md:w-48">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tipe</label>
                    <select 
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none text-sm font-medium"
                      value={item.type}
                      onChange={e => updateItem(index, { type: e.target.value as any, description: '', price: 0, level: undefined })}
                    >
                      <option value="CATALOG">Katalog</option>
                      <option value="CUSTOM">Custom (AI)</option>
                    </select>
                  </div>

                  {/* Description / Selection */}
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                      {item.type === 'CATALOG' ? 'Pilih Fitur' : 'Deskripsi Fitur'}
                    </label>
                    {item.type === 'CATALOG' ? (
                      <select 
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none text-sm"
                        value={item.feature_id || ''}
                        onChange={e => handleCatalogSelect(index, e.target.value)}
                      >
                        <option value="">-- Pilih dari Katalog --</option>
                        {catalog.map(f => (
                          <option key={f.id} value={f.id}>{f.name} (Rp {Number(f.price).toLocaleString()})</option>
                        ))}
                      </select>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative">
                          <input 
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none text-sm placeholder:italic"
                            placeholder="Jelaskan kebutuhan fitur klien..."
                            value={item.description}
                            onChange={e => updateItem(index, { description: e.target.value, level: undefined })}
                          />
                          {item.isAnalyzing && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[10px] text-blue-600 font-bold bg-white pl-2">
                               <Loader2 className="w-3 h-3 animate-spin" />
                               MENGANALISA...
                            </div>
                          )}
                        </div>
                        
                        {/* AI Reason Hint */}
                        {item.reason && !item.isAnalyzing && (
                          <div className="flex items-start gap-2 p-2 bg-blue-50/50 rounded-lg border border-blue-100/50 animate-in fade-in duration-500">
                             <Sparkles className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />
                             <p className="text-[10px] text-blue-700 italic leading-relaxed">
                               AI: {item.reason}
                             </p>
                          </div>
                        )}
                        
                        {/* Level & Sub-Level Selection for Custom */}
                        <div className="flex gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
                          <div className="flex-1">
                            <select 
                              className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg outline-none text-[11px] font-bold text-gray-700"
                              value={item.level || ''}
                              onChange={e => handleComplexityChange(index, 'level', e.target.value)}
                            >
                              <option value="" disabled>-- Level --</option>
                              <option value="MUDAH">MUDAH</option>
                              <option value="SEDANG">SEDANG</option>
                              <option value="SULIT">SULIT</option>
                              <option value="SANGAT_SULIT">SANGAT SULIT</option>
                            </select>
                          </div>
                          <div className="flex-1">
                            <select 
                              className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg outline-none text-[11px] font-bold text-gray-700"
                              value={item.sub_level || ''}
                              onChange={e => handleComplexityChange(index, 'sub_level', e.target.value)}
                            >
                              <option value="" disabled>-- Sub Level --</option>
                              <option value="MINOR">MINOR</option>
                              <option value="MAJOR">MAJOR</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="w-full md:w-48">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Harga (IDR)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                      <input 
                        type="number"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg outline-none text-sm font-bold"
                        value={item.price}
                        onChange={e => updateItem(index, { price: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  {/* Remove */}
                  <div className="flex items-end pb-1">
                    <button 
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {item.type === 'CUSTOM' && !item.level && item.description.length > 5 && !item.isAnalyzing && (
                  <div className="flex items-center gap-2 text-[10px] text-orange-500 font-medium animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    Menunggu analisa AI (3 detik)...
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer Summary */}
        <div className="bg-gray-900 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-xl">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-widest">Total Estimasi</h3>
            <p className="text-3xl font-bold text-white mt-1">
              Rp {totalPrice.toLocaleString('id-ID')}
            </p>
          </div>
          <button 
            disabled={loading || items.some(i => i.price === 0)}
            type="submit"
            className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            )}
            Simpan Pesanan
          </button>
        </div>
      </form>

      {/* Invoice Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowPreview(false)}
          />
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 custom-scrollbar">
            <button 
              onClick={() => setShowPreview(false)}
              className="absolute right-4 top-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-all active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-4 sm:p-0">
              <InvoicePreview 
                client={client}
                items={items}
                total={totalPrice}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
