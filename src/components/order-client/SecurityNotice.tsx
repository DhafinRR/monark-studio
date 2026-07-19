'use client'

import { ShieldCheck } from 'lucide-react'

export default function SecurityNotice() {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl space-y-4 shadow-xl">
      <div className="flex items-center gap-2 text-white/50">
        <ShieldCheck size={16} />
        <span className="text-[11px] font-black uppercase tracking-widest">
          Keamanan Terjamin
        </span>
      </div>
      <p className="text-[10px] leading-relaxed text-white/60 italic">
        Seluruh transaksi dilakukan melalui gateway perbankan resmi yang terenkripsi. 
        Hindari membagikan bukti bayar kepada pihak ketiga.
      </p>
    </div>
  )
}
