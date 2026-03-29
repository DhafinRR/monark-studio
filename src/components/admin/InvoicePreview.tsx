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
    level?: string
    sub_level?: string
  }>
  total: number
}

/**
 * Professional Minimalist Invoice Design for Monark Studio
 * Colors: Deep Navy (#1A2B3C), Warm Gold (#C9A66B), Pure White (#FFFFFF), Light Gray (#F5F5F5)
 */
export default function InvoicePreview({ client, items, total }: InvoicePreviewProps) {
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`

  return (
    <div className="bg-white min-h-[1100px] flex flex-col">
      
      {/* Header Section */}
      <div className="px-16 pt-16 pb-12 border-b border-gray-200">
        <div className="flex justify-between items-start">
          {/* Logo */}
          <div className="space-y-4">
            <div className="relative w-32 h-32">
              <Image 
                src="/assets/logo.jpg" 
                alt="Monark Studio Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="space-y-0.5 text-sm text-gray-600">
              <p className="font-medium text-gray-900">MONARK STUDIO</p>
              <p>Graha Monark, Jakarta Selatan</p>
              <p>hello@monarkstudio.house</p>
              <p>monarkstudio.house</p>
            </div>
          </div>
          
          {/* Invoice Info */}
          <div className="text-right space-y-6">
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight">INVOICE</h1>
            <div className="space-y-2 text-sm">
              <div className="flex justify-end gap-8">
                <span className="text-gray-500 font-medium">Invoice No:</span>
                <span className="font-semibold text-gray-900">{invoiceNumber}</span>
              </div>
              <div className="flex justify-end gap-8">
                <span className="text-gray-500 font-medium">Date:</span>
                <span className="font-semibold text-gray-900">{today}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To Section */}
      <div className="px-16 py-12 bg-gray-50">
        <div className="grid grid-cols-2 gap-16">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bill To</h3>
            <div className="space-y-1">
              <p className="text-xl font-semibold text-gray-900">{client.name || 'Client Name'}</p>
              <p className="text-sm text-gray-600">WhatsApp: {client.whatsapp || '-'}</p>
              {client.email && <p className="text-sm text-gray-600">{client.email}</p>}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Project</h3>
            <p className="text-lg font-medium text-gray-900">{client.package_type || 'Custom Project Development'}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="px-16 py-12 flex-1">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 pb-4 mb-6 border-b-2 border-gray-900">
          <div className="col-span-1 text-xs font-bold text-gray-900 uppercase tracking-wider">No</div>
          <div className="col-span-8 text-xs font-bold text-gray-900 uppercase tracking-wider">Description</div>
          <div className="col-span-3 text-xs font-bold text-gray-900 uppercase tracking-wider text-right">Amount (IDR)</div>
        </div>

        {/* Table Body */}
        <div className="space-y-6 mb-12">
          {items.map((item, idx) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="col-span-1 text-sm text-gray-500 font-medium">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="col-span-8 space-y-1">
                <p className="text-sm font-medium text-gray-900">{item.description || 'Feature Description'}</p>
                {item.level && (
                  <div className="flex gap-2 items-center">
                    <span className="inline-flex px-2 py-0.5 bg-gray-100 text-xs text-gray-700 font-medium rounded">
                      {item.level}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.sub_level} Complexity
                    </span>
                  </div>
                )}
              </div>
              <div className="col-span-3 text-sm font-semibold text-gray-900 text-right">
                {item.price > 0 ? `Rp ${Number(item.price).toLocaleString('id-ID')}` : '–'}
              </div>
            </div>
          ))}
          
          {items.length === 0 && (
            <div className="py-24 text-center text-gray-400">
              <p className="text-sm">No items added yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Totals Section */}
      <div className="px-16 pb-12">
        <div className="flex justify-end">
          <div className="w-96 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">Subtotal</span>
              <span className="text-sm font-semibold text-gray-900">Rp {total.toLocaleString('id-ID')}</span>
            </div>
            
            {/* Tax */}
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">Tax (0%)</span>
              <span className="text-sm font-semibold text-gray-900">Rp 0</span>
            </div>
            
            {/* Total */}
            <div className="flex justify-between py-6 bg-gray-900 px-8 -mx-8">
              <span className="text-sm font-bold text-white uppercase tracking-wider">Total Amount</span>
              <span className="text-2xl font-bold text-white">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="px-16 py-12 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-16">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Payment Instructions</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-900">Bank Central Asia (BCA)</p>
              <p>Account Number: 123 4567 890</p>
              <p>Account Name: PT. Monark Studio House</p>
              <p className="pt-2 text-xs text-gray-500">Please include invoice number <span className="font-semibold text-gray-900">{invoiceNumber}</span> in your transfer description</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Terms & Conditions</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Payment due within 14 days</p>
              <p>Late payments may incur additional charges</p>
              <p>All prices in Indonesian Rupiah (IDR)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-16 py-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Monark Studio. All rights reserved.</p>
          </div>
          <div className="text-xs text-gray-500 text-right">
            <p>Thank you for your business</p>
          </div>
        </div>
      </div>

    </div>
  )
}