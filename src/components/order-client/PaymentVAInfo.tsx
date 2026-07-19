'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, Clock, ArrowRight } from 'lucide-react'

interface PaymentVAInfoProps {
  bankCode: string
  accountNumber: string
  amount: number
  expiresAt?: string
  onChangeMethod: () => void
  onConfirm: () => void
}

export default function PaymentVAInfo({
  bankCode,
  accountNumber,
  amount,
  expiresAt,
  onChangeMethod,
  onConfirm
}: PaymentVAInfoProps) {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(accountNumber)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }

    if (copied) {
      copyToClipboard()
    }
  }, [copied, accountNumber])

  useEffect(() => {
    if (!expiresAt) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = new Date(expiresAt).getTime() - now

      if (distance < 0) {
        setTimeLeft('EXPIRED')
        clearInterval(timer)
        return
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}j ${minutes}m ${seconds}d`)
    }, 1000)

    return () => clearInterval(timer)
  }, [expiresAt])

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val)
  }

  return (
    <Card className="border-2 border-foreground/10 p-8 lg:p-12 space-y-8">
      {/* Countdown */}
      {timeLeft && timeLeft !== 'EXPIRED' && (
        <div className="flex items-center justify-center gap-2 text-orange-500 font-bold tracking-wider">
          <Clock className="w-5 h-5 animate-pulse" />
          <span>{timeLeft}</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl font-bold text-foreground">
          Penyaluran Pembayaran
        </h2>
        <p className="text-sm text-muted-foreground/70 italic">
          Selesaikan pembayaran melalui Virtual Account
        </p>
      </div>

      {/* Amount */}
      <div className="bg-muted/30 p-6 text-center space-y-2 rounded-lg">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
          Nominal yang Harus Dibayar
        </span>
        <div className="text-3xl font-display font-bold text-foreground">
          {formatRupiah(amount)}
        </div>
      </div>

      {/* VA Number */}
      <div className="flex items-center justify-between p-6 bg-accent/5 border border-accent/20 rounded-lg">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
            Nomor Virtual Account ({bankCode})
          </span>
          <div className="text-2xl font-mono font-bold tracking-wider text-foreground">
            {accountNumber}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCopied(true)}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Payment Guide */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold border-b border-border/50 pb-2">
          Panduan Pembayaran
        </h3>
        <ol className="text-xs space-y-3 text-muted-foreground/80 list-decimal pl-4 leading-relaxed">
          <li>Buka aplikasi Mobile Banking <strong>{bankCode}</strong> Anda.</li>
          <li>Pilih Menu <strong>Transfer</strong> &gt; <strong>Virtual Account</strong>.</li>
          <li>Masukkan nomor <strong>{accountNumber}</strong>.</li>
          <li>Pastikan Nama Penagih adalah <strong>Monark Studio</strong>.</li>
          <li>Selesaikan transaksi. Halaman ini akan otomatis terupdate setelah verifikasi.</li>
        </ol>
        <p className="text-[10px] text-muted-foreground/50 mt-3 italic">
          ✨ Halaman ini otomatis memperbarui status pembayaran Anda setiap 8 detik.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-4 pt-4 border-t border-border/50">
        <Button
          onClick={onConfirm}
          className="w-full h-14 bg-accent text-white font-bold tracking-wider uppercase"
        >
          Cek Status Pembayaran
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        <Button
          variant="ghost"
          onClick={onChangeMethod}
          className="w-full h-12 text-muted-foreground/60 font-medium"
        >
          Ganti Metode Pembayaran
        </Button>
      </div>
    </Card>
  )
}
