'use client'

import { useState, useEffect } from 'react'
import InvoicePrint from '@/components/monolith-core/InvoicePrint'

interface OrderItem {
  id: string
  description: string
  price: number
  classification: string
  custom_note?: string
  level?: string
  sub_level?: string
}

interface Order {
  id: string
  name: string
  whatsapp: string
  email?: string
  details?: string
  project_title?: string
  total_price?: number
  items: OrderItem[]
  pricing_package?: {
    name: string
    benefits?: string[]
  } | null
}

interface PageProps {
  params: { id: string }
}

export default function InvoicePrintPage({ params }: PageProps) {
  const { id } = params
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/monolith-core/orders/${id}`)
      const data = await res.json()
      setOrder(data)
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Order not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center pt-8 print:bg-white print:pt-0">
      {/* Invoice Content */}
      <div className="shadow-2xl print:shadow-none">
        <InvoicePrint order={order} />
      </div>

      {/* Print Button - Only visible on screen */}
      <div className="fixed bottom-6 right-6 print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save PDF
        </button>
      </div>

      <style jsx global>{`
        @page {
          size: A4;
        }
      `}</style>
    </div>
  )
}
