import { Metadata } from 'next'
import OrderClientPage from '@/components/order-client/OrderClientPage'

export const metadata: Metadata = {
  title: 'Client Portal | Monark Studio',
  description: 'View your project details and payments',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ClientOrderPage({ params }: PageProps) {
  const { id } = await params

  return <OrderClientPage orderId={id} />
}
