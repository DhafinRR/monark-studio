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
  ExternalLink as OpenIcon,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDialog from '@/components/monolith-core/ConfirmDialog'

interface OrderItem {
  id: string
  description: string
  price: number
  classification: 'STANDARD' | 'ADDON'
  level?: string
  sub_level?: string
  reason?: string
}

interface Order {
  id: string
  name: string
  whatsapp: string
  email?: string
  package_id: string | null
  pricing_package?: {
    id: string
    name: string
    floor_price: string
    max_slots: number
    benefits: string[]
    default_features: string[]
  } | null
  details?: string
  status: 'DRAFT' | 'ACTIVE' | 'DONE' | 'CANCELLED'
  total_price: number
  asset_link?: string
  preview_link?: string
  items: OrderItem[]
  created_at: string
}

interface Invoice {
  id: string
  invoice_number: string
  amount: number
  status: 'unpaid' | 'paid' | 'cancelled'
  issued_at: string
  paid_at?: string
  payment_method?: string
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [generatingInvoice, setGeneratingInvoice] = useState(false)
  const [formData, setFormData] = useState({
    status: '',
    asset_link: '',
    preview_link: '',
    details: ''
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
    fetchOrder()
    fetchInvoice()
  }, [id])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/monolith-core/orders/${id}`)
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

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/monolith-core/orders/${id}/invoice`)
      if (res.ok) {
        const data = await res.json()
        setInvoice(data)
      }
    } catch (error) {
      console.error("Failed to fetch invoice", error)
    }
  }

  const generateInvoice = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Terbitkan Invoice?',
      message: 'Pesanan ini akan dikunci dan nomor invoice resmi akan diterbitkan. Pastikan semua item dan harga sudah benar.',
      type: 'info',
      onConfirm: async () => {
        setGeneratingInvoice(true)
        try {
          const res = await fetch(`/api/monolith-core/orders/${id}/invoice`, { method: 'POST' })
          if (res.ok) {
            const data = await res.json()
            setInvoice(data)
            toast.success('Official Invoice berhasil diterbitkan!')
          } else {
            toast.error('Gagal menerbitkan invoice.')
          }
        } catch (error) {
          toast.error('Terjadi kesalahan sistem.')
        } finally {
          setGeneratingInvoice(false)
        }
      }
    })
  }

  const markAsPaid = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Konfirmasi Pembayaran',
      message: 'Apakah Anda yakin ingin menandai invoice ini sebagai LUNAS secara manual?',
      type: 'warning',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/monolith-core/orders/${id}/invoice`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'paid', payment_method: 'MANUAL_TRANSFER' })
          })
          if (res.ok) {
            const data = await res.json()
            setInvoice(data)
            toast.success('Invoice telah ditandai sebagai LUNAS!')
          } else {
            toast.error('Gagal memperbarui status pembayaran.')
          }
        } catch (error) {
          toast.error('Terjadi kesalahan sistem.')
        }
      }
    })
  }

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/monolith-core/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const updated = await res.json()
        setOrder(updated)
        toast.success('Data order berhasil diperbarui!')
      } else {
        toast.error('Gagal menyimpan perubahan.')
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
          <Link href="/monolith-core/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
            <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{order.pricing_package?.name || 'Custom Project'}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
            <p className="text-gray-500 text-sm italic">ID: {order.id.slice(0, 8)}...</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <Link 
             href={`/monolith-core/orders/${id}/edit`}
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

          {/* Package Inclusion Section */}
          {order.pricing_package && (
            <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#B8926A] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> {order.pricing_package.name} — Paket Termasuk
              </h2>

              {/* Benefits */}
              {order.pricing_package.benefits.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Benefits</h3>
                  <div className="space-y-2">
                    {order.pricing_package.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-3 px-4 py-2.5 bg-blue-50/50 rounded-lg border border-blue-100/50">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Default Features */}
              {order.pricing_package.default_features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fitur Default ({order.pricing_package.default_features.length}/{order.pricing_package.max_slots} slot)</h3>
                  <div className="space-y-2">
                    {order.pricing_package.default_features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Floor Price Subtotal */}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center px-4">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Harga Paket (Floor Price)</span>
                <span className="text-lg font-black text-gray-900">Rp {Number(order.pricing_package.floor_price).toLocaleString('id-ID')}</span>
              </div>
            </section>
          )}

          {/* Addon Features Section */}
          {(() => {
            const addonItems = order.items.filter(i => i.classification === 'ADDON')
            const addonTotal = addonItems.reduce((sum, i) => sum + Number(i.price), 0)
            const floorPrice = order.pricing_package ? Number(order.pricing_package.floor_price) : 0

            return (
              <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-[#B8926A] flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Fitur Tambahan (Addon)
                </h2>

                {addonItems.length === 0 ? (
                  <p className="text-sm text-gray-400 italic px-4">Tidak ada fitur tambahan.</p>
                ) : (
                  <div className="space-y-3">
                    {addonItems.map((item, idx) => (
                      <div key={item.id} className="p-4 bg-amber-50/50 rounded-xl border border-amber-100/50 flex items-start gap-4 group">
                        <span className="text-xs font-black text-amber-300 mt-1">{String(idx + 1).padStart(2, '0')}</span>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 group-hover:text-amber-700 transition-colors">{item.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.level && (
                              <span className="px-2 py-0.5 bg-white border border-amber-200 rounded-full text-[9px] font-black uppercase text-amber-600">
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
                        <div className="text-sm font-black text-amber-700">
                          Rp {Number(item.price).toLocaleString('id-ID')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pricing Summary */}
                <div className="pt-4 border-t border-gray-100 space-y-3 px-4">
                  {order.pricing_package && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400">Harga Paket</span>
                      <span className="text-sm font-bold text-gray-500">Rp {floorPrice.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  {addonItems.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400">Total Fitur Tambahan</span>
                      <span className="text-sm font-bold text-amber-600">+ Rp {addonTotal.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Grand Total</span>
                    <span className="text-xl font-black text-gray-900 tracking-tighter">Rp {Number(order.total_price).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </section>
            )
          })()}
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

           {/* Invoicing Action Card */}
           <section className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-6 shadow-2xl overflow-hidden relative group">
              {/* Decor Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-600/20 transition-all duration-700" />
              
              <div className="relative">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                   <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" /> Billing & Payment
                </h3>
                
                {!invoice ? (
                  <div className="space-y-4">
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Pesanan ini masih berstatus <strong>Draft</strong>. Klik tombol di bawah untuk menerbitkan Nomor Invoice resmi.
                    </p>
                    <button 
                      onClick={generateInvoice}
                      disabled={generatingInvoice || order.items.length === 0}
                      className="w-full py-4 bg-white text-gray-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl flex items-center justify-center disabled:bg-gray-700 disabled:text-gray-500"
                    >
                      {generatingInvoice ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      Generate Official Invoice
                    </button>
                    <p className="text-[9px] text-gray-600 italic text-center">Pastikan item & harga sudah fix sebelum generate.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                       <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                          <span className="text-gray-500">Invoice No.</span>
                          <span className="text-blue-400 font-black">{invoice.invoice_number}</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                          <span className="text-gray-500">Status</span>
                          <span className={`font-black ${invoice.status === 'paid' ? 'text-green-400' : 'text-amber-400'}`}>
                             {invoice.status}
                          </span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] uppercase tracking-widest pt-2 border-t border-white/5">
                          <span className="text-gray-500">Total Due</span>
                          <span className="text-white font-black text-sm">Rp {Number(invoice.amount).toLocaleString('id-ID')}</span>
                       </div>
                    </div>

                    {invoice.status !== 'paid' ? (
                      <div className="space-y-3">
                         <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                            <p className="text-[9px] text-amber-500 font-bold leading-tight">
                              Menunggu pembayaran. Bagikan link bayar ke klien melalui pratinjau invoice.
                            </p>
                         </div>
                         <button 
                           onClick={markAsPaid}
                           className="w-full py-3 bg-green-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all shadow-xl flex items-center justify-center gap-2"
                         >
                            <CheckCircle2 className="w-4 h-4" /> Mark as Paid (Manual)
                         </button>
                      </div>
                    ) : (
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                           <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Confirmed Paid</p>
                           <p className="text-[9px] text-green-700 font-bold opacity-70">Success via {invoice.payment_method || 'System'}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Payment Gateaway Placeholder */}
                    <div className="pt-4 border-t border-white/10 opacity-30 cursor-not-allowed">
                       <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-2">Gateaway Payment Link</p>
                       <div className="w-full py-2 bg-white/5 border border-white/5 rounded-lg text-[9px] text-center italic">
                          Midtrans Integration Pending...
                       </div>
                    </div>
                  </div>
                )}
              </div>
           </section>
        </div>
      </div>

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
