'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface TimelineStep {
  id: string
  step_number: number
  title: string
  description: string
  duration: string | null
  icon: string | null
  is_active: boolean
  created_at: Date
  updated_at: Date
}

interface TimelineListProps {
  initialSteps: TimelineStep[]
}

export default function TimelineList({ initialSteps }: TimelineListProps) {
  const router = useRouter()
  const [steps, setSteps] = useState(initialSteps)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus timeline step "${title}"?`)) return

    setDeletingId(id)

    try {
      const response = await fetch(`/api/admin/timeline/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete timeline step')
      }

      toast.success('Timeline step deleted successfully!')
      setSteps(steps.filter((s) => s.id !== id))
      router.refresh()
    } catch (error) {
      console.error('Error deleting timeline step:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete timeline step')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/timeline/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update timeline step')
      }

      toast.success(`Timeline step ${!currentStatus ? 'activated' : 'deactivated'}!`)
      setSteps(steps.map((s) => (s.id === id ? { ...s, is_active: !currentStatus } : s)))
      router.refresh()
    } catch (error) {
      console.error('Error toggling timeline step:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update timeline step')
    }
  }

  if (steps.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Belum ada timeline steps. Tambahkan yang pertama!</p>
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
                Step
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title & Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
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
            {steps.map((step) => (
              <tr key={step.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {step.icon && <span className="text-2xl">{step.icon}</span>}
                    <span className="text-sm font-bold text-gray-900">#{step.step_number}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 mb-1">{step.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">{step.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{step.duration || '-'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleActive(step.id, step.is_active)}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      step.is_active
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {step.is_active ? (
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
                      href={`/monolith-core/timeline/${step.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(step.id, step.title)}
                      disabled={deletingId === step.id}
                      className="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded disabled:opacity-50"
                    >
                      {deletingId === step.id ? (
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
