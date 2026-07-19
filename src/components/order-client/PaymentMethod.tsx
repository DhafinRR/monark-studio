'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Banknote, QrCode, Smartphone, Check, ChevronDown } from 'lucide-react'

interface PaymentMethodProps {
  onSelect: (method: 'va' | 'qris' | 'ewallet', bankCode?: string) => void
  onConfirm: () => void
  selectedMethod?: string
  selectedBank?: string
  isDisabled?: boolean
}

const vaBanks = [
  { id: 'BCA', name: 'BCA', color: '#003399' },
  { id: 'BNI', name: 'BNI', color: '#F15A22' },
  { id: 'BRI', name: 'BRI', color: '#00529C' },
  { id: 'MANDIRI', name: 'Mandiri', color: '#003876' },
]

const ewallets = [
  { id: 'SHOPEEPAY', name: 'ShopeePay', color: '#EE4D2D' },
  { id: 'DANA', name: 'DANA', color: '#108EE9' },
  { id: 'OVO', name: 'OVO', color: '#4C3494' },
  { id: 'LINKAJA', name: 'LinkAja', color: '#E31E24' },
  { id: 'JENIUSPAY', name: 'Jenius Pay', color: '#00A5DB' },
]

export default function PaymentMethod({ onSelect, onConfirm, selectedMethod, selectedBank, isDisabled }: PaymentMethodProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleSelect = (method: 'va' | 'qris' | 'ewallet', bankCode?: string) => {
    onSelect(method, bankCode)
  }

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
          Pilih Metode Pembayaran
        </h2>
        <p className="text-sm text-muted-foreground/70">
          Silakan pilih jalur pembayaran yang Anda kehendaki.
        </p>
      </div>

      {/* Method Options */}
      <div className="space-y-4">
        {/* Virtual Account */}
        <Card 
          className={`border-2 transition-all cursor-pointer ${
            expandedSection === 'va' 
              ? 'border-accent bg-accent/5' 
              : 'border-border/50 hover:border-accent/50'
          }`}
          onClick={() => toggleSection('va')}
        >
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Banknote className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Transfer Bank (Virtual Account)
                </h3>
                <p className="text-xs text-muted-foreground/60">
                  BCA, BNI, BRI, Mandiri
                </p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedSection === 'va' ? 'rotate-180' : ''}`} />
          </div>

          {expandedSection === 'va' && (
            <div className="px-6 pb-6 border-t border-border/50 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {vaBanks.map((bank) => (
                  <div
                    key={bank.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelect('va', bank.id)
                    }}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-3 cursor-pointer transition-all ${
                      selectedMethod === 'va' && selectedBank === bank.id
                        ? 'border-accent bg-accent/10'
                        : 'border-border/50 hover:border-accent/50'
                    }`}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${bank.color}15` }}
                    >
                      <span 
                        className="text-[10px] font-black"
                        style={{ color: bank.color }}
                      >
                        {bank.id === 'MANDIRI' ? 'MDR' : bank.id}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-foreground">{bank.name}</span>
                    {selectedMethod === 'va' && selectedBank === bank.id && (
                      <Badge className="bg-accent text-white text-[8px]">Dipilih</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* QRIS */}
        <Card 
          className={`border-2 transition-all cursor-pointer ${
            selectedMethod === 'qris'
              ? 'border-accent bg-accent/5' 
              : 'border-border/50 hover:border-accent/50'
          }`}
          onClick={() => {
            toggleSection('qris')
            handleSelect('qris')
          }}
        >
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <QrCode className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Pembayaran QR (QRIS)
                </h3>
                <p className="text-xs text-muted-foreground/60">
                  Scan QR universal — semua e-wallet & mobile banking
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedMethod === 'qris' && (
                <Badge className="bg-accent text-white text-[8px]">Dipilih</Badge>
              )}
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedSection === 'qris' ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {expandedSection === 'qris' && (
            <div className="px-6 pb-6 border-t border-border/50 pt-4">
              <div className="p-6 bg-muted/30 rounded-lg text-center space-y-3">
                <QrCode className="w-12 h-12 mx-auto text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground/60 italic">
                  Pindai satu kode QR dengan berbagai aplikasi pembayaran
                </p>
                <Badge variant="secondary" className="text-[9px] font-bold">
                  Verifikasi Instan
                </Badge>
              </div>
            </div>
          )}
        </Card>

        {/* E-Wallet */}
        <Card 
          className={`border-2 transition-all cursor-pointer ${
            expandedSection === 'ewallet' 
              ? 'border-accent bg-accent/5' 
              : 'border-border/50 hover:border-accent/50'
          }`}
          onClick={() => toggleSection('ewallet')}
        >
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Dompet Digital (E-Wallet)
                </h3>
                <p className="text-xs text-muted-foreground/60">
                  ShopeePay, DANA, OVO, LinkAja, Jenius Pay
                </p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedSection === 'ewallet' ? 'rotate-180' : ''}`} />
          </div>

          {expandedSection === 'ewallet' && (
            <div className="px-6 pb-6 border-t border-border/50 pt-4">
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {ewallets.map((ew) => (
                  <div
                    key={ew.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelect('ewallet', ew.id)
                    }}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 cursor-pointer transition-all ${
                      selectedMethod === 'ewallet' && selectedBank === ew.id
                        ? 'border-accent bg-accent/10'
                        : 'border-border/50 hover:border-accent/50'
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${ew.color}15` }}
                    >
                      <span 
                        className="text-[8px] font-black"
                        style={{ color: ew.color }}
                      >
                        {ew.id === 'SHOPEEPAY' ? 'SP' : ew.id === 'LINKAJA' ? 'LA' : ew.id === 'JENIUSPAY' ? 'JP' : ew.id.slice(0, 2)}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-foreground text-center leading-tight">{ew.name}</span>
                    {selectedMethod === 'ewallet' && selectedBank === ew.id && (
                      <Check className="w-4 h-4 text-accent" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* CTA Button */}
      <div className="pt-4">
        <button
          onClick={onConfirm}
          disabled={!selectedMethod || isDisabled}
          className={`w-full h-14 font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
            !selectedMethod || isDisabled
              ? 'bg-muted text-muted-foreground/50 cursor-not-allowed'
              : 'bg-accent text-white hover:bg-accent/90 active:scale-[0.98]'
          }`}
        >
          Konfirmasi & Bayar
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  )
}
