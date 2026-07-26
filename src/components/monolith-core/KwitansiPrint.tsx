'use client'

import React from 'react'
import KwitansiReceipt from '@/components/order-client/KwitansiReceipt'

interface KwitansiPrintProps {
  payment: {
    id: string
    amount: number
    payment_method?: string
    notes?: string
    paid_at?: string
    created_at: string
  }
  order: {
    id: string
    name: string
    whatsapp: string
    email?: string
    project_title?: string
    total_price?: number
  }
  kwitansiNumber?: string
}

export default function KwitansiPrint({ payment, order }: KwitansiPrintProps) {
  return (
    <KwitansiReceipt
      paymentId={payment.id}
      amount={Number(payment.amount)}
      customerName={order.name}
      projectTitle={order.project_title}
      paidAt={payment.paid_at || payment.created_at}
      paymentMethod={payment.payment_method}
    />
  )
}
