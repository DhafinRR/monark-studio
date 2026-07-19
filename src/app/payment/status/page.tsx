'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle2, Clock, XCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function PaymentStatusContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status') || 'pending'
  const ref = searchParams.get('ref') || ''

  const statusConfig: Record<string, { icon: React.ReactNode; title: string; description: string; color: string; bg: string }> = {
    success: {
      icon: <CheckCircle2 className="w-16 h-16 text-green-500" />,
      title: 'Pembayaran Berhasil! 🎉',
      description: 'Terima kasih! Pembayaran Anda telah kami terima. Tim kami akan segera memproses project Anda.',
      color: 'text-green-600',
      bg: 'bg-green-50 border-green-200'
    },
    pending: {
      icon: <Clock className="w-16 h-16 text-yellow-500" />,
      title: 'Menunggu Pembayaran',
      description: 'Pembayaran Anda sedang diproses. Silakan tunggu beberapa saat atau selesaikan pembayaran Anda.',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 border-yellow-200'
    },
    failed: {
      icon: <XCircle className="w-16 h-16 text-red-500" />,
      title: 'Pembayaran Gagal',
      description: 'Maaf, pembayaran Anda tidak berhasil. Silakan coba lagi atau hubungi kami untuk bantuan.',
      color: 'text-red-600',
      bg: 'bg-red-50 border-red-200'
    }
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className={`max-w-md w-full rounded-2xl border p-8 text-center space-y-6 ${config.bg}`}>
        <div className="flex justify-center">{config.icon}</div>
        <h1 className={`text-2xl font-bold ${config.color}`}>{config.title}</h1>
        <p className="text-sm text-gray-600">{config.description}</p>
        {ref && (
          <p className="text-xs text-gray-400 font-mono">Ref: {ref}</p>
        )}
        <div className="pt-4 space-y-3">
          <a
            href={`https://wa.me/6285846072435`}
            target="_blank"
            className="block w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all text-sm"
          >
            Hubungi Kami via WhatsApp
          </a>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <PaymentStatusContent />
    </Suspense>
  )
}
