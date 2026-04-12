'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, FileText, Check, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import ClientHeader from './ClientHeader'
import ClientFooter from './ClientFooter'
import PaymentSummary from './PaymentSummary'
import PaymentMethod from './PaymentMethod'
import PaymentVAInfo from './PaymentVAInfo'
import PaymentConfirmationModal from './PaymentConfirmationModal'
import KwitansiReceipt from './KwitansiReceipt'

interface PaymentPageProps {
  orderId: string
  paymentId: string
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
    payment_method?: string
    account_number?: string
  }>
  pricing_package?: {
    name: string
  } | null
}

type Phase = 'select' | 'pending' | 'success'
type Method = 'va' | 'qris' | 'ewallet'

export default function PaymentPage({ orderId, paymentId }: PaymentPageProps) {
  const router = useRouter()
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Phase state
  const [phase, setPhase] = useState<Phase>('select')
  
  // Selected method
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null)
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  
  // Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  
  // VA Info (simulated - no actual gateway)
  const [vaNumber, setVaNumber] = useState<string>('')
  const [expiryTime] = useState(() => {
    const date = new Date()
    date.setHours(date.getHours() + 24)
    return date.toISOString()
  })

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/${orderId}`)
        if (!res.ok) throw new Error('Order not found')
        const data = await res.json()
        setOrder(data)

        // Find the payment
        const payment = data.payments?.find((p: any) => p.id === paymentId)
        if (payment) {
          if (payment.status === 'SUCCEEDED') {
            setPhase('success')
          } else if (payment.account_number) {
            setVaNumber(payment.account_number)
            setPhase('pending')
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, paymentId])

  const handleSelectMethod = (method: 'va' | 'qris' | 'ewallet', bankCode?: string) => {
    setSelectedMethod(method)
    setSelectedBank(bankCode || null)
  }

  const handleConfirmMethod = () => {
    if (!selectedMethod) return

    // Simulate VA number generation (UI only - no actual gateway)
    if (selectedMethod === 'va') {
      const bankPrefix = selectedBank === 'BCA' ? '8800' : '8850'
      const randomNum = Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')
      setVaNumber(`${bankPrefix}${randomNum}`)
    }

    setPhase('pending')
    setShowConfirmModal(false)
  }

  const handleChangeMethod = () => {
    setPhase('select')
    setSelectedMethod(null)
    setSelectedBank(null)
    setVaNumber('')
  }

  const handleConfirmPayment = () => {
    // For now, just show success (in real app, this would verify with payment gateway)
    setPhase('success')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Spinner size="lg" className="text-accent" />
        <p className="mt-4 text-muted-foreground text-sm">Memuat data...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-display font-bold text-foreground/20 mb-4">Monark Studio</h1>
        <p className="text-lg text-muted-foreground/60">
          Data pembayaran tidak ditemukan.
        </p>
        <Link href="/" className="mt-8 text-sm font-bold text-accent hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    )
  }

  // Find current payment
  const currentPayment = order.payments?.find(p => p.id === paymentId)
  const totalAmount = Number(order.total_price) || 0
  const totalPaid = order.payments
    ?.filter(p => p.status === 'SUCCEEDED')
    .reduce((acc, p) => acc + Number(p.amount), 0) || 0
  const remainingBalance = Math.max(0, totalAmount - totalPaid)
  const currentAmount = currentPayment ? Number(currentPayment.amount) : remainingBalance
  const invoiceNumber = `INV-${new Date(order.created_at).getFullYear()}-${order.id.slice(0, 4).toUpperCase()}`
  const isSuccess = phase === 'success' || currentPayment?.status === 'SUCCEEDED'

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader />

      <main className="container mx-auto px-4 py-12 lg:py-16">
        {/* Back Link */}
        <Link 
          href={`/order/${orderId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Order
        </Link>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {/* Header Info */}
            <section className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h1 className="font-display text-3xl text-foreground">
                    Detail Penagihan
                  </h1>
                  <p className="text-xs text-muted-foreground/60 italic">
                    Invoice #{invoiceNumber} &bull; {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                {isSuccess && (
                  <Badge className="bg-green-100 text-green-700 font-black uppercase tracking-widest text-[9px]">
                    Lunas
                  </Badge>
                )}
              </div>
            </section>

            {/* Financial Summary */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 border border-border/20 rounded-xl space-y-2">
                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                  Kontrak Total
                </div>
                <div className="text-lg font-display font-semibold">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalAmount)}
                </div>
              </div>
              <div className="bg-white p-6 border border-green-200/50 rounded-xl space-y-2">
                <div className="text-[9px] font-black uppercase tracking-widest text-green-700/60">
                  Sudah Terbayar
                </div>
                <div className="text-lg font-display font-semibold text-green-700">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalPaid)}
                </div>
              </div>
              <div className="bg-gray-900 p-6 rounded-xl space-y-2 text-white">
                <div className="text-[9px] font-black uppercase tracking-widest text-white/30">
                  Sisa Tagihan
                </div>
                <div className="text-lg font-display font-semibold text-white">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(remainingBalance)}
                </div>
              </div>
            </section>

            {/* Payment Content (Dynamic based on phase) */}
            <section>
              {phase === 'select' && (
                <PaymentMethod
                  onSelect={handleSelectMethod}
                  onConfirm={() => setShowConfirmModal(true)}
                  selectedMethod={selectedMethod || undefined}
                  selectedBank={selectedBank || undefined}
                />
              )}

              {phase === 'pending' && (
                <PaymentVAInfo
                  bankCode={selectedBank || 'BCA'}
                  accountNumber={vaNumber}
                  amount={currentAmount}
                  expiresAt={expiryTime}
                  onChangeMethod={handleChangeMethod}
                  onConfirm={handleConfirmPayment}
                />
              )}

              {phase === 'success' && (
                <div className="space-y-6">
                  <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                    <div className="flex items-center justify-center gap-2 text-green-700">
                      <Check className="w-5 h-5" />
                      <span className="font-bold">Pembayaran berhasil tercatat dalam sistem</span>
                    </div>
                  </div>
                  <KwitansiReceipt
                    paymentId={paymentId}
                    amount={currentAmount}
                    customerName={order.name}
                    projectTitle={order.project_title}
                    paidAt={currentPayment?.paid_at}
                    paymentMethod={currentPayment?.payment_method}
                  />
                </div>
              )}
            </section>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="lg:col-span-4 sticky top-32">
            <PaymentSummary
              totalAmount={totalAmount}
              totalPaid={totalPaid}
              remainingBalance={remainingBalance}
              currentAmount={currentAmount}
              invoiceNumber={invoiceNumber}
              paymentNotes={currentPayment?.notes}
              status={currentPayment?.status || 'PENDING'}
              isSuccess={isSuccess}
            />
          </div>
        </div>
      </main>

      <ClientFooter />

      {/* Confirmation Modal */}
      <PaymentConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmMethod}
        method={selectedMethod || ''}
        bankCode={selectedBank || undefined}
        amount={currentAmount}
      />
    </div>
  )
}
