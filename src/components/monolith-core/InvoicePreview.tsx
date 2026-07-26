import React from 'react'
import Image from 'next/image'

interface InvoicePreviewProps {
  client: {
    name: string
    whatsapp: string
    email?: string
    package_name: string
  }
  items: Array<{
    id: string
    description: string
    price: number
    type: string
    classification?: string
    custom_note?: string
    level?: string
    sub_level?: string
  }>
  total: number
  floorPrice?: number
  benefits?: string[]
  status?: string
}

/**
 * Professional Minimalist Invoice Design for Monark Studio
 * Colors: Deep Navy (#1A2B3C), Warm Gold (#C9A66B), Pure White (#FFFFFF), Light Gray (#F5F5F5)
 */
export default function InvoicePreview({ client, items, total, floorPrice = 0, benefits = [], status }: InvoicePreviewProps) {
  const standardItems = items.filter(i => i.classification === 'STANDARD')
  const addonItems = items.filter(i => i.classification === 'ADDON')
  const addonTotal = addonItems.reduce((sum, i) => sum + Number(i.price), 0)
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`
  const termsUrl = process.env.NEXT_PUBLIC_TERMS_URL || process.env.TERMS_URL || 'https://monarkstd.com/terms-conditions'

  return (
    <div className="bg-white min-h-[1100px] flex flex-col print:min-h-0 print:h-auto print:bg-white selection:bg-gray-100 border border-gray-200 rounded-lg shadow-sm overflow-hidden" data-invoice>
      
      {/* Header Section */}
      <div className="px-16 pt-16 pb-12 border-b border-gray-200 print:px-6 print:pt-6 print:pb-4">
        <div className="flex justify-between items-start">
          {/* Logo */}
          <div className="space-y-4 print:space-y-1">
            <div className="relative w-32 h-32 print:w-16 print:h-16">
              <Image 
                src="/assets/logo-circle.png" 
                alt="Monark Studio Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="space-y-0.5 text-sm text-gray-600 print:text-[9px]">
              <p className="font-bold text-gray-900 uppercase tracking-tighter">MONARK STUDIO</p>
              <p>Bandung</p>
              <p>hello@monarkstd.com</p>
            </div>
          </div>
          
          {/* Invoice Info */}
          <div className="text-right space-y-6 print:space-y-1">
            <div className="flex flex-col items-end gap-2 print:gap-1">
              <h1 className="text-5xl font-bold text-gray-900 tracking-tight print:text-2xl">INVOICE</h1>
              {status && (
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border print:py-0.5 print:px-2 print:text-[8px] ${
                  status === 'paid' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                    : 'bg-amber-50 text-amber-600 border-amber-200'
                }`}>
                  {status}
                </span>
              )}
            </div>
            <div className="space-y-2 text-sm print:space-y-0.5 print:text-[10px]">
              <div className="flex justify-end gap-8 print:gap-4">
                <span className="text-gray-500 font-medium">Invoice No:</span>
                <span className="font-semibold text-gray-900">{invoiceNumber}</span>
              </div>
              <div className="flex justify-end gap-8 print:gap-4">
                <span className="text-gray-500 font-medium">Date:</span>
                <span className="font-semibold text-gray-900">{today}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To Section */}
      <div className="px-16 py-12 bg-gray-50 print:px-6 print:py-3 print:bg-gray-50/80">
        <div className="grid grid-cols-2 gap-16 print:gap-6">
          <div className="space-y-3 print:space-y-0.5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider print:text-[9px]">Bill To</h3>
            <div className="space-y-1 print:space-y-0">
              <p className="text-xl font-semibold text-gray-900 print:text-sm tracking-tight">{client.name || 'Client Name'}</p>
              <p className="text-sm text-gray-600 print:text-[10px]">WA: {client.whatsapp || '-'}</p>
              {client.email && <p className="text-sm text-gray-600 print:text-[10px]">{client.email}</p>}
            </div>
          </div>
          <div className="space-y-3 print:space-y-0.5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider print:text-[9px]">Project</h3>
            <p className="text-lg font-medium text-gray-900 print:text-xs italic">{client.package_name || 'Development'}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="px-16 py-12 flex-1 print:px-6 print:py-3 space-y-10 print:space-y-3">

        {/* Benefits Section */}
        {benefits.length > 0 && (
          <div>
            <div className="pb-3 mb-4 border-b-2 border-gray-900 print:mb-1 print:pb-1">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest print:text-[9px]">Package Benefits</h3>
            </div>
            <div className="space-y-2 print:space-y-0.5">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-50 print:py-0.5">
                  <span className="text-xs text-emerald-600 font-bold print:text-[9px]">✓</span>
                  <span className="text-sm text-gray-700 print:text-[10px]">{benefit}</span>
                  <span className="ml-auto text-[10px] text-gray-400 font-medium italic print:text-[8px]">INCLUDED</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Standard Features Section */}
        {standardItems.length > 0 && (
          <div>
            <div className="pb-3 mb-4 border-b-2 border-gray-900 print:mb-1 print:pb-1">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest print:text-[9px]">Standard Features</h3>
            </div>
            <div className="space-y-3 print:space-y-0.5">
              {standardItems.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 py-2 border-b border-gray-100 print:py-0.5 print:border-gray-100">
                  <div className="col-span-1 text-sm text-gray-400 font-medium print:text-[9px]">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="col-span-8 space-y-1 print:space-y-0">
                    <p className="text-sm font-medium text-gray-900 print:text-[10px]">{item.description}</p>
                    {item.custom_note && (
                      <p className="text-[10px] text-gray-500 italic print:text-[8px] leading-relaxed">
                        Note: {item.custom_note}
                      </p>
                    )}
                  </div>
                  <div className="col-span-3 text-[10px] font-medium text-gray-400 text-right italic print:text-[8px]">
                    INCLUDED
                  </div>
                </div>
              ))}
            </div>

            {/* Floor Price Subtotal */}
            {floorPrice > 0 && (
              <div className="flex justify-end mt-4 print:mt-1">
                <div className="w-96 print:w-64">
                  <div className="flex justify-between py-3 border-t border-gray-200 print:py-1">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider print:text-[9px]">Package Price</span>
                    <span className="text-sm font-bold text-gray-900 print:text-[10px]">Rp {floorPrice.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Addon Features Section */}
        {addonItems.length > 0 && (
          <div>
            <div className="grid grid-cols-12 gap-4 pb-3 mb-4 border-b-2 border-gray-900 print:mb-1 print:pb-1">
              <div className="col-span-1 text-xs font-bold text-gray-900 uppercase tracking-widest print:text-[9px]">No</div>
              <div className="col-span-8 text-xs font-bold text-gray-900 uppercase tracking-widest print:text-[9px]">Additional Features</div>
              <div className="col-span-3 text-xs font-bold text-gray-900 uppercase tracking-widest text-right print:text-[9px]">Amount (IDR)</div>
            </div>
            <div className="space-y-3 print:space-y-0.5">
              {addonItems.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 py-3 border-b border-gray-100 print:py-0.5 print:border-gray-100">
                  <div className="col-span-1 text-sm text-gray-400 font-medium print:text-[9px]">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="col-span-8 space-y-1 print:space-y-0">
                    <p className="text-sm font-medium text-gray-900 print:text-[10px]">{item.description}</p>
                    {item.custom_note && (
                      <p className="text-[10px] text-gray-500 italic print:text-[8px] leading-relaxed">
                        Note: {item.custom_note}
                      </p>
                    )}
                    {item.level && (
                      <div className="flex gap-2 items-center opacity-70">
                        <span className="inline-flex px-1.5 py-0.5 bg-gray-100 text-[10px] text-gray-600 font-bold rounded print:text-[8px]">
                          {item.level}
                        </span>
                        {item.sub_level && (
                          <span className="text-[11px] text-gray-500 print:text-[8px]">
                            {item.sub_level}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="col-span-3 text-sm font-bold text-gray-900 text-right print:text-[10px]">
                    Rp {Number(item.price).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Totals Section */}
      <div className="px-16 pb-12 print:px-6 print:pb-2 break-inside-avoid">
        <div className="flex justify-end">
          <div className="w-96 space-y-4 print:w-64 print:space-y-0.5">
            {floorPrice > 0 && (
              <div className="flex justify-between py-3 border-b border-gray-100 print:py-0.5">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest print:text-[9px]">Package Price</span>
                <span className="text-sm font-bold text-gray-900 tracking-tight print:text-[10px]">Rp {floorPrice.toLocaleString('id-ID')}</span>
              </div>
            )}
            {addonItems.length > 0 && (
              <div className="flex justify-between py-3 border-b border-gray-100 print:py-0.5">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest print:text-[9px]">Addon ({addonItems.length} item)</span>
                <span className="text-sm font-bold text-gray-900 tracking-tight print:text-[10px]">Rp {addonTotal.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between py-3 border-b border-gray-100 print:py-0.5">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-widest print:text-[9px]">Tax (0%)</span>
              <span className="text-sm font-bold text-gray-900 tracking-tight print:text-[10px]">Rp 0</span>
            </div>
            <div className="flex justify-between py-6 bg-gray-900 px-8 -mx-8 print:py-2 print:px-4 print:-mx-4 shadow-xl print:shadow-none">
              <span className="text-xs font-black text-white uppercase tracking-[0.2em] print:text-[9px]">Total Amount</span>
              <span className="text-2xl font-black text-white print:text-base italic">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="px-16 py-12 bg-gray-50 border-t border-gray-200 print:px-6 print:py-3 print:bg-gray-50/80 break-inside-avoid">
        <div className="grid grid-cols-2 gap-16 print:gap-4">
          <div className="space-y-4 print:space-y-1">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 inline-block print:pb-0.5 print:text-[9px]">Terms &amp; Conditions</h3>
            <div className="space-y-1.5 text-xs text-gray-600 print:text-[8px] print:space-y-0.5 leading-relaxed">
              <p>• Transfer hanya ke rekening/gateway resmi di invoice ini (sertakan No. Invoice).</p>
              <p>• Pelunasan 100% wajib sebelum website ditayangkan live / source code diserahkan.</p>
              <p>• Uang Muka (DP) bersifat non-refundable jika proyek dibatalkan sepihak oleh Klien.</p>
              <p>• Keterlambatan pelunasan &gt;7 hari dari jatuh tempo berhak menangguhkan pengerjaan.</p>
              <p>
                • Pembayaran menandakan persetujuan atas{' '}
                <a
                  href={termsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold text-gray-900 hover:text-black"
                >
                  Syarat &amp; Ketentuan Monark Studio
                </a>.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-end items-end text-right">
            <p className="font-semibold text-gray-900 text-sm print:text-[9px]">Monark Studio</p>
            <p className="italic text-[11px] text-gray-400 print:text-[8px] pt-1">Reference: {invoiceNumber}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-16 py-8 border-t border-gray-200 print:px-6 print:py-2 opacity-50">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 print:text-[8px]">
          <p>© {new Date().getFullYear()} Monark Studio</p>
          <p>Thank you for your business</p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm;
          }
          html, body {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            width: 100% !important;
            height: auto !important;
            color-scheme: light !important;
          }
          header, footer, nav, aside, button, .no-print, .print\\:hidden, .print-hidden {
            display: none !important;
          }
          main, [role="main"] {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: none !important;
            background: transparent !important;
            overflow: visible !important;
          }
          [data-invoice] {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            width: 100% !important;
            max-width: 195mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            display: block !important;
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            background-color: white !important;
            color: #111827 !important;
            min-height: 0 !important;
            height: auto !important;
          }
          [data-invoice] * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          [data-invoice] button {
            display: none !important;
          }
        }
      `}</style>

    </div>
  )
}