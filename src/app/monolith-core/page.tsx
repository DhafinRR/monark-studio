import StatsCards from '@/components/admin/StatsCards'
import RecentOrders from '@/components/admin/RecentOrders'
import { Plus, Settings, Briefcase, Star } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Ringkasan Bisnis</h1>
                    <p className="text-gray-500 mt-1">Pantau performa agensi Anda dalam satu layar.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/monolith-core/portfolio/new"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Tambah Porto</span>
                    </Link>
                </div>
            </div>

            {/* Stats Section */}
            <StatsCards />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders - 2/3 width */}
                <div className="lg:col-span-2">
                    <RecentOrders />
                </div>

                {/* Quick Access - 1/3 width */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Akses Cepat</h2>
                        <div className="grid grid-cols-1 gap-3">
                            <Link
                                href="/monolith-core/portfolio"
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-50 hover:border-blue-100 hover:bg-blue-50/50 transition-all group"
                            >
                                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 text-gray-600 group-hover:text-blue-600 transition-colors">
                                    <Briefcase size={20} />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-blue-700">Manage Porto</span>
                            </Link>

                            <Link
                                href="/monolith-core/services"
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-50 hover:border-blue-100 hover:bg-blue-50/50 transition-all group"
                            >
                                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 text-gray-600 group-hover:text-blue-600 transition-colors">
                                    <Star size={20} />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-blue-700">Layanan & Harga</span>
                            </Link>

                            <Link
                                href="/monolith-core/settings"
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-50 hover:border-blue-100 hover:bg-blue-50/50 transition-all group"
                            >
                                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 text-gray-600 group-hover:text-blue-600 transition-colors">
                                    <Settings size={20} />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-blue-700">Pengaturan Web</span>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Note / Tip */}
                    <div className="bg-blue-600 p-6 rounded-xl text-white shadow-lg shadow-blue-200 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                Tip Hari Ini 💡
                            </h3>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                Update status "On Progress" secara berkala agar klien tenang dan percaya pada proses kerja Anda.
                            </p>
                        </div>
                        {/* Organic shape background decorations */}
                        <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-blue-500 rounded-full blur-2xl opacity-50 group-hover:scale-125 transition-transform" />
                        <div className="absolute -left-4 -top-4 w-12 h-12 bg-blue-400 rounded-full blur-xl opacity-30 group-hover:translate-x-4 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    )
}