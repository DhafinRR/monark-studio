'use client'

import { useState, useEffect, use } from 'react'
import { Loader2 } from 'lucide-react'
import PortfolioForm from '@/components/monolith-core/PortfolioForm'

export default function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/monolith-core/portfolio/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Portfolio tidak ditemukan'); setLoading(false) })
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">{error || 'Data tidak ditemukan'}</p>
      </div>
    )
  }

  return <PortfolioForm initialData={data} id={id} />
}
