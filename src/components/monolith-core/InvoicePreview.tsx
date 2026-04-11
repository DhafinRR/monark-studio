import React from 'react'
import Image from 'next/image'

interface InvoicePreviewProps {
  client: {
    name: string
    whatsapp: string
    email?: string
    package_type: string
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
  status?: string
}

/**
 * Professional Minimalist Invoice Design for Monark Studio
 * Colors: Deep Navy (#1A2B3C), Warm Gold (#C9A66B), Pure White (#FFFFFF), Light Gray (#F5F5F5)
 */
export default function InvoicePreview({ client, items, total, status }: InvoicePreviewProps) {
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`

  return (
    <div className="bg-white min-h-[1100px] flex flex-col print:min-h-0 print:h-auto print:bg-white selection:bg-gray-100">
      
      {/* Header Section */}
      <div className="px-16 pt-16 pb-12 border-b border-gray-200 print:px-10 print:pt-10 print:pb-6">
        <div className="flex justify-between items-start">
          {/* Logo */}
          <div className="space-y-4 print:space-y-2">
            <div className="relative w-32 h-32 print:w-20 print:h-20">
              <Image 
                src="/assets/logo.jpg" 
                alt="Monark Studio Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="space-y-0.5 text-sm text-gray-600 print:text-[10px]">
              <p className="font-bold text-gray-900 uppercase tracking-tighter">MONARK STUDIO</p>
              <p>Graha Monark, Jakarta Selatan</p>
              <p>hello@monarkstudio.house</p>
            </div>
          </div>
          
          {/* Invoice Info */}
          <div className="text-right space-y-6 print:space-y-2">
            <div className="flex flex-col items-end gap-2">
              <h1 className="text-5xl font-bold text-gray-900 tracking-tight print:text-3xl">INVOICE</h1>
              {status && (
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${
                  status === 'paid' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                    : 'bg-amber-50 text-amber-600 border-amber-200'
                }`}>
                  {status}
                </span>
              )}
            </div>
            <div className="space-y-2 text-sm print:text-xs">
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
      <div className="px-16 py-12 bg-gray-50 print:px-10 print:py-6 print:bg-gray-50/50">
        <div className="grid grid-cols-2 gap-16 print:gap-8">
          <div className="space-y-3 print:space-y-1">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider print:text-[10px]">Bill To</h3>
            <div className="space-y-1">
              <p className="text-xl font-semibold text-gray-900 print:text-lg tracking-tight">{client.name || 'Client Name'}</p>
              <p className="text-sm text-gray-600 print:text-xs">WA: {client.whatsapp || '-'}</p>
              {client.email && <p className="text-sm text-gray-600 print:text-xs">{client.email}</p>}
            </div>
          </div>
          <div className="space-y-3 print:space-y-1">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider print:text-[10px]">Project</h3>
            <p className="text-lg font-medium text-gray-900 print:text-base italic">{client.package_type || 'Development'}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="px-16 py-12 flex-1 print:px-10 print:py-6">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 pb-4 mb-6 border-b-2 border-gray-900 print:mb-3 print:pb-2">
          <div className="col-span-1 text-xs font-bold text-gray-900 uppercase tracking-widest">No</div>
          <div className="col-span-8 text-xs font-bold text-gray-900 uppercase tracking-widest">Description</div>
          <div className="col-span-3 text-xs font-bold text-gray-900 uppercase tracking-widest text-right">Amount (IDR)</div>
        </div>

        {/* Table Body */}
        <div className="space-y-6 mb-12 print:space-y-2 print:mb-6">
          {items.map((item, idx) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 py-3 border-b border-gray-100 print:py-2 print:border-gray-50">
              <div className="col-span-1 text-sm text-gray-400 font-medium print:text-[10px]">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="col-span-8 space-y-1">
                <p className="text-sm font-medium text-gray-900 print:text-xs">{item.description}</p>
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
                    <span className="text-[11px] text-gray-500 print:text-[9px]">
                      {item.sub_level}
                    </span>
                  </div>
                )}
              </div>
              <div className="col-span-3 text-sm font-bold text-gray-900 text-right print:text-xs italic">
                {item.price > 0 
                  ? `Rp ${Number(item.price).toLocaleString('id-ID')}` 
                  : item.classification === 'STANDARD' ? 'INCLUDED' : '–'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals Section */}
      <div className="px-16 pb-12 print:px-10 print:pb-4 break-inside-avoid">
        <div className="flex justify-end">
          <div className="w-96 space-y-4 print:w-72 print:space-y-1">
            <div className="flex justify-between py-3 border-b border-gray-100 print:py-1.5">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Subtotal</span>
              <span className="text-sm font-bold text-gray-900 tracking-tight">Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100 print:py-1.5">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Tax (0%)</span>
              <span className="text-sm font-bold text-gray-900 tracking-tight">Rp 0</span>
            </div>
            <div className="flex justify-between py-6 bg-gray-900 px-8 -mx-8 print:py-3 print:px-6 print:-mx-6 shadow-xl print:shadow-none">
              <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Total Amount</span>
              <span className="text-2xl font-black text-white print:text-xl italic">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="px-16 py-12 bg-gray-50 border-t border-gray-200 print:px-10 print:py-6 print:bg-gray-50/50 break-inside-avoid">
        <div className="grid grid-cols-2 gap-16 print:gap-8">
          <div className="space-y-4 print:space-y-2">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 inline-block">Payment</h3>
            <div className="space-y-1 text-sm text-gray-600 print:text-[10px] leading-relaxed">
              <p className="font-black text-blue-600">BCA / Bank Central Asia</p>
              <p className="font-mono">Acc: 123 4567 890</p>
              <p className="font-medium">PT. Monark Studio House</p>
              <p className="pt-2 italic text-[11px] text-gray-400">Reference: INV-{new Date().getFullYear()}-XXXX</p>
            </div>
          </div>
          <div className="space-y-4 print:space-y-2">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 inline-block">Terms</h3>
            <div className="space-y-1 text-sm text-gray-600 print:text-[10px] leading-relaxed">
              <p>• Due within 14 days of issue</p>
              <p>• Prices include support & maintenance</p>
              <p>• Late payments may affect timelines</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-16 py-8 border-t border-gray-200 print:px-10 print:py-4 opacity-50">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <p>© {new Date().getFullYear()} Monark Studio house</p>
          <p>Thank you for your business</p>
        </div>
      </div>

    </div>
  )
}