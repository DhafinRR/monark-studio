'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Sparkles, 
  Loader2, 
  Save, 
  ShoppingBag,
  User,
  Eye,
  X,
  CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Link from 'next/link'
import InvoicePreview from '@/components/monolith-core/InvoicePreview'
import { PRICING_PACKAGES } from '@/config/pricing'

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

interface ClientData {
  name: string
  whatsapp: string
  email: string
  package_type: string
  details: string
}

interface ClientOrderFormProps {
  isPublic?: boolean
  initialData?: Partial<ClientData>
  initialItems?: OrderItem[]
}

export default function ClientOrderForm({ isPublic = false, initialData, initialItems }: ClientOrderFormProps) {
  const router = useRouter()
  const [catalog, setCatalog] = useState<Feature[]>([])
  const [complexityPrices, setComplexityPrices] = useState<any[]>([])
  const [client, setClient] = useState<ClientData>({
    name: initialData?.name || '',
    whatsapp: initialData?.whatsapp || '',
    email: initialData?.email || '',
    package_type: initialData?.package_type || (isPublic ? '' : 'Custom Project'),
    details: initialData?.details || ''
  })
  const [items, setItems] = useState<OrderItem[]>(
    initialItems && initialItems.length > 0 
      ? initialItems 
      : [{ id: crypto.randomUUID(), type: 'CATALOG', description: '', price: 0 }]
  )
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // API base path differs if it's public vs admin
  const apiPath = isPublic ? '/api/public' : '/api/monolith-core';

  // Fetch References
  useEffect(() => {
    fetch(`${apiPath}/features`).then(res => res.json()).then(data => setCatalog(Array.isArray(data) ? data : []))
    fetch(`${apiPath}/complexity-price`).then(res => res.json()).then(data => setComplexityPrices(Array.isArray(data) ? data : []))
  }, [apiPath])

  // Debounce for AI Analysis
  useEffect(() => {
    if (isPublic) return;

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
  }, [items, isPublic])

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
    const staticPkg = PRICING_PACKAGES.find(p => p.id === featureId)
    if (staticPkg) {
      const numericPrice = staticPkg.price.includes('Juta') ? parseFloat(staticPkg.price) * 1000000 : 0
      updateItem(index, {
        feature_id: staticPkg.id,
        description: `Paket: ${staticPkg.name}`,
        price: numericPrice
      })
      return
    }

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
    setErrorMsg('')
    try {
      const res = await fetch(`${apiPath}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...client, items })
      })
      if (res.ok) {
        if (isPublic) {
          setSubmitted(true)
          if (typeof window !== 'undefined') {
             window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        } else {
          toast.success('Pesanan baru berhasil dibuat!')
          router.push('/monolith-core/orders')
        }
      } else {
        const errorData = await res.json().catch(() => ({}))
        setErrorMsg(errorData.error || 'Gagal membuat pesanan. Silakan coba lagi.')
        toast.error('Gagal membuat pesanan.')
      }
    } catch (err) {
      setErrorMsg('Gagal membuat pesanan. Periksa koneksi internet Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`mx-auto space-y-8 animate-in fade-in duration-500 ${isPublic ? 'w-full' : 'max-w-5xl pb-20 p-4 sm:p-6 lg:p-8'}`}>
      {!isPublic && (
        <div className="flex items-center gap-4">
          <Link href="/monolith-core/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
            <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Buat Pesanan Baru</h1>
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
      )}

      {isPublic && submitted && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary mb-8"
        >
          <CheckCircle size={20} />
          <span className="text-sm font-medium">
            Penawaran berhasil dikirim! Tim kami akan segera menghubungi Anda melalui WhatsApp.
          </span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Client Info Section */}
        <section className={`p-6 rounded-2xl border shadow-sm space-y-6 ${isPublic ? 'bg-card/60 backdrop-blur-xl border-border/60 shadow-primary/5' : 'bg-white border-gray-200'}`}>
          <div className={`flex items-center gap-2 border-b pb-4 ${isPublic ? 'border-primary/10' : 'border-gray-50'}`}>
            <User className={`w-5 h-5 ${isPublic ? 'text-primary' : 'text-blue-600'}`} />
            <h2 className={`font-bold uppercase tracking-widest text-sm ${isPublic ? 'text-foreground' : 'text-gray-900'}`}>Informasi Klien</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${isPublic ? 'text-muted-foreground' : 'text-gray-500'}`}>Nama Lengkap *</label>
              <input 
                required
                className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 font-medium ${isPublic ? 'bg-background/60 border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-primary/30 focus:border-primary/40' : 'bg-gray-50 border border-gray-100 focus:ring-blue-500'}`}
                placeholder="Contoh: Budi Santoso"
                value={client.name}
                onChange={e => setClient({...client, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${isPublic ? 'text-muted-foreground' : 'text-gray-500'}`}>Nomor WhatsApp *</label>
              <input 
                required
                className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 font-medium ${isPublic ? 'bg-background/60 border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-primary/30 focus:border-primary/40' : 'bg-gray-50 border border-gray-100 focus:ring-blue-500'}`}
                placeholder="628123456789"
                value={client.whatsapp}
                onChange={e => setClient({...client, whatsapp: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${isPublic ? 'text-muted-foreground' : 'text-gray-500'}`}>Email (Opsional)</label>
              <input 
                type="email"
                className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 font-medium ${isPublic ? 'bg-background/60 border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-primary/30 focus:border-primary/40' : 'bg-gray-50 border border-gray-100 focus:ring-blue-500'}`}
                placeholder="budi@example.com"
                value={client.email}
                onChange={e => setClient({...client, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${isPublic ? 'text-muted-foreground' : 'text-gray-500'}`}>Judul Proyek</label>
              <input 
                className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 font-medium ${isPublic ? 'bg-background/60 border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-primary/30 focus:border-primary/40' : 'bg-gray-50 border border-gray-100 focus:ring-blue-500'}`}
                placeholder="Contoh: Landing Page Startup X"
                value={client.package_type}
                onChange={e => setClient({...client, package_type: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <label className={`text-xs font-bold uppercase tracking-wider ${isPublic ? 'text-muted-foreground' : 'text-gray-500'}`}>Deskripsi / Catatan Proyek (Opsional)</label>
            <textarea 
              rows={3}
              className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 text-sm italic ${isPublic ? 'bg-background/60 border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-primary/30 focus:border-primary/40' : 'bg-gray-50 border border-gray-100 focus:ring-blue-500'}`}
              placeholder="Contoh: Klien ingin nuansa warna biru monark, deadline akhir bulan..."
              value={client.details || ''}
              onChange={e => setClient({...client, details: e.target.value})}
            />
          </div>
        </section>

        {/* Order Items Section */}
        <section className={`p-6 rounded-2xl border shadow-sm space-y-6 ${isPublic ? 'bg-card/60 backdrop-blur-xl border-border/60 shadow-primary/5' : 'bg-white border-gray-200'}`}>
          <div className={`flex items-center justify-between border-b pb-4 ${isPublic ? 'border-primary/10' : 'border-gray-50'}`}>
            <div className="flex items-center gap-2">
              <ShoppingBag className={`w-5 h-5 ${isPublic ? 'text-primary' : 'text-blue-600'}`} />
              <h2 className={`font-bold uppercase tracking-widest text-sm ${isPublic ? 'text-foreground' : 'text-gray-900'}`}>Rincian Pekerjaan</h2>
            </div>
            {!isPublic && (
              <button 
                type="button"
                onClick={addItem}
                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center transition-all"
              >
                <Plus className="w-4 h-4 mr-2" /> Tambah Item
              </button>
            )}
          </div>

          {/* Static Pricing Packages List */}
          <div className={`p-5 rounded-2xl border ${isPublic ? 'bg-primary/5 border-primary/20' : 'bg-blue-50/50 border-blue-100'}`}>
            <h3 className={`text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${isPublic ? 'text-primary' : 'text-blue-700'}`}>
              <Sparkles className="w-4 h-4" /> Referensi Harga Paket / Layanan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRICING_PACKAGES.map(pkg => (
                <div key={pkg.id} className={`flex flex-col justify-center p-3 rounded-xl border transition-all hover:-translate-y-0.5 ${isPublic ? 'bg-background/80 border-primary/10 hover:border-primary/40 hover:shadow-[0_0_15px_rgba(var(--primary),0.2)]' : 'bg-white border-blue-100 hover:border-blue-300 hover:shadow-md'}`}>
                  <span className={`text-xs font-bold mb-1 ${isPublic ? 'text-foreground' : 'text-gray-900'}`}>{pkg.name}</span>
                  <span className={`text-[11px] font-black tracking-widest ${isPublic ? 'text-primary/80' : 'text-blue-600'}`}>Mulai dari Rp {pkg.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Catalog Price List */}
          {catalog.length > 0 && (
            <div className={`p-5 rounded-2xl border ${isPublic ? 'bg-primary/5 border-primary/20' : 'bg-blue-50/50 border-blue-100'}`}>
              <h3 className={`text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${isPublic ? 'text-primary' : 'text-blue-700'}`}>
                <Sparkles className="w-4 h-4" /> Daftar Harga Fitur Tambahan (Katalog)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {catalog.map(f => (
                  <div key={f.id} className={`flex flex-col justify-center p-3 rounded-xl border transition-all hover:-translate-y-0.5 ${isPublic ? 'bg-background/80 border-primary/10 hover:border-primary/40 hover:shadow-[0_0_15px_rgba(var(--primary),0.2)]' : 'bg-white border-blue-100 hover:border-blue-300 hover:shadow-md'}`}>
                    <span className={`text-xs font-bold mb-1 ${isPublic ? 'text-foreground' : 'text-gray-900'}`}>{f.name}</span>
                    <span className={`text-[11px] font-black tracking-widest ${isPublic ? 'text-primary/80' : 'text-blue-600'}`}>Rp {Number(f.price).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className={`p-4 rounded-xl border space-y-4 ${isPublic ? 'bg-background/50 border-primary/20' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-48">
                    <label className={`text-[10px] font-black uppercase mb-1 block ${isPublic ? 'text-muted-foreground' : 'text-gray-400'}`}>Tipe</label>
                    <select 
                      className={`w-full px-3 py-2 rounded-lg outline-none text-sm font-bold ${isPublic ? 'bg-background border border-border text-foreground' : 'bg-white border border-gray-200 text-gray-900'}`}
                      value={item.type}
                      onChange={e => updateItem(index, { type: e.target.value as any, description: '', price: 0, level: undefined })}
                    >
                      <option value="CATALOG">Katalog</option>
                      <option value="CUSTOM">Custom (AI)</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className={`text-[10px] font-black uppercase mb-1 block ${isPublic ? 'text-muted-foreground' : 'text-gray-400'}`}>
                      {item.type === 'CATALOG' ? 'Pilih Fitur' : 'Deskripsi Fitur'}
                    </label>
                    {item.type === 'CATALOG' ? (
                      <select 
                        className={`w-full px-3 py-2 rounded-lg outline-none text-sm font-medium ${isPublic ? 'bg-background border border-border text-foreground' : 'bg-white border border-gray-200 text-gray-900'}`}
                        value={item.feature_id || ''}
                        onChange={e => handleCatalogSelect(index, e.target.value)}
                      >
                        <option value="">-- Pilih dari Katalog --</option>
                        <optgroup label="Paket Utama">
                          {PRICING_PACKAGES.map(pkg => {
                            const numericPrice = pkg.price.includes('Juta') ? parseFloat(pkg.price) * 1000000 : 0
                            return (
                              <option key={pkg.id} value={pkg.id}>{pkg.name} (Rp {numericPrice.toLocaleString('id-ID')})</option>
                            )
                          })}
                        </optgroup>
                        {catalog.length > 0 && (
                          <optgroup label="Fitur Tambahan (DB)">
                            {catalog.map(f => (
                              <option key={f.id} value={f.id}>{f.name} (Rp {Number(f.price).toLocaleString('id-ID')})</option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative">
                          <input 
                            className={`w-full px-3 py-2 rounded-lg outline-none text-sm placeholder:italic ${isPublic ? 'bg-background border border-border text-foreground' : 'bg-white border border-gray-200 text-gray-900'}`}
                            placeholder="Jelaskan kebutuhan fitur klien..."
                            value={item.description}
                            onChange={e => updateItem(index, { description: e.target.value, level: undefined })}
                          />
                          {item.isAnalyzing && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[10px] text-blue-600 font-black bg-white pl-2">
                               <Loader2 className="w-3 h-3 animate-spin" />
                               ANALYZING...
                            </div>
                          )}
                        </div>
                        
                        {item.reason && !item.isAnalyzing && (
                          <div className={`flex items-start gap-2 p-2 rounded-lg border ${isPublic ? 'bg-primary/10 border-primary/20' : 'bg-blue-50/50 border-blue-100/50'}`}>
                             <Sparkles className={`w-3 h-3 mt-0.5 shrink-0 ${isPublic ? 'text-primary' : 'text-blue-500'}`} />
                             <p className={`text-[10px] italic ${isPublic ? 'text-foreground' : 'text-blue-700'}`}>AI: {item.reason}</p>
                          </div>
                        )}
                        
                        <div className="flex gap-3">
                          <div className="flex-1">
                            {/* Disabled on public side so they just see the level the AI assigned */}
                            <select 
                              className={`w-full px-2 py-1.5 rounded-lg outline-none text-[10px] font-black ${isPublic ? 'bg-background/50 border-transparent text-muted-foreground cursor-not-allowed' : 'bg-white border-gray-200 text-gray-700 cursor-pointer'}`}
                              value={item.level || ''}
                              onChange={e => handleComplexityChange(index, 'level', e.target.value)}
                              disabled={isPublic}
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
                              className={`w-full px-2 py-1.5 rounded-lg outline-none text-[10px] font-black ${isPublic ? 'bg-background/50 border-transparent text-muted-foreground cursor-not-allowed' : 'bg-white border-gray-200 text-gray-700 cursor-pointer'}`}
                              value={item.sub_level || ''}
                              onChange={e => handleComplexityChange(index, 'sub_level', e.target.value)}
                              disabled={isPublic}
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

                  <div className="w-full md:w-48">
                    <label className={`text-[10px] font-black uppercase mb-1 block ${isPublic ? 'text-muted-foreground' : 'text-gray-400'}`}>Harga (IDR)</label>
                    <div className="relative">
                      <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold ${isPublic ? 'text-muted-foreground' : 'text-gray-400'}`}>Rp</span>
                      <input 
                        type="number"
                        readOnly={isPublic}
                        className={`w-full pl-9 pr-3 py-2 rounded-lg outline-none text-sm font-black ${isPublic ? 'bg-primary/5 border border-primary/20 text-foreground cursor-not-allowed opacity-90' : 'bg-white border border-gray-200 text-gray-900 cursor-text'}`}
                        value={item.price}
                        onChange={e => updateItem(index, { price: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  {!isPublic && (
                    <div className="flex items-end pb-1">
                      <button 
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Summary */}
        <div className={`rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-xl ${isPublic ? 'bg-primary/10 border border-primary/20' : 'bg-gray-900'}`}>
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isPublic ? 'text-primary' : 'text-gray-500'}`}>Total Estimasi</h3>
            <p className={`text-3xl font-black mt-1 italic tracking-tighter ${isPublic ? 'text-foreground' : 'text-white'}`}>
              Rp {totalPrice.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end w-full md:w-auto gap-3">
            {errorMsg && (
              <p className="text-red-500 text-sm font-bold text-center md:text-right w-full">{errorMsg}</p>
            )}
            <button 
              disabled={loading || items.some(i => i.price === 0) || submitted}
              type="submit"
              className={`w-full md:w-auto px-10 py-4 font-black uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center shadow-lg group ${isPublic ? 'bg-gradient-secondary text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed'}`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : submitted ? (
                <CheckCircle className="w-5 h-5 mr-3" />
              ) : (
                <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              )}
              {submitted ? 'Berhasil Terkirim!' : isPublic ? 'Kirim Penawaran' : 'Simpan Pesanan'}
            </button>
          </div>
        </div>
      </form>

      {/* Invoice Preview Modal */}
      {(!isPublic && showPreview) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => setShowPreview(false)}
          />
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 custom-scrollbar">
            <button 
              onClick={() => setShowPreview(false)}
              className="absolute right-4 top-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-all active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-0">
              <InvoicePreview 
                client={client}
                items={items}
                total={totalPrice}
                status="DRAFT"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
