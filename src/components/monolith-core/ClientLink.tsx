'use client'

import { useState } from 'react'
import { ExternalLink, Copy, Check } from 'lucide-react'
import Link from 'next/link'

interface ClientLinkProps {
  orderId: string
}

export default function ClientLink({ orderId }: ClientLinkProps) {
  const [copied, setCopied] = useState(false)

  const clientUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/order/${orderId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(clientUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
      <h2 className="text-sm font-black uppercase tracking-widest text-[#B8926A] flex items-center gap-2">
        <ExternalLink className="w-4 h-4" /> Client Link
      </h2>
      
      <div className="space-y-3">
        <p className="text-[10px] text-gray-500">
          Bagikan link ini kepada client untuk melihat status order dan melakukan pembayaran.
        </p>
        
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-600 break-all font-mono">
            {clientUrl}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
          
          <Link
            href={`/order/${orderId}`}
            target="_blank"
            className="px-4 py-2 bg-[#B8926A] text-white text-sm font-bold rounded-lg hover:bg-[#a07d5a] transition-all flex items-center justify-center"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
