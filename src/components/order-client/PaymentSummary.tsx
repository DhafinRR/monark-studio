'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck } from 'lucide-react'

interface PaymentSummaryProps {
  totalAmount: number
  totalPaid: number
  remainingBalance: number
  currentAmount: number
  invoiceNumber: string
  paymentNotes?: string
  status: string
  isSuccess: boolean
}

export default function PaymentSummary({
  totalAmount,
  totalPaid,
  remainingBalance,
  currentAmount,
  invoiceNumber,
  paymentNotes,
  status,
  isSuccess
}: PaymentSummaryProps) {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val)
  }

  return (
    <Card className="bg-gray-900 text-white rounded-xl shadow-xl overflow-hidden">
      <div className="p-8 space-y-10">
        {/* Amount */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            Tagihan Proyek Berjalan
          </span>
          <div className="text-4xl lg:text-5xl font-display font-bold text-white">
            {formatRupiah(currentAmount)}
          </div>
        </div>

        {/* Status Badge */}
        <div className="space-y-4">
          {isSuccess ? (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-green-400">
                Pembayaran Lunas
              </span>
            </div>
          ) : (
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">
                Detail Pembayaran
              </div>
              <p className="font-medium text-white/80 italic">
                {paymentNotes || 'Pembayaran Proyek'}
              </p>
            </div>
          )}
        </div>

        {/* Invoice Info */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center text-[12px] font-bold">
            <span>Sisa Kewajiban</span>
            <span className="text-lg">
              {remainingBalance <= 0 ? (
                <span className="text-green-400 uppercase font-black">Lunas</span>
              ) : (
                <span>{formatRupiah(remainingBalance)}</span>
              )}
            </span>
          </div>

          <div className="h-px bg-white/10" />
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            <span>Invoice Rekam #</span>
            <span>{invoiceNumber}</span>
          </div>

          <div className="h-px bg-white/10" />

          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="opacity-40 font-serif">Status Berkas</span>
            <Badge variant="outline" className="text-white border-white/30 text-[9px]">
              {status}
            </Badge>
          </div>
        </div>

        {/* Security Badge */}
        <div className="pt-6 flex flex-col items-center gap-4 text-[9px] font-black tracking-[0.3em] text-white/20 uppercase">
          <ShieldCheck className="opacity-40 h-5 w-5" />
          Monark Secure Transaction • SSL 256-bit
        </div>
      </div>
    </Card>
  )
}
