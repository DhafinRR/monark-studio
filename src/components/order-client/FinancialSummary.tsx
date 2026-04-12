'use client'

import { Card, CardContent } from '@/components/ui/card'
import { LayoutGrid, CircleCheck, Wallet } from 'lucide-react'

interface FinancialSummaryProps {
  totalAmount: number
  totalPaid: number
  remainingBalance: number
}

export default function FinancialSummary({
  totalAmount,
  totalPaid,
  remainingBalance
}: FinancialSummaryProps) {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val)
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {/* Total Kontrak */}
      <Card className="bg-white border border-border/20 rounded-xl shadow-sm group hover:shadow-md transition-shadow">
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
              Nilai Kontrak Total
            </span>
            <LayoutGrid className="text-muted-foreground/20 group-hover:text-accent/40 transition-colors h-[18px] w-[18px]" />
          </div>
          <div className="text-2xl lg:text-3xl font-display font-bold text-foreground">
            {formatRupiah(totalAmount)}
          </div>
          <p className="text-[10px] mt-4 text-muted-foreground/40 italic">
            Estimasi total biaya proyek
          </p>
        </CardContent>
      </Card>

      {/* Dana Terverifikasi */}
      <Card className="bg-white border border-green-200/50 rounded-xl shadow-sm group hover:shadow-md transition-shadow">
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700/60">
              Dana Terverifikasi
            </span>
            <CircleCheck className="text-green-600/40 group-hover:text-green-600 transition-colors h-[18px] w-[18px]" />
          </div>
          <div className="text-2xl lg:text-3xl font-display font-bold text-green-700">
            {formatRupiah(totalPaid)}
          </div>
          <p className="text-[10px] mt-4 text-green-700/40 italic">
            Total yang telah dibayarkan
          </p>
        </CardContent>
      </Card>

      {/* Sisa Kewajiban - Dark Card */}
      <Card className="bg-gray-900 text-white rounded-xl shadow-xl">
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">
              Sisa Kewajiban
            </span>
            <Wallet className="text-white/40 h-[18px] w-[18px]" />
          </div>
          <div className="text-2xl lg:text-3xl font-display font-bold text-white">
            {formatRupiah(remainingBalance)}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${remainingBalance > 0 ? 'bg-orange-400 animate-pulse' : 'bg-green-400'}`} />
            <p className="text-[10px] text-white/40 italic">
              {remainingBalance > 0 ? 'Menunggu pembayaran selanjutnya' : 'Lunas'}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
