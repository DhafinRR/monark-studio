'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // Next.js router
import Link from 'next/link'
import { 
  FileText, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  ExternalLink
} from 'lucide-react'

interface Invoice {
  id: string
  invoice_number: string
  amount: number
  status: 'unpaid' | 'paid' | 'cancelled'
  order_id: string
  issued_at: string
  order?: {
    name: string
    package_type: string
  }
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/admin/invoices')
      const data = await res.json()
      setInvoices(data)
    } finally {
      setLoading(false)
    }
  }

  const statusColors = {
    unpaid: 'bg-amber-50 text-amber-600 border border-amber-100',
    paid: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    cancelled: 'bg-red-50 text-red-600 border border-red-100'
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Invoice Management</h1>
          <p className="text-gray-500 text-sm">Monitor and track all financial billing</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Invoice Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Client & Project</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium italic">
                     Loading invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium italic">
                     No invoices issued yet.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                             <FileText className="w-5 h-5" />
                          </div>
                          <div>
                             <div className="font-black text-sm text-gray-900 tracking-tighter">{inv.invoice_number}</div>
                             <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                Issued {new Date(inv.issued_at).toLocaleDateString('en-GB')}
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="font-bold text-gray-800 text-sm">{inv.order?.name || 'Unknown Client'}</div>
                       <div className="text-[10px] text-gray-500 font-medium truncate max-w-[200px]">{inv.order?.package_type}</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${statusColors[inv.status]}`}>
                          {inv.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900 text-sm italic tracking-tight">
                       Rp {Number(inv.amount).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Link 
                         href={`/admin/invoices/${inv.id}`}
                         className="inline-flex items-center gap-2 p-2 px-4 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
                       >
                          View <ChevronRight className="w-3.5 h-3.5" />
                       </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
