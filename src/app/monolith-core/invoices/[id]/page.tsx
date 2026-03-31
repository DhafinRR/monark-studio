'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Printer, 
  MessageCircle, 
  Download, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react'
import InvoicePreview from '@/components/monolith-core/InvoicePreview'

interface OrderItem {
  id: string
  description: string
  price: number
  type: string
  level?: string
  sub_level?: string
}

interface Invoice {
  id: string
  invoice_number: string
  amount: number
  status: 'unpaid' | 'paid' | 'cancelled'
  issued_at: string
  order: {
    name: string
    whatsapp: string
    email?: string
    package_type: string
    items: OrderItem[]
  }
}

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoice()
  }, [id])

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/monolith-core/invoices/${id}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setInvoice(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleWhatsApp = () => {
    if (!invoice) return
    const text = `Halo ${invoice.order.name}, berikut adalah invoice resmi untuk proyek ${invoice.order.package_type}: ${window.location.origin}/public/invoices/${invoice.id}`
    window.open(`https://wa.me/${invoice.order.whatsapp}?text=${encodeURIComponent(text)}`, '_blank')
  }

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  )

  if (!invoice) return <div>Invoice tidak ditemukan.</div>

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 print:p-0 print:max-w-none print:bg-white print:m-0 print:space-y-0">
      {/* Global CSS for Printing A4 */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Ensure no extra pages from hidden elements */
          header, aside, .print-hidden {
             display: none !important;
          }
        }
      `}</style>

      {/* Header Actions - hidden on print */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/monolith-core/invoices" className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
            <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{invoice.invoice_number}</h1>
            <div className="flex items-center gap-2 mt-1">
               <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                 invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
               }`}>
                  {invoice.status}
               </span>
               <span className="text-gray-400 text-xs">• Issued {new Date(invoice.issued_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={handleWhatsApp}
             className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all flex items-center shadow-lg shadow-emerald-900/10 text-sm"
           >
             <MessageCircle className="w-4 h-4 mr-2" /> Share WhatsApp
           </button>
           <button 
             onClick={handlePrint}
             className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center shadow-lg shadow-gray-900/10 text-sm"
           >
             <Printer className="w-4 h-4 mr-2" /> Print PDF
           </button>
        </div>
      </div>

      {/* Actual Invoice Rendering */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none print:w-[210mm] print:mx-auto print:block print:min-h-0">
         <InvoicePreview 
           client={{
             name: invoice.order.name,
             whatsapp: invoice.order.whatsapp,
             email: invoice.order.email,
             package_type: invoice.order.package_type
           }}
           items={invoice.order.items}
           total={Number(invoice.amount)}
           status={invoice.status}
         />
      </div>

      {/* Bottom Legal - hidden on print */}
      <div className="text-center space-y-2 opacity-30 mt-10 print:hidden">
         <p className="text-[10px] font-black uppercase tracking-[0.6em]">Authorized by Monark Studio Finance</p>
         <p className="text-[9px] font-bold">This is a system generated document</p>
      </div>
    </div>
  )
}
