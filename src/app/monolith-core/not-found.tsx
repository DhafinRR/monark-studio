'use client'

import Link from 'next/link'
import { Home, ArrowLeft, SearchX } from 'lucide-react'

export default function AdminNotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-500">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="relative bg-white p-10 rounded-full border border-gray-100 shadow-2xl flex items-center justify-center">
            <SearchX className="w-20 h-20 text-gray-300 stroke-[1]" />
        </div>
      </div>

      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-500 text-sm font-medium leading-relaxed">
          Maaf, rute yang Anda tuju di dalam dashboard admin tidak tersedia atau telah dipindahkan.
        </p>
      </div>

      <div className="mt-12 flex items-center gap-4">
        <Link 
          href="/admin" 
          className="px-8 py-4 bg-gray-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 flex items-center gap-2 group"
        >
          <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Ke Dashboard
        </Link>
        <button 
          onClick={() => window.history.back()}
          className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>
      </div>
      
      <div className="mt-20 opacity-20 text-[9px] font-black uppercase tracking-[0.5em] text-gray-400">
         Monark Studio House • Admin System
      </div>
    </div>
  )
}
