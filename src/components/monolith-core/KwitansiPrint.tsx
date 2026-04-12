'use client'

import React from 'react'
import Image from 'next/image'

interface KwitansiPrintProps {
  payment: {
    id: string
    amount: number
    payment_method?: string
    notes?: string
    paid_at?: string
    created_at: string
  }
  order: {
    id: string
    name: string
    whatsapp: string
    email?: string
    project_title?: string
    total_price?: number
  }
  kwitansiNumber?: string
}

export default function KwitansiPrint({ payment, order, kwitansiNumber }: KwitansiPrintProps) {
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const paidDate = payment.paid_at 
    ? new Date(payment.paid_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : today

  const kwNumber = kwitansiNumber || `KW-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const toWords = (num: number): string => {
    const units = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas']
    
    if (num < 12) return units[num]
    if (num < 20) return units[num - 10] + ' Belas'
    if (num < 100) return units[Math.floor(num / 10)] + ' Puluh ' + units[num % 10]
    if (num < 200) return 'Seratus ' + toWords(num - 100)
    if (num < 1000) return units[Math.floor(num / 100)] + ' Ratus ' + toWords(num % 100)
    if (num < 2000) return 'Seribu ' + toWords(num - 1000)
    if (num < 1000000) return toWords(Math.floor(num / 1000)) + ' Ribu ' + toWords(num % 1000)
    if (num < 1000000000) return toWords(Math.floor(num / 1000000)) + ' Juta ' + toWords(num % 1000000)
    return toWords(Math.floor(num / 1000000000)) + ' Milyar ' + toWords(num % 1000000000)
  }

  const amountInWords = toWords(Math.floor(payment.amount))

  return (
    <div className="bg-white w-[210mm] min-h-[297mm] flex flex-col">
      
      {/* Header */}
      <div className="px-12 pt-12 pb-8 print:px-8 print:pt-8 print:pb-4">
        <div className="flex justify-between items-start">
          {/* Logo */}
          <div className="space-y-3 print:space-y-2">
            <div className="relative w-24 h-24 print:w-16 print:h-16">
              <Image 
                src="/assets/logo.jpg" 
                alt="Monark Studio Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="space-y-0.5 text-xs text-gray-600 print:text-[9px]">
              <p className="font-bold text-gray-900 uppercase tracking-tighter">MONARK STUDIO</p>
              <p>Graha Monark, Jakarta Selatan</p>
              <p>hello@monarkstudio.house</p>
            </div>
          </div>
          
          {/* Kwitansi Info */}
          <div className="text-right">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight print:text-2xl">KWITANSI</h1>
            <p className="text-sm text-gray-500 mt-1 print:text-[10px]">No: {kwNumber}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="px-12 print:px-8">
        <div className="h-0.5 bg-gray-900" />
      </div>

      {/* Main Content */}
      <div className="px-12 py-8 flex-1 print:px-8 print:py-4">
        
        {/* Received From */}
        <div className="mb-8 print:mb-4">
          <div className="flex gap-4 items-baseline">
            <span className="text-sm font-medium text-gray-600 print:text-[10px]">Telah terima dari</span>
            <span className="text-xl font-bold text-gray-900 print:text-base">: {order.name}</span>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-6 print:mb-3">
          <div className="flex gap-4 items-baseline">
            <span className="text-sm font-medium text-gray-600 print:text-[10px]">Jumlah</span>
            <span className="text-3xl font-black text-gray-900 print:text-xl">: {formatCurrency(payment.amount)}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1 ml-24 print:text-[10px] print:ml-20">
            ({amountInWords} Rupiah)
          </p>
        </div>

        {/* For Payment */}
        <div className="mb-8 print:mb-4">
          <div className="flex gap-4 items-baseline">
            <span className="text-sm font-medium text-gray-600 print:text-[10px]">Untuk Pembayaran</span>
            <span className="text-lg font-medium text-gray-900 print:text-sm">: {order.project_title || 'Project Development'}</span>
          </div>
        </div>

        {/* Notes if any */}
        {payment.notes && (
          <div className="mb-8 print:mb-4">
            <div className="flex gap-4 items-baseline">
              <span className="text-sm font-medium text-gray-600 print:text-[10px]">Catatan</span>
              <span className="text-sm text-gray-700 print:text-[10px]">: {payment.notes}</span>
            </div>
          </div>
        )}

        {/* Date */}
        <div className="mb-12 print:mb-6">
          <div className="flex gap-4 items-baseline">
            <span className="text-sm font-medium text-gray-600 print:text-[10px]">Tanggal</span>
            <span className="text-base font-medium text-gray-900 print:text-sm">: {paidDate}</span>
          </div>
        </div>

        {/* Signature Section */}
        <div className="grid grid-cols-2 gap-8 mt-16 print:mt-8">
          <div className="text-center">
            <div className="h-24 border-b border-gray-300 print:h-16" />
            <p className="mt-2 text-sm font-medium text-gray-700 print:text-[10px]">Pemberi</p>
            <p className="text-xs text-gray-500 print:text-[9px]">{order.name}</p>
          </div>
          <div className="text-center">
            <div className="h-24 border-b border-gray-300 print:h-16" />
            <p className="mt-2 text-sm font-medium text-gray-700 print:text-[10px]">Hormat kami,</p>
            <p className="text-xs text-gray-500 print:text-[9px]">PT. Monark Studio House</p>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="px-12 py-4 border-t border-gray-200 print:px-8 print:py-2 opacity-50">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <p>© {new Date().getFullYear()} Monark Studio House</p>
          <p>{kwNumber}</p>
        </div>
      </div>

    </div>
  )
}
