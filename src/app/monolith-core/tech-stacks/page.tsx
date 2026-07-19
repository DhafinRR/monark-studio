import { Plus } from 'lucide-react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import TechStacksClient from '@/components/monolith-core/TechStacksClient'

async function getTechStacks() {
  const techStacks = await prisma.techStack.findMany({
    include: {
      _count: {
        select: { projects: true }
      }
    },
    orderBy: { name: 'asc' }
  })
  return techStacks
}

export default async function TechStacksPage() {
  const techStacks = await getTechStacks()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Technology Stacks</h1>
          <p className="text-gray-500 text-sm">Kelola aset teknologi yang Anda gunakan untuk Portfolio.</p>
        </div>
        <Link 
          href="/monolith-core/tech-stacks/new"
          className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Stack Baru
        </Link>
      </div>

      <TechStacksClient initialTechStacks={techStacks as any} />
    </div>
  )
}
