'use client'

import { useState, useEffect } from 'react'
import ClientHeader from './ClientHeader'
import ClientHero from './ClientHero'
import FinancialSummary from './FinancialSummary'
import PaymentTimeline from './PaymentTimeline'
import InvoicePreview from './InvoicePreview'
import SecurityNotice from './SecurityNotice'
import ClientFooter from './ClientFooter'

interface OrderClientPageProps {
  orderId: string
}

interface OrderData {
  id: string
  project_title?: string
  name: string
  whatsapp: string
  email?: string
  status: string
  total_price: string
  created_at: string
  items: Array<{
    id: string
    description: string
    price: string
    classification: string
  }>
  payments: Array<{
    id: string
    amount: string
    status: string
    notes?: string
    paid_at?: string
    created_at: string
  }>
  pricing_package?: {
    name: string
  } | null
}

export default function OrderClientPage({ orderId }: OrderClientPageProps) {
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/${orderId}`)
        if (!res.ok) {
          throw new Error('Order not found')
        }
        const data = await res.json()
        setOrder(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-muted-foreground text-sm">Memuat data...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-display font-bold text-foreground/20 mb-4">Monark Studio</h1>
        <p className="text-lg text-muted-foreground/60">
          Data proyek tidak ditemukan atau tautan telah kedaluwarsa.
        </p>
        <a
          href="/"
          className="mt-8 text-sm font-bold text-accent hover:underline"
        >
          Kembali ke Beranda
        </a>
      </div>
    )
  }

  const totalAmount = Number(order.total_price) || 0
  const totalPaid = order.payments
    ?.filter(p => p.status === 'SUCCEEDED')
    .reduce((acc, p) => acc + Number(p.amount), 0) || 0
  const remainingBalance = Math.max(0, totalAmount - totalPaid)

  const invoiceNumber = `INV-${new Date(order.created_at).getFullYear()}-${order.id.slice(0, 4).toUpperCase()}`

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader />

      <main className="container mx-auto px-4 py-12 lg:py-16">
        {/* Hero Section */}
        <ClientHero
          invoiceNumber={invoiceNumber}
          projectTitle={order.project_title}
          customerName={order.name}
          status={order.status}
          createdAt={order.created_at}
          orderId={order.id}
        />

        {/* Financial Summary */}
        <FinancialSummary
          totalAmount={totalAmount}
          totalPaid={totalPaid}
          remainingBalance={remainingBalance}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Sidebar - Payment Timeline */}
          <div className="lg:col-span-3 space-y-8">
            <PaymentTimeline
              payments={order.payments || []}
              orderId={order.id}
            />
            <SecurityNotice />
          </div>

          {/* Right Side - Invoice Preview */}
          <div className="lg:col-span-9">
            <div className="bg-white border border-border/20 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border/20 bg-primary/5 flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                  Dokumen Invoice
                </h3>
                <div className="flex gap-2">
                  <span className="text-[8px] font-black uppercase tracking-widest bg-foreground/5 px-3 py-1 rounded-full">
                    Original Document
                  </span>
                </div>
              </div>

              <div className="p-6 overflow-x-auto">
                <InvoicePreview
                  invoiceNumber={invoiceNumber}
                  date={order.created_at}
                  customerName={order.name}
                  customerPhone={order.whatsapp}
                  items={order.items || []}
                  totalAmount={totalAmount}
                  pricingPackageName={order.pricing_package?.name}
                  projectTitle={order.project_title}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <ClientFooter />
    </div>
  )
}
