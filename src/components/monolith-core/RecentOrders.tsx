import Link from 'next/link'
import { ExternalLink, MessageCircle } from 'lucide-react'
import prisma from '@/lib/prisma'

const statusStyles: Record<string, string> = {
    'PENDING': 'bg-orange-100 text-orange-700',
    'ACTIVE': 'bg-purple-100 text-purple-700',
    'ON_PROGRESS': 'bg-blue-100 text-blue-700',
    'DONE': 'bg-green-100 text-green-700',
    'DRAFT': 'bg-gray-100 text-gray-700',
    'CANCELLED': 'bg-red-100 text-red-700'
}

export default async function RecentOrders() {
    const orders = await prisma.order.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        include: { pricing_package: { select: { name: true } } }
    })

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Pesanan Terbaru</h2>
                <Link href="/monolith-core/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Lihat Semua
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Klien</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Layanan</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                                    Belum ada pesanan terbaru.
                                </td>
                            </tr>
                        ) : orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <Link href={`/monolith-core/orders/${order.id}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                            #{order.id.slice(0, 8)}
                                        </Link>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{order.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{order.pricing_package?.name || 'Custom Project'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${statusStyles[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">Rp {Number(order.total_price || 0).toLocaleString('id-ID')}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/monolith-core/orders/${order.id}`}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Order"
                                        >
                                            <ExternalLink size={18} />
                                        </Link>
                                        <a
                                            href={`https://wa.me/${order.whatsapp?.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Hubungi Klien via WA"
                                        >
                                            <MessageCircle size={18} />
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
