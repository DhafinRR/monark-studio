'use client'

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import logoImg from "@/../public/assets/logo-circle.png"

export default function ClientHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/20 shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src={logoImg.src}
              alt="Monark Studio"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-accent/20"
            />
            <span className="text-lg font-display font-bold text-foreground">
              Monark<span className="text-accent">.</span>
            </span>
          </Link>
          <div className="hidden md:block h-6 w-px bg-border/30" />
          <div className="hidden md:block">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Client Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-border/20 cursor-help transition-all hover:border-accent/30">
            <ShieldCheck className="text-green-600 text-sm" />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
              Verified Access
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
