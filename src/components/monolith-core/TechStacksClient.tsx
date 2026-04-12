'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronUp, ChevronDown, ArrowUpDown, Code, Trash2, Edit } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface TechStack {
  id: string
  name: string
  icon_url: string | null
  color_hex: string | null
  _count?: {
    projects: number
  }
}

interface TechStacksClientProps {
  initialTechStacks: TechStack[]
}

export default function TechStacksClient({ initialTechStacks }: TechStacksClientProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ 
    key: 'name' | 'color_hex'; 
    direction: 'asc' | 'desc' 
  } | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus tech stack "${name}"? Aksi ini tidak bisa dibatalkan.`)) return

    try {
      const res = await fetch(`/api/monolith-core/tech-stacks/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success(`"${name}" berhasil dihapus`)
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Gagal menghapus tech stack')
      }
    } catch {
      toast.error('Gagal menghapus tech stack')
    }
  }

  const processedData = useMemo(() => {
    let result = [...initialTechStacks]

    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const valA = (a[sortConfig.key] || '').toLowerCase()
        const valB = (b[sortConfig.key] || '').toLowerCase()
        
        if (valA < valB) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (valA > valB) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [initialTechStacks, searchTerm, sortConfig])

  const requestSort = (key: 'name' | 'color_hex') => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const SortIcon = ({ column }: { column: 'name' | 'color_hex' }) => {
    if (sortConfig?.key !== column) {
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-20 group-hover:opacity-100 transition-opacity" />
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 ml-1 text-blue-600" /> 
      : <ChevronDown className="w-4 h-4 ml-1 text-blue-600" />
  }

  return (
    <>
      {/* Toolbar / Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama teknologi..."
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
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-8 w-24">
                  Icon
                </th>
                <th 
                  className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer group hover:text-blue-600 transition-colors"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    Nama Stack <SortIcon column="name" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer group hover:text-blue-600 transition-colors"
                  onClick={() => requestSort('color_hex')}
                >
                  <div className="flex items-center">
                    Pill Color <SortIcon column="color_hex" />
                  </div>
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                  Proyek
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {processedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Code className="w-10 h-10 text-gray-200" />
                      <span className="text-gray-500 font-medium">Belum ada teknologi.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                processedData.map((stack) => (
                  <tr 
                    key={stack.id} 
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4 pl-8">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center p-2 shadow-sm group-hover:scale-110 transition-transform">
                        {stack.icon_url && (stack.icon_url.trimStart().startsWith('<svg') || stack.icon_url.trimStart().startsWith('<?xml')) ? (
                          <div
                            className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                            dangerouslySetInnerHTML={{ __html: stack.icon_url }}
                          />
                        ) : stack.icon_url ? (
                          <img src={stack.icon_url} alt={stack.name} className="w-full h-full object-contain" />
                        ) : (
                          <Code className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 truncate max-w-[200px]">{stack.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">{stack.id.split('-')[0]}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-200" 
                          style={{ backgroundColor: stack.color_hex || '#3b82f6' }} 
                        />
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs font-mono border border-gray-100 lowercase">
                          {stack.color_hex || '#3b82f6'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold ring-1 ring-blue-100">
                        {stack._count?.projects || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => router.push(`/monolith-core/tech-stacks/${stack.id}/edit`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(stack.id, stack.name)}
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
