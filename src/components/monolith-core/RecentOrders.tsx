import Link from 'next/link'
import { ExternalLink, MessageCircle } from 'lucide-react'

const dummyOrders = [
    {
        id: '1',
        orderNumber: 24,
        queueNumber: 1,
        name: 'Budi Santoso',
        packageType: 'Web App / CMS',
        status: 'On Progress',
        price: 'Rp 5.000.000',
        previewLink: 'https://monark-budi.vercel.app'
    },
    {
        id: '2',
        orderNumber: 23,
        queueNumber: 2,
        name: 'Sari Indah',
        packageType: 'Basic Web',
        status: 'Queued',
        price: 'Rp 1.000.000',
        previewLink: null
    },
    {
        id: '3',
        orderNumber: 22,
        queueNumber: null,
        name: 'Toko Maju Jaya',
        packageType: 'Mobile App',
        status: 'Done',
        price: 'Rp 15.000.000',
        previewLink: 'https://play.google.com/store/toko-maju'
    }
]

const statusStyles: Record<string, string> = {
    'New': 'bg-blue-100 text-blue-700',
    'Queued': 'bg-orange-100 text-orange-700',
    'On Progress': 'bg-purple-100 text-purple-700',
    'Done': 'bg-green-100 text-green-700',
    'Revision': 'bg-yellow-100 text-yellow-700'
}

export default function RecentOrders() {
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
                        {dummyOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900">#{order.orderNumber}</span>
                                        {order.queueNumber && (
                                            <span className="text-xs text-orange-500 font-medium">Antrian #{order.queueNumber}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{order.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{order.packageType}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.price}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {order.previewLink && (
                                            <a
                                                href={order.previewLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Staging"
                                            >
                                                <ExternalLink size={18} />
                                            </a>
                                        )}
                                        <button
                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Contact Client"
                                        >
                                            <MessageCircle size={18} />
                                        </button>
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
