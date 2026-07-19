import Link from 'next/link'
import { Plus, MessageCircle, Mail, FileText, ChevronRight } from 'lucide-react'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

async function getOrders() {
  const orders = await prisma.order.findMany({
    include: {
      pricing_package: { select: { id: true, name: true } },
      _count: { select: { items: true } }
    },
    orderBy: { created_at: 'desc' }
  })
  return orders
}

const statusStyles: Record<string, string> = {
  DRAFT: 'bg-gray-50 text-gray-500 border-gray-100',
  PENDING: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  ACTIVE: 'bg-blue-50 text-blue-600 border-blue-100',
  ON_PROGRESS: 'bg-purple-50 text-purple-600 border-purple-100',
  DONE: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  CANCELLED: 'bg-red-50 text-red-600 border-red-100',
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Orders</h1>
          <p className="text-gray-500 text-sm">Review and manage all project intake</p>
        </div>
        <Link 
          href="/monolith-core/orders/new"
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
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Klien</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Paket</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Kontak</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">Belum ada pesanan masuk.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <Link href={`/monolith-core/orders/${order.id}`} className="block">
                        <div className="font-bold text-gray-900">{order.name}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <FileText className="w-3 h-3 mr-1" />
                          {order._count.items} Item Pekerjaan
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-50 border text-gray-600">
                        {order.pricing_package?.name || 'Custom Project'}
                      </span>
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
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyles[order.status] || statusStyles.DRAFT}`}>
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
                        href={`/monolith-core/orders/${order.id}`}
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
