'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  ExternalLink, 
  Save, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Link as LinkIcon,
  MessageCircle,
  User,
  ShoppingBag,
  ExternalLink as OpenIcon
} from 'lucide-react'

interface OrderItem {
  id: string
  description: string
  price: number
  level?: string
  sub_level?: string
  reason?: string
}

interface Order {
  id: string
  name: string
  whatsapp: string
  email?: string
  package_type: string
  details?: string
  status: 'DRAFT' | 'ACTIVE' | 'DONE' | 'CANCELLED'
  total_price: number
  asset_link?: string
  preview_link?: string
  items: OrderItem[]
  created_at: string
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    status: '',
    asset_link: '',
    preview_link: '',
    details: ''
  })

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`)
      const data = await res.json()
      setOrder(data)
      setFormData({
        status: data.status,
        asset_link: data.asset_link || '',
        preview_link: data.preview_link || '',
        details: data.details || ''
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const updated = await res.json()
        setOrder(updated)
        alert('Data berhasil diperbarui!')
      }
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  )

  if (!order) return <div>Order tidak ditemukan.</div>

  const statusColors = {
    DRAFT: 'bg-gray-100 text-gray-700',
    ACTIVE: 'bg-blue-100 text-blue-700',
    DONE: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
            <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{order.package_type}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
            <p className="text-gray-500 text-sm italic">ID: {order.id.slice(0, 8)}...</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <Link 
             href={`/admin/orders/${id}/edit`}
             className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center shadow-sm text-sm"
           >
             <ShoppingBag className="w-4 h-4 mr-2 text-blue-600" />
             Edit Item & Harga
           </Link>
           <button 
             onClick={handleUpdate}
             disabled={updating}
             className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center shadow-lg shadow-blue-900/10 disabled:bg-gray-400 group"
           >
             {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />}
             Simpan Status
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Order Information */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Status & Project Management Card */}
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#B8926A] flex items-center gap-2">
               <Clock className="w-4 h-4" /> Project Lifecycle
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status Proyek</label>
                 <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                 >
                   <option value="DRAFT">DRAFT (Persiapan)</option>
                   <option value="ACTIVE">ACTIVE (Sedang Dikerjakan)</option>
                   <option value="DONE">DONE (Selesai)</option>
                   <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
                 </select>
               </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                 <LinkIcon className="w-3.5 h-3.5" /> Project Resources
              </h3>
              <div className="grid grid-cols-1 gap-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-gray-400">Asset Link (Google Drive / Figma)</label>
                   <div className="flex gap-2">
                      <input 
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none text-sm font-medium"
                        placeholder="https://drive.google.com/..."
                        value={formData.asset_link}
                        onChange={e => setFormData({...formData, asset_link: e.target.value})}
                      />
                      {order.asset_link && (
                        <a href={order.asset_link} target="_blank" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                          <OpenIcon className="w-5 h-5" />
                        </a>
                      )}
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-gray-400">Preview Link (Demo / Staging)</label>
                   <div className="flex gap-2">
                      <input 
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none text-sm font-medium"
                        placeholder="https://preview.domain.com/..."
                        value={formData.preview_link}
                        onChange={e => setFormData({...formData, preview_link: e.target.value})}
                      />
                      {order.preview_link && (
                        <a href={order.preview_link} target="_blank" className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                          <OpenIcon className="w-5 h-5" />
                        </a>
                      )}
                   </div>
                 </div>
              </div>
            </div>
          </section>

          {/* Items Section */}
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#B8926A] flex items-center gap-2">
               <ShoppingBag className="w-4 h-4" /> Scope of Work
            </h2>
            <div className="space-y-4">
               {order.items.map((item, idx) => (
                 <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4 group">
                    <span className="text-xs font-black text-gray-300 mt-1">{String(idx + 1).padStart(2, '0')}</span>
                    <div className="flex-1">
                       <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.description}</p>
                       <div className="flex flex-wrap gap-2 mt-2">
                          {item.level && (
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-full text-[9px] font-black uppercase text-gray-500">
                               {item.level} — {item.sub_level}
                            </span>
                          )}
                          {item.reason && (
                             <p className="text-[10px] italic text-gray-400 flex items-center gap-1">
                               AI: {item.reason}
                             </p>
                          )}
                       </div>
                    </div>
                    <div className="text-sm font-black text-gray-900">
                       Rp {Number(item.price).toLocaleString('id-ID')}
                    </div>
                 </div>
               ))}
               <div className="pt-6 border-t border-gray-100 flex justify-between items-center px-4">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Grand Total</span>
                  <span className="text-xl font-black text-gray-900 tracking-tighter">Rp {Number(order.total_price).toLocaleString('id-ID')}</span>
               </div>
            </div>
          </section>
        </div>

        {/* Right Side: Client Information & Internal Notes */}
        <div className="space-y-8">
           {/* Client Card */}
           <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#B8926A] flex items-center gap-2">
                 <User className="w-4 h-4" /> Client Identification
              </h2>
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Company / Name</label>
                    <p className="font-bold text-lg text-gray-900">{order.name}</p>
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">WhatsApp</label>
                    <div className="flex items-center gap-2">
                       <p className="font-medium text-gray-700">{order.whatsapp}</p>
                       <a href={`https://wa.me/${order.whatsapp}`} target="_blank" className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors">
                          <MessageCircle className="w-4 h-4" />
                       </a>
                    </div>
                 </div>
                 {order.email && (
                    <div>
                       <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Email</label>
                       <p className="font-medium text-gray-700">{order.email}</p>
                    </div>
                 )}
              </div>
           </section>

           {/* Notes Card */}
           <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#B8926A] flex items-center gap-2">
                 <AlertCircle className="w-4 h-4" /> Internal Description
              </h2>
              <textarea 
                rows={6}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm italic text-gray-600"
                placeholder="No internal notes provided..."
                value={formData.details}
                onChange={e => setFormData({...formData, details: e.target.value})}
              />
           </section>

           {/* Invoicing Action (Placeholder) */}
           <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Financial Actions</h3>
              <p className="text-gray-400 text-xs">Anda dapat membuat tagihan resmi untuk pesanan ini.</p>
              <button 
                className="w-full py-3 bg-white text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-500 hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl"
              >
                Generate Final Invoice
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}
