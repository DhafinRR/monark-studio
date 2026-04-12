import { Metadata } from 'next'
import PaymentPage from '@/components/order-client/PaymentPage'

export const metadata: Metadata = {
  title: 'Pembayaran | Monark Studio',
  description: 'Halaman pembayaran proyek',
}

interface PageProps {
  params: Promise<{ id: string; paymentId: string }>
}

export default async function PaymentRoutePage({ params }: PageProps) {
  const { id, paymentId } = await params

  return <PaymentPage orderId={id} paymentId={paymentId} />
}
