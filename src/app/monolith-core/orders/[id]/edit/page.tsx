'use client'

import { use } from 'react'
import ClientOrderForm from '@/components/ClientOrderForm'

export default function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <ClientOrderForm isPublic={false} orderId={id} />
}
