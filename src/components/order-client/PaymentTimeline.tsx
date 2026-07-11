'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Wallet, Clock } from 'lucide-react'

interface Payment {
  id: string
  amount: string
  status: string
  notes?: string
  paid_at?: string
  created_at: string
}

interface PaymentTimelineProps {
  payments: Payment[]
  orderId: string
}

export default function PaymentTimeline({ payments, orderId }: PaymentTimelineProps) {
  const router = useRouter()

  const formatRupiah = (val: string | number) => {
    const numVal = typeof val === 'string' ? parseFloat(val) : val
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(numVal)
  }

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'Belum Bayar'
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const isPaid = (status: string) => status === 'CONFIRMED' || status === 'SUCCEEDED'

  if (!payments || payments.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="font-display text-xl font-semibold text-foreground">Riwayat Pembayaran</h3>
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/40">
            Payment & Billing Timeline
          </p>
        </div>

        <div className="p-8 border-2 border-dashed border-border/20 text-center space-y-4 rounded-xl">
          <Clock className="mx-auto text-muted-foreground/10 h-8 w-8" />
          <p className="text-xs text-muted-foreground/40 italic">
            Belum ada catatan pembayaran terdaftar.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-display text-xl font-semibold text-foreground">Riwayat Pembayaran</h3>
        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/40">
          Payment & Billing Timeline
        </p>
      </div>

      <div className="space-y-4">
        {payments.map((payment, idx) => (
          <Card
            key={payment.id}
            className={`rounded-xl transition-all hover:-translate-y-1 ${isPaid(payment.status)
                ? 'bg-white border border-border/20 shadow-sm'
                : 'bg-white border-l-4 border-l-orange-500 shadow-sm'
              }`}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                    Termin #{idx + 1}
                  </div>
                  <div className="text-lg font-display font-semibold text-foreground">
                    {formatRupiah(payment.amount)}
                  </div>
                </div>

                {isPaid(payment.status) ? (
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="default" className="text-[8px] font-black uppercase tracking-widest bg-green-50 text-green-700 hover:bg-green-50">
                      Lunas
                    </Badge>
                    <span className="text-[8px] font-bold text-green-600/50 uppercase tracking-tighter">
                      Verified
                    </span>
                  </div>
                ) : (
                  <Badge variant="secondary" className="text-[8px] font-black uppercase tracking-widest bg-orange-100 text-orange-700 hover:bg-orange-100">
                    Menunggu Pembayaran
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <div className="text-[11px] font-medium text-muted-foreground italic">
                  {payment.notes || 'Pembayaran Proyek'}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/10">
                  <div className="text-[10px] font-semibold text-muted-foreground/50 italic">
                    {formatDate(payment.paid_at || payment.created_at)}
                  </div>

                  {isPaid(payment.status) ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 bg-accent text-white text-[9px] font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-accent/90 hover:text-white"
                      onClick={() => {
                        // route to the client-facing kwitansi page
                        router.push(`/order/${orderId}/payment/${payment.id}/kwitansi`)
                      }}
                    >
                      <Download size={14} /> Unduh Kwitansi
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="h-9 bg-orange-500 text-white text-[10px] font-bold tracking-widest uppercase rounded-lg px-6 shadow-lg hover:bg-orange-600"
                      onClick={() => {
                        router.push(`/order/${orderId}/payment/${payment.id}`)
                      }}
                    >
                      <Wallet size={14} className="mr-2" /> Bayar Sekarang
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
