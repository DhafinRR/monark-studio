import { Plus } from 'lucide-react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import PortfolioClient from '@/components/monolith-core/PortfolioClient'

export const dynamic = 'force-dynamic'

async function getPortfolioProjects() {
  const projects = await prisma.portfolioProject.findMany({
    include: {
      stacks: true,
    },
    orderBy: { created_at: 'desc' }
  })
  return projects
}

export default async function PortfolioPage() {
  const projects = await getPortfolioProjects()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Portfolio</h1>
          <p className="text-gray-500 text-sm">Kelola proyek portfolio yang ditampilkan di website.</p>
        </div>
        <Link
          href="/monolith-core/portfolio/new"
          className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Portfolio Baru
        </Link>
      </div>

      <PortfolioClient initialProjects={projects as any} />
    </div>
  )
}
