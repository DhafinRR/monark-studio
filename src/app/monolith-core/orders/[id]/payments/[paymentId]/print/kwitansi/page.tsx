'use client'

import { useState, useEffect } from 'react'
import KwitansiReceipt from '@/components/order-client/KwitansiReceipt'

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
      <div className="shadow-2xl print:shadow-none">
        <KwitansiReceipt
          paymentId={payment.id}
          amount={Number(payment.amount)}
          customerName={order.name}
          projectTitle={order.project_title}
          paidAt={payment.paid_at || payment.created_at}
          paymentMethod={payment.payment_method}
        />
      </div>
    </div>
  )
}
