import {
    ShoppingBag,
    Users,
    DollarSign,
    Clock
} from 'lucide-react'

import prisma from '@/lib/prisma'

export default async function StatsCards() {
    // Fetch statistics
    const totalOrder = await prisma.order.count();
    
    // Antrian Aktif (Pending, Active, On Progress)
    const activeCount = await prisma.order.count({
        where: {
            status: { in: ['PENDING', 'ACTIVE', 'ON_PROGRESS'] }
        }
    });

    // Klien Puas & Omzet (Done)
    const doneOrders = await prisma.order.findMany({
        where: { status: 'DONE' },
        select: { total_price: true }
    });
    
    const satisfiedClients = doneOrders.length;
    const totalRevenue = doneOrders.reduce((sum, order) => sum + Number(order.total_price || 0), 0);
    
    // Format Revenue
    const formatShortCurrency = (val: number) => {
        if (val === 0) return 'Rp 0'
        if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)}M`
        if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1)} Juta`
        if (val >= 1_000) return `Rp ${(val / 1_000).toFixed(1)}K`
        return `Rp ${val.toLocaleString('id-ID')}`
    }

    const stats = [
        {
            title: 'Total Order',
            value: totalOrder.toString(),
            icon: ShoppingBag,
            color: 'text-blue-600 bg-blue-100',
            description: 'Semua pesanan masuk'
        },
        {
            title: 'Antrian Aktif',
            value: activeCount.toString(),
            icon: Clock,
            color: 'text-orange-600 bg-orange-100',
            description: 'Proyek sedang berjalan'
        },
        {
            title: 'Total Omzet',
            value: formatShortCurrency(totalRevenue),
            icon: DollarSign,
            color: 'text-green-600 bg-green-100',
            description: 'Pendapatan selesai'
        },
        {
            title: 'Klien Puas',
            value: satisfiedClients.toString(),
            icon: Users,
            color: 'text-purple-600 bg-purple-100',
            description: 'Testimoni positif'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                <Icon size={24} />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                            <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
