'use client'

import React from 'react'
import Image from 'next/image'

interface InvoicePrintProps {
  order: {
    id: string
    name: string
    whatsapp: string
    email?: string
    details?: string
    project_title?: string
    total_price?: number
    items: Array<{
      id: string
      description: string
      price: number
      classification: string
      custom_note?: string
      level?: string
      sub_level?: string
    }>
    pricing_package?: {
      name: string
      benefits?: string[]
    } | null
  }
  invoiceNumber?: string
  date?: string
}

export default function InvoicePrint({ order, invoiceNumber, date }: InvoicePrintProps) {
  const standardItems = order.items.filter(i => i.classification === 'STANDARD')
  const addonItems = order.items.filter(i => i.classification === 'ADDON')
  const addonTotal = addonItems.reduce((sum, i) => sum + Number(i.price), 0)
  const floorPrice = (order.pricing_package?.benefits && order.pricing_package.benefits.length > 0) ? Number(order.total_price || 0) - addonTotal : 0

  const today = date || new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const invNumber = invoiceNumber || `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`

  return (
    <div className="bg-white w-[210mm] min-h-[297mm] flex flex-col selection:bg-gray-100">
      
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 px-10 pt-10 pb-6 border-b-2 border-gray-900">
        <div className="flex justify-between items-start">
          {/* Logo */}
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20">
              <Image 
                src="/assets/logo.jpg" 
                alt="Monark Studio Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-bold text-gray-900 uppercase tracking-wider">MONARK STUDIO</p>
              <p className="text-xs">Graha Monark, Jakarta Selatan</p>
              <p className="text-xs">hello@monarkstudio.house</p>
            </div>
          </div>
          
          {/* Invoice Info */}
          <div className="text-right space-y-3">
            <div className="flex flex-col items-end gap-2">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">INVOICE</h1>
              <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-200">
                UNPAID
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500 font-medium">Invoice No:</span> <span className="font-semibold text-gray-900">{invNumber}</span></p>
              <p><span className="text-gray-500 font-medium">Date:</span> <span className="font-semibold text-gray-900">{today}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To & Project - Fixed below header */}
      <div className="flex-shrink-0 px-10 py-6 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
            <p className="text-xl font-semibold text-gray-900">{order.name || 'Client Name'}</p>
            <p className="text-sm text-gray-600">WA: {order.whatsapp || '-'}</p>
            {order.email && <p className="text-sm text-gray-600">{order.email}</p>}
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Project</h3>
            <p className="text-lg font-medium text-gray-900">{order.project_title || 'Development Project'}</p>
            {order.pricing_package?.name && (
              <p className="text-sm text-[#B8926A] font-medium">Package: {order.pricing_package.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Middle Content - Only takes needed space */}
      <div className="px-10 py-5 space-y-4">

        {/* Standard Features Section */}
        {standardItems.length > 0 && (
          <div>
            <div className="pb-2 mb-2 border-b border-gray-200">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Standard Features</h3>
            </div>
            <div className="space-y-1">
              {standardItems.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 font-medium w-6">{idx + 1}.</span>
                    <p className="text-sm font-medium text-gray-800">{item.description}</p>
                  </div>
                  <span className="text-xs text-gray-400 italic">INCLUDED</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Addon Features Section */}
        {addonItems.length > 0 && (
          <div>
            <div className="flex pb-2 mb-2 border-b border-gray-200">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-widest w-8">No</span>
              <span className="text-xs font-bold text-gray-900 uppercase tracking-widest flex-1">Additional Features</span>
              <span className="text-xs font-bold text-gray-900 uppercase tracking-widest text-right w-36">Amount (IDR)</span>
            </div>
            <div className="space-y-1">
              {addonItems.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-sm text-gray-400 font-medium w-6">{idx + 1}.</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.description}</p>
                      {item.level && (
                        <span className="inline-flex px-2 py-0.5 bg-gray-100 text-xs text-gray-500 font-medium rounded">
                          {item.level} {item.sub_level}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-36 text-right">
                    Rp {Number(item.price).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Totals Section */}
        <div className="flex justify-end mt-4">
          <div className="w-80 space-y-1">
            {floorPrice > 0 && (
              <div className="flex justify-between py-1.5 text-sm border-b border-gray-100">
                <span className="text-gray-500 uppercase font-medium">Package Price</span>
                <span className="font-bold text-gray-900">Rp {floorPrice.toLocaleString('id-ID')}</span>
              </div>
            )}
            {addonItems.length > 0 && (
              <div className="flex justify-between py-1.5 text-sm border-b border-gray-100">
                <span className="text-gray-500 uppercase font-medium">Addon ({addonItems.length} item)</span>
                <span className="font-bold text-gray-900">Rp {addonTotal.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between py-2 px-5 bg-gray-900">
              <span className="text-xs font-black text-white uppercase tracking-widest">Total Amount</span>
              <span className="text-lg font-black text-white">Rp {Number(order.total_price || 0).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="flex-shrink-0 px-10 py-5 bg-gray-50 border-t-2 border-gray-900">
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 inline-block">Payment</h3>
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p className="font-black text-blue-600">BCA / Bank Central Asia</p>
              <p className="font-mono">Acc: 123 4567 890</p>
              <p className="font-medium">PT. Monark Studio House</p>
              <p className="italic text-gray-400 text-xs">Reference: {invNumber}</p>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 inline-block">Terms</h3>
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p>• Due within 14 days of issue</p>
              <p>• Prices include support & maintenance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="flex-shrink-0 px-10 py-3 border-t border-gray-200">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400">
          <p>© {new Date().getFullYear()} Monark Studio House</p>
          <p>Thank you for your business</p>
        </div>
      </div>

    </div>
  )
}
