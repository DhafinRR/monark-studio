'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import TechStackForm from '@/components/monolith-core/TechStackForm'

export default function EditTechStackPage() {
  const params = useParams()
  const id = params.id as string

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/monolith-core/tech-stacks/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(() => {
        setError('Tech Stack tidak ditemukan')
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    )
  }

  return <TechStackForm initialData={data!} id={id} />
}
