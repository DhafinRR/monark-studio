import {
    ShoppingBag,
    Users,
    DollarSign,
    Clock
} from 'lucide-react'

interface Stat {
    title: string
    value: string
    icon: any
    color: string
    description: string
}

const stats: Stat[] = [
    {
        title: 'Total Order',
        value: '24',
        icon: ShoppingBag,
        color: 'text-blue-600 bg-blue-100',
        description: 'Semua pesanan masuk'
    },
    {
        title: 'Antrian Aktif',
        value: '5',
        icon: Clock,
        color: 'text-orange-600 bg-orange-100',
        description: 'Proyek sedang berjalan'
    },
    {
        title: 'Total Omzet',
        value: 'Rp 45.5M',
        icon: DollarSign,
        color: 'text-green-600 bg-green-100',
        description: 'Pendapatan selesai'
    },
    {
        title: 'Klien Puas',
        value: '18',
        icon: Users,
        color: 'text-purple-600 bg-purple-100',
        description: 'Testimoni positif'
    }
]

export default function StatsCards() {
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
