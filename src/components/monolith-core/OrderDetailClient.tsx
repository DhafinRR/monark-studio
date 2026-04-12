'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  Loader2, 
  Link as LinkIcon,
  ExternalLink as OpenIcon,
  History,
  RotateCcw,
  FolderPlus,
  Plus,
  CheckCircle2,
  Eye,
  Trash2
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
  custom_note?: string
}

interface Payment {
  id: string
  amount: number
  payment_method?: string
  notes?: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  paid_at?: string
  created_at: string
}

interface OrderHistoryEntry {
  timestamp: string
  action: string
  description: string
  previous_state?: Record<string, unknown>
  new_state?: Record<string, unknown>
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
  status: 'DRAFT' | 'ACTIVE' | 'ON_PROGRESS' | 'DONE' | 'CANCELLED'
  total_price: number
  asset_link?: string
  preview_link?: string
  items: OrderItem[]
  payments: Payment[]
  history: OrderHistoryEntry[]
  created_at: string
}

interface OrderDetailClientProps {
  order: Order
}

export default function OrderDetailClient({ order: initialOrder }: OrderDetailClientProps) {
  const router = useRouter()
  const [order, setOrder] = useState<Order>(initialOrder)
  const [updating, setUpdating] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [creatingPortfolio, setCreatingPortfolio] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    payment_method: '',
    notes: '',
    status: 'PENDING' as const
  })
  const [formData, setFormData] = useState({
    status: initialOrder.status,
    asset_link: initialOrder.asset_link || '',
    preview_link: initialOrder.preview_link || '',
    details: initialOrder.details || ''
  })
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'info' as 'info' | 'warning' | 'danger'
  })

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    ACTIVE: 'bg-blue-100 text-blue-700',
    ON_PROGRESS: 'bg-purple-100 text-purple-700',
    DONE: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700'
  }

  const paymentStatusColors: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    CONFIRMED: 'bg-green-50 text-green-600 border-green-100',
    CANCELLED: 'bg-red-50 text-red-600 border-red-100'
  }

  const totalPaid = (order.payments || [])
    .filter(p => p.status === 'CONFIRMED')
    .reduce((sum, p) => sum + Number(p.amount), 0)
  const remaining = Number(order.total_price || 0) - totalPaid

  const addonItems = order.items.filter(i => i.classification === 'ADDON')
  const addonTotal = addonItems.reduce((sum, i) => sum + Number(i.price), 0)
  const floorPrice = order.pricing_package ? Number(order.pricing_package.floor_price) : 0

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/monolith-core/orders/${order.id}`, {
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

  const handleRestore = async (historyEntry: OrderHistoryEntry) => {
    if (!historyEntry.previous_state) {
      toast.error('Cannot restore: no previous state available')
      return
    }

    setConfirmModal({
      isOpen: true,
      title: 'Restore ke Versi Sebelumnya?',
      message: `Akan mengembalikan order ke state: "${historyEntry.description}". Perubahan saat ini akan tersimpan di history. Lanjutkan?`,
      type: 'warning',
      onConfirm: async () => {
        setRestoring(true)
        try {
          const res = await fetch(`/api/monolith-core/orders/${order.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: historyEntry.previous_state?.name,
              whatsapp: historyEntry.previous_state?.whatsapp,
              email: historyEntry.previous_state?.email,
              details: historyEntry.previous_state?.details,
              status: historyEntry.previous_state?.status,
            })
          })
          if (res.ok) {
            const updated = await res.json()
            setOrder(updated)
            toast.success('Order berhasil di-restore!')
          } else {
            toast.error('Gagal restore order.')
          }
        } finally {
          setRestoring(false)
        }
      }
    })
  }

  const handleCreatePortfolio = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Buat Portfolio?',
      message: 'Order ini akan dikonversi menjadi project portfolio. Lanjutkan?',
      type: 'info',
      onConfirm: async () => {
        setCreatingPortfolio(true)
        try {
          const res = await fetch(`/api/monolith-core/orders/${order.id}/portfolio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
          })
          if (res.ok) {
            const portfolio = await res.json()
            toast.success('Portfolio berhasil dibuat!')
            router.push(`/monolith-core/portfolio/${portfolio.id}/edit`)
          } else {
            const data = await res.json()
            toast.error(data.error || 'Gagal membuat portfolio.')
          }
        } catch (error) {
          toast.error('Terjadi kesalahan.')
        } finally {
          setCreatingPortfolio(false)
        }
      }
    })
  }

  const handleAddPayment = async () => {
    try {
      const res = await fetch(`/api/monolith-core/orders/${order.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(paymentForm.amount),
          payment_method: paymentForm.payment_method,
          notes: paymentForm.notes,
          status: paymentForm.status
        })
      })
      if (res.ok) {
        toast.success('Payment berhasil ditambahkan!')
        setShowPaymentForm(false)
        setPaymentForm({ amount: '', payment_method: '', notes: '', status: 'PENDING' })
        const refreshRes = await fetch(`/api/monolith-core/orders/${order.id}`)
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json()
          setOrder(refreshData)
        }
      } else {
        toast.error('Gagal menambahkan payment.')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan.')
    }
  }

  const handleUpdatePayment = async (paymentId: string, status: string) => {
    try {
      const res = await fetch(`/api/monolith-core/orders/${order.id}/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        toast.success('Payment status berhasil diupdate!')
        const refreshRes = await fetch(`/api/monolith-core/orders/${order.id}`)
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json()
          setOrder(refreshData)
        }
      } else {
        toast.error('Gagal update payment.')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan.')
    }
  }

  const handleDeletePayment = async (paymentId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Payment?',
      message: 'Payment ini akan dihapus permanen. Lanjutkan?',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/monolith-core/orders/${order.id}/payments/${paymentId}`, {
            method: 'DELETE'
          })
          if (res.ok) {
            toast.success('Payment berhasil dihapus!')
            const refreshRes = await fetch(`/api/monolith-core/orders/${order.id}`)
            if (refreshRes.ok) {
              const refreshData = await refreshRes.json()
              setOrder(refreshData)
            }
          } else {
            toast.error('Gagal hapus payment.')
          }
        } catch (error) {
          toast.error('Terjadi kesalahan.')
        }
      }
    })
  }

  return (
    <>
      {/* Action buttons row */}
      <div className="flex flex-wrap items-center gap-3">
        <a 
          href={`/monolith-core/orders/${order.id}/print/invoice`}
          target="_blank"
          className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center shadow-sm text-sm"
        >
          <Eye className="w-4 h-4 mr-2 text-red-500" />
          Print Invoice
        </a>

        {order.status === 'DONE' && (
          <button 
            onClick={handleCreatePortfolio}
            disabled={creatingPortfolio}
            className="px-4 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all flex items-center shadow-sm text-sm disabled:bg-gray-400"
          >
            {creatingPortfolio ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FolderPlus className="w-4 h-4 mr-2" />}
            Create Portfolio
          </button>
        )}

        <button 
          onClick={handleUpdate}
          disabled={updating}
          className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center shadow-lg shadow-blue-900/10 disabled:bg-gray-400"
        >
          {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Simpan
        </button>
      </div>

      {/* Status Section */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-[#B8926A] flex items-center gap-2">
          Status
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status Proyek</label>
            <select 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value as any})}
            >
              <option value="DRAFT">DRAFT</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ON_PROGRESS">ON PROGRESS</option>
              <option value="DONE">DONE</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400">Asset Link</label>
            <div className="flex gap-2">
              <input
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none text-sm font-medium"
                placeholder="https://drive.google.com/..."
                value={formData.asset_link}
                onChange={e => setFormData({...formData, asset_link: e.target.value})}
              />
              {formData.asset_link && (
                <a href={formData.asset_link} target="_blank" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                  <OpenIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400">Preview Link</label>
            <div className="flex gap-2">
              <input
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none text-sm font-medium"
                placeholder="https://preview.domain.com/..."
                value={formData.preview_link}
                onChange={e => setFormData({...formData, preview_link: e.target.value})}
              />
              {formData.preview_link && (
                <a href={formData.preview_link} target="_blank" className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                  <OpenIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Package Section */}
      {order.pricing_package && (
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-[#B8926A]">
            {order.pricing_package.name}
          </h2>

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

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center px-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Harga Paket</span>
            <span className="text-lg font-black text-gray-900">Rp {floorPrice.toLocaleString('id-ID')}</span>
          </div>
        </section>
      )}

      {/* Addon Section */}
      {addonItems.length > 0 && (
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-[#B8926A]">
            Fitur Tambahan
          </h2>

          <div className="space-y-3">
            {addonItems.map((item, idx) => (
              <div key={item.id} className="p-4 bg-amber-50/50 rounded-xl border border-amber-100/50 flex items-start gap-4">
                <span className="text-xs font-black text-amber-300 mt-1">{String(idx + 1).padStart(2, '0')}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.level && (
                      <span className="px-2 py-0.5 bg-white border border-amber-200 rounded-full text-[9px] font-black uppercase text-amber-600">
                        {item.level} — {item.sub_level}
                      </span>
                    )}
                    {item.reason && (
                      <p className="text-[10px] italic text-gray-400">
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

          <div className="pt-4 border-t border-gray-100 space-y-3 px-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400">Total Fitur Tambahan</span>
              <span className="text-sm font-bold text-amber-600">+ Rp {addonTotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Grand Total</span>
              <span className="text-xl font-black text-gray-900 tracking-tighter">Rp {Number(order.total_price).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </section>
      )}

      {/* History Section */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between text-sm font-black uppercase tracking-widest text-[#B8926A]"
        >
          <span className="flex items-center gap-2">
            <History className="w-4 h-4" /> Order History ({(order.history as OrderHistoryEntry[])?.length || 0})
          </span>
        </button>

        {showHistory && (
          <div className="space-y-3">
            {(!order.history || order.history.length === 0) ? (
              <p className="text-sm text-gray-400 italic px-4">Belum ada history.</p>
            ) : (
              (order.history as OrderHistoryEntry[]).slice().reverse().map((entry, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-gray-100 text-gray-600">
                          {entry.action.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(entry.timestamp).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{entry.description}</p>
                    </div>
                    {entry.previous_state && (
                      <button
                        onClick={() => handleRestore(entry)}
                        disabled={restoring}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Restore"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Payments Section */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-[#B8926A]">
          Payments
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Total Order</span>
            <span className="text-sm font-bold text-gray-900">Rp {Number(order.total_price || 0).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Total Paid</span>
            <span className="text-sm font-bold text-green-600">Rp {totalPaid.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Remaining</span>
            <span className={`text-sm font-bold ${remaining > 0 ? 'text-amber-600' : 'text-green-600'}`}>
              Rp {remaining.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {(order.payments || []).map((payment) => (
            <div key={payment.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${paymentStatusColors[payment.status]}`}>
                      {payment.status}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(payment.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    Rp {Number(payment.amount).toLocaleString('id-ID')}
                  </p>
                  {payment.payment_method && (
                    <p className="text-[10px] text-gray-500">{payment.payment_method}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <a 
                    href={`/monolith-core/orders/${order.id}/payments/${payment.id}/print/kwitansi`}
                    target="_blank"
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Print Kwitansi"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                  {payment.status === 'PENDING' && (
                    <button
                      onClick={() => handleUpdatePayment(payment.id, 'CONFIRMED')}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Confirm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePayment(payment.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!showPaymentForm ? (
          <button
            onClick={() => setShowPaymentForm(true)}
            className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Add Payment
          </button>
        ) : (
          <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase">New Payment</h4>
            <input
              type="number"
              placeholder="Amount (Rp)"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
              value={paymentForm.amount}
              onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})}
            />
            <input
              type="text"
              placeholder="Payment Method"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
              value={paymentForm.payment_method}
              onChange={e => setPaymentForm({...paymentForm, payment_method: e.target.value})}
            />
            <textarea
              placeholder="Notes (optional)"
              rows={2}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
              value={paymentForm.notes}
              onChange={e => setPaymentForm({...paymentForm, notes: e.target.value})}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowPaymentForm(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPayment}
                className="flex-1 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all text-sm"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </section>

      <ConfirmDialog 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
    </>
  )
}
