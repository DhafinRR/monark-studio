'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface KetentuanItem {
  id: string
  order_number: number
  title: string
  content: string
  icon: string | null
  is_active: boolean
  created_at: Date
  updated_at: Date
}

interface KetentuanListProps {
  initialItems: KetentuanItem[]
}

export default function KetentuanList({ initialItems }: KetentuanListProps) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus ketentuan "${title}"?`)) return

    setDeletingId(id)

    try {
      const response = await fetch(`/api/admin/ketentuan/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete ketentuan')
      }

      toast.success('Ketentuan deleted successfully!')
      setItems(items.filter((item) => item.id !== id))
      router.refresh()
    } catch (error) {
      console.error('Error deleting ketentuan:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete ketentuan')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/ketentuan/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update ketentuan')
      }

      toast.success(`Ketentuan ${!currentStatus ? 'activated' : 'deactivated'}!`)
      setItems(items.map((item) => (item.id === id ? { ...item, is_active: !currentStatus } : item)))
      router.refresh()
    } catch (error) {
      console.error('Error toggling ketentuan:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update ketentuan')
    }
  }

  // Strip HTML tags for preview
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Belum ada ketentuan. Tambahkan yang pertama!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title & Preview
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {item.icon && <span className="text-2xl">{item.icon}</span>}
                    <span className="text-sm font-bold text-gray-900">#{item.order_number}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 mb-1">{item.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {stripHtml(item.content).substring(0, 150)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleActive(item.id, item.is_active)}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      item.is_active
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {item.is_active ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/monolith-core/ketentuan/${item.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      disabled={deletingId === item.id}
                      className="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded disabled:opacity-50"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
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
