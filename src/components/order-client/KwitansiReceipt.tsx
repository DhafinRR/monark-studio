'use client'

import { Printer } from 'lucide-react'

interface KwitansiReceiptProps {
  paymentId: string
  amount: number
  customerName: string
  projectTitle?: string
  paidAt?: string
  paymentMethod?: string
}

export default function KwitansiReceipt({
  paymentId,
  amount,
  customerName,
  projectTitle,
  paidAt,
  paymentMethod
}: KwitansiReceiptProps) {
  const kwNumber = `KW-${new Date().getFullYear()}-${paymentId.slice(0, 4).toUpperCase()}`

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val)
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateEN = (dateStr?: string) => {
    if (!dateStr) return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
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

  const amountInWords = toWords(Math.floor(amount))

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="w-full flex justify-center" data-kwitansi>
      {/* A5 Sized - Bilingual Design */}
      <div className="w-[148mm] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300">
        
        {/* Header Bilingual */}
        <div className="bg-gray-900 text-white px-5 py-4 text-center">
          <h1 className="text-sm font-bold uppercase tracking-wider">Kwitansi Pembayaran</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Payment Receipt</p>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          
          {/* Field: No. Kwitansi */}
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-600">
              No. Kwitansi / Receipt No.
            </span>
            <span className="font-mono font-bold text-gray-900">{kwNumber}</span>
          </div>

          {/* Field: Tanggal */}
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-600">
              Tanggal / Date
            </span>
            <span className="font-medium text-gray-900">{formatDate(paidAt)}</span>
          </div>

          {/* Field: Metode */}
          <div className="flex justify-between text-xs mb-4">
            <span className="text-gray-600">
              Metode / Method
            </span>
            <span className="font-medium text-gray-900">{paymentMethod || 'Transfer Bank'}</span>
          </div>

          {/* Field: Telah terima dari */}
          <div className="mb-4">
            <span className="text-[10px] text-gray-600 uppercase">
              Telah terima dari / Received from
            </span>
            <div className="mt-1">
              <p className="text-sm font-bold text-gray-900 border-b border-gray-400 pb-1">
                {customerName}
              </p>
            </div>
          </div>

          {/* Field: Jumlah */}
          <div className="mb-2">
            <span className="text-[10px] text-gray-600 uppercase">
              Jumlah / Amount
            </span>
            <div className="mt-1 bg-gray-50 p-2 rounded border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-accent">{formatRupiah(amount)}</span>
                <span className="text-[10px] text-gray-500">IDR</span>
              </div>
            </div>
          </div>

          {/* Field: Terbilang */}
          <div className="mb-4">
            <span className="text-[10px] text-gray-600 uppercase">
              Terbilang / In Words
            </span>
            <div className="mt-1">
              <p className="text-xs text-gray-700 italic border-b border-gray-300 pb-1">
                ({amountInWords} Rupiah)
              </p>
            </div>
          </div>

          {/* Field: Untuk pembayaran */}
          <div className="mb-4">
            <span className="text-[10px] text-gray-600 uppercase">
              Untuk pembayaran / For payment
            </span>
            <div className="mt-1">
              <p className="text-sm font-medium text-gray-900 border-b border-gray-300 pb-1">
                {projectTitle || 'Pembayaran Project Development'}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dashed border-gray-400 my-4" />

          {/* Signature - PT Monark Only (Bilingual) */}
          <div className="flex flex-col items-center">
            <p className="text-[10px] text-gray-600 uppercase mb-2">
              Jakarta, {formatDate(paidAt)}
            </p>
            
            <div className="w-36 text-center">
              <div className="h-12 border-b-2 border-gray-400 mb-1" />
              <p className="text-[10px] text-gray-600 uppercase">
                Hormat kami, / Yours truly,
              </p>
              <p className="text-xs font-bold text-gray-900 mt-2">Monark Studio</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-5 py-2 border-t border-gray-200 text-center">
          <p className="text-[9px] text-gray-500">
            {kwNumber} • Monark Studio • Bandung
          </p>
        </div>

        {/* Print Button */}
        <div className="px-5 py-3 border-t border-gray-200">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 w-full py-2 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-gray-800 transition-colors"
          >
            <Printer className="w-3 h-3" />
            Cetak Kwitansi
          </button>
        </div>

      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A5 portrait;
            margin: 0;
          }
          html, body {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            width: 100% !important;
            height: auto !important;
          }
          header, footer, nav, aside, button, .no-print, .print\\:hidden, .print-hidden {
            display: none !important;
          }
          main, div, section, article {
            overflow: visible !important;
            max-height: none !important;
            height: auto !important;
            box-shadow: none !important;
            background: transparent !important;
          }
          [data-kwitansi] {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            width: 148mm !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
            display: block !important;
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
          }
          [data-kwitansi] button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
