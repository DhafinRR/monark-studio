'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Calendar, User, MessageCircle, Mail, FileText, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  name: string
  whatsapp: string
  email: string | null
  status: string
  total_price: string | null
  created_at: string
  _count?: {
    items: number
  }
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Orders</h1>
          <p className="text-gray-500 text-sm">Review and manage all project intake</p>
        </div>
        <Link 
          href="/admin/orders/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Pesanan
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Klien & Proyek</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Kontak</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Memuat pesanan...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Belum ada pesanan masuk.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{order.name}</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <FileText className="w-3 h-3 mr-1" />
                        {order._count?.items || 0} Item Pekerjaan
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-xs text-emerald-600 font-medium">
                          <MessageCircle className="w-3.5 h-3.5 mr-1" />
                          {order.whatsapp}
                        </div>
                        {order.email && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Mail className="w-3.5 h-3.5 mr-1" />
                            {order.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'ACTIVE' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        order.status === 'DONE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        'bg-gray-50 text-gray-500 border border-gray-100'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {order.total_price ? `Rp ${Number(order.total_price).toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-gray-400 group-hover:text-blue-600 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 flex-shrink-0" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
