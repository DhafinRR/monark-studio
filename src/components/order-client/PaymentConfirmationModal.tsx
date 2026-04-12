'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface PaymentConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  method: string
  bankCode?: string
  amount: number
}

export default function PaymentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  method,
  bankCode,
  amount
}: PaymentConfirmationModalProps) {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val)
  }

  const getMethodLabel = () => {
    switch (method) {
      case 'va':
        return `Transfer ${bankCode || 'Bank'}`
      case 'qris':
        return 'QRIS'
      case 'ewallet':
        return bankCode || 'E-Wallet'
      default:
        return method
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Konfirmasi Metode Pembayaran
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Pastikan metode pembayaran yang Anda pilih sudah benar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/30 p-4 rounded-lg space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Metode</span>
              <span className="font-bold">{getMethodLabel()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nominal</span>
              <span className="font-bold text-accent">
                {formatRupiah(amount)}
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/70 italic text-center">
            Dengan melanjutkan, Anda akan menerima detail pembayaran yang harus ditransfer.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-accent text-white hover:bg-accent/90"
          >
            Ya, Lanjutkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
