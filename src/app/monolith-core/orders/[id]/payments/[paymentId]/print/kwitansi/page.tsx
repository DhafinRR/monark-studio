'use client'

import { useState, useEffect } from 'react'
import KwitansiPrint from '@/components/monolith-core/KwitansiPrint'

interface Payment {
  id: string
  amount: number
  payment_method?: string
  notes?: string
  paid_at?: string
  created_at: string
}

interface Order {
  id: string
  name: string
  whatsapp: string
  email?: string
  project_title?: string
  total_price?: number
}

interface PageProps {
  params: { id: string; paymentId: string }
}

export default function KwitansiPrintPage({ params }: PageProps) {
  const { id, paymentId } = params
  const [payment, setPayment] = useState<Payment | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [id, paymentId])

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/monolith-core/orders/${id}`)
      const data = await res.json()

      if (data.payments) {
        const foundPayment = data.payments.find((p: Payment) => p.id === paymentId)
        setPayment(foundPayment)
      }

      setOrder({
        id: data.id,
        name: data.name,
        whatsapp: data.whatsapp,
        email: data.email,
        project_title: data.project_title,
        total_price: data.total_price
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
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

  if (!payment || !order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Payment or Order not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center pt-8 print:bg-white print:pt-0">
      {/* Kwitansi Content */}
      <div className="shadow-2xl print:shadow-none">
        <KwitansiPrint payment={payment} order={order} />
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
