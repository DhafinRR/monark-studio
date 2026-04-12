'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface OrderItem {
  id: string
  description: string
  price: string
  classification: string
}

interface InvoicePreviewProps {
  invoiceNumber: string
  date: string
  customerName: string
  customerPhone: string
  items: OrderItem[]
  totalAmount: number
  pricingPackageName?: string
  projectTitle?: string
}

export default function InvoicePreview({
  invoiceNumber,
  date,
  customerName,
  customerPhone,
  items,
  totalAmount,
  pricingPackageName,
  projectTitle
}: InvoicePreviewProps) {
  const standardItems = items.filter(i => i.classification === 'STANDARD')
  const addonItems = items.filter(i => i.classification === 'ADDON')
  const addonTotal = addonItems.reduce((sum, i) => sum + Number(i.price), 0)
  const floorPrice = standardItems.length > 0 ? totalAmount - addonTotal : totalAmount

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <Card className="bg-white border border-border/20 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b-2 border-foreground/10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground uppercase tracking-wider">
              Monark Studio
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Jakarta Selatan • hello@monarkstudio.house
            </p>
          </div>
          <div className="text-right">
            <h3 className="text-3xl font-display font-bold text-foreground tracking-tight">
              INVOICE
            </h3>
            <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest mt-2 bg-amber-50 text-amber-700">
              UNPAID
            </Badge>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="px-8 py-6 bg-primary/5 border-b border-border/10">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
              Bill To
            </h4>
            <p className="text-base font-semibold text-foreground">{customerName}</p>
            <p className="text-xs text-muted-foreground">WA: {customerPhone}</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
              Project
            </h4>
            <p className="text-sm font-medium text-foreground">{projectTitle || 'Development Project'}</p>
            {pricingPackageName && (
              <p className="text-xs text-accent font-medium">Package: {pricingPackageName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="px-8 py-6 space-y-6">
        {/* Standard Features */}
        {standardItems.length > 0 && (
          <div>
            <div className="pb-2 mb-3 border-b border-border/20">
              <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest">
                Standard Features
              </h4>
            </div>
            <div className="space-y-2">
              {standardItems.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-border/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground/50 w-5">{idx + 1}.</span>
                    <span className="text-sm font-medium text-foreground">{item.description}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground/40 italic">INCLUDED</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Addon Features */}
        {addonItems.length > 0 && (
          <div>
            <div className="flex pb-2 mb-3 border-b border-border/20 text-[10px] font-bold text-foreground uppercase tracking-widest">
              <span className="w-5">No</span>
              <span className="flex-1">Additional Features</span>
              <span className="w-28 text-right">Amount (IDR)</span>
            </div>
            <div className="space-y-2">
              {addonItems.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-border/5">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xs text-muted-foreground/50 w-5">{idx + 1}.</span>
                    <span className="text-sm font-medium text-foreground">{item.description}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground w-28 text-right">
                    {formatRupiah(Number(item.price))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="px-8 pb-6">
        <div className="flex justify-end">
          <div className="w-72 space-y-2">
            {floorPrice > 0 && (
              <div className="flex justify-between py-2 text-sm border-b border-border/10">
                <span className="text-muted-foreground uppercase font-medium">Package Price</span>
                <span className="font-semibold text-foreground">{formatRupiah(floorPrice)}</span>
              </div>
            )}
            {addonItems.length > 0 && (
              <div className="flex justify-between py-2 text-sm border-b border-border/10">
                <span className="text-muted-foreground uppercase font-medium">Addons ({addonItems.length})</span>
                <span className="font-semibold text-foreground">{formatRupiah(addonTotal)}</span>
              </div>
            )}
            <div className="flex justify-between py-3 px-5 bg-gray-900 rounded-lg">
              <span className="text-xs font-black text-white uppercase tracking-widest">Total</span>
              <span className="text-lg font-black text-white">{formatRupiah(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-gray-50 border-t border-border/10">
        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
          <span>© {new Date().getFullYear()} Monark Studio</span>
          <span>Invoice: {invoiceNumber}</span>
        </div>
      </div>
    </Card>
  )
}
