'use client'

import ClientOrderForm from '@/components/ClientOrderForm'

export default function EditOrderPage({ params }: { params: { id: string } }) {
  const { id } = params
  return <ClientOrderForm isPublic={false} orderId={id} />
}
