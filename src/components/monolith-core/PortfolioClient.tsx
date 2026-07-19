'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronUp, ChevronDown, ArrowUpDown, Briefcase, Trash2, Edit } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { getStoragePublicUrl } from '@/lib/storage-url'

interface TechStack {
  id: string
  name: string
  icon_url: string | null
  color_hex: string | null
}

interface PortfolioProject {
  id: string
  title: string
  description: string
  type: 'WEB' | 'MOBILE'
  image_url: string
  stacks: TechStack[]
  created_at: string
}

type SortKey = 'title' | 'created_at'

interface PortfolioClientProps {
  initialProjects: PortfolioProject[]
}

export default function PortfolioClient({ initialProjects }: PortfolioClientProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey
    direction: 'asc' | 'desc'
  } | null>(null)

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus portfolio "${title}"? Aksi ini tidak bisa dibatalkan.`)) return

    try {
      const res = await fetch(`/api/monolith-core/portfolio/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success(`"${title}" berhasil dihapus`)
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Gagal menghapus portfolio')
      }
    } catch {
      toast.error('Gagal menghapus portfolio')
    }
  }

  const processedData = useMemo(() => {
    let result = [...initialProjects]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.stacks.some(s => s.name.toLowerCase().includes(term))
      )
    }

    if (sortConfig) {
      result.sort((a, b) => {
        let valA: string
        let valB: string

        if (sortConfig.key === 'created_at') {
          valA = a.created_at
          valB = b.created_at
        } else {
          valA = a[sortConfig.key].toLowerCase()
          valB = b[sortConfig.key].toLowerCase()
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [initialProjects, searchTerm, sortConfig])

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortConfig?.key !== column) {
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-20 group-hover:opacity-100 transition-opacity" />
    }
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="w-4 h-4 ml-1 text-blue-600" />
      : <ChevronDown className="w-4 h-4 ml-1 text-blue-600" />
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <>
      {/* Toolbar / Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari judul, deskripsi, atau tech stack..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 rounded-xl transition-all outline-none text-gray-900 border-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
          Total: <span className="text-gray-600">{processedData.length}</span> items
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-8 w-20">
                  Thumbnail
                </th>
                <th
                  className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer group hover:text-blue-600 transition-colors"
                  onClick={() => requestSort('title')}
                >
                  <div className="flex items-center">
                    Title <SortIcon column="title" />
                  </div>
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Type
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Tech Stacks
                </th>
                <th
                  className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer group hover:text-blue-600 transition-colors"
                  onClick={() => requestSort('created_at')}
                >
                  <div className="flex items-center">
                    Tanggal <SortIcon column="created_at" />
                  </div>
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {processedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Briefcase className="w-10 h-10 text-gray-200" />
                      <span className="text-gray-500 font-medium">Belum ada portfolio.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                processedData.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4 pl-8">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-100 overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                        <img
                          src={getStoragePublicUrl(project.image_url)}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 truncate max-w-[200px]">{project.title}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">{project.id.split('-')[0]}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${
                        project.type === 'WEB'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                          : 'bg-violet-50 text-violet-700 ring-violet-100'
                      }`}>
                        {project.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.stacks.slice(0, 3).map((stack) => (
                          <span
                            key={stack.id}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border"
                            style={{
                              backgroundColor: `${stack.color_hex || '#3b82f6'}15`,
                              color: stack.color_hex || '#3b82f6',
                              borderColor: `${stack.color_hex || '#3b82f6'}30`,
                            }}
                          >
                            {stack.name}
                          </span>
                        ))}
                        {project.stacks.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-50 text-gray-500 border border-gray-100">
                            +{project.stacks.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{formatDate(project.created_at)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => router.push(`/monolith-core/portfolio/${project.id}/edit`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
