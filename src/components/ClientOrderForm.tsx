'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Trash2,
  ArrowLeft,
  Sparkles,
  Loader2,
  Save,
  ShoppingBag,
  User,
  Eye,
  X,
  CheckCircle,
  Package,
  Layers,
  Link as LinkIcon,
  ExternalLink,
  FileText
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Link from 'next/link'
import InvoicePreview from '@/components/monolith-core/InvoicePreview'
import { PRICING_PACKAGES } from '@/config/pricing'

interface Feature {
  id: string
  name: string
  price: string
}

interface StandardItem {
  id: string
  description: string
  custom_note?: string
}

interface OrderItem {
  id: string
  type: 'CATALOG' | 'CUSTOM'
  classification: 'STANDARD' | 'ADDON'
  description: string
  price: number
  level?: string
  sub_level?: string
  feature_id?: string
  reason?: string
  custom_note?: string
  isAnalyzing?: boolean
}

interface ClientData {
  project_title: string
  name: string
  whatsapp: string
  email: string
  package_id: string
  details: string
  asset_link: string
  preview_link: string
}

interface DBPackage {
  id: string
  name: string
  floor_price: string
  max_slots: number
  benefits: string[]
  default_features: string[]
  is_popular: boolean
}

interface ClientOrderFormProps {
  isPublic?: boolean
  orderId?: string
  initialData?: Partial<ClientData>
  initialStandardItems?: { description: string }[]
  initialAddonItems?: OrderItem[]
  initialBenefits?: string[]
}

export default function ClientOrderForm({ isPublic = false, orderId, initialData, initialStandardItems, initialAddonItems, initialBenefits }: ClientOrderFormProps) {
  const isEditMode = !!orderId
  const router = useRouter()
  const [catalog, setCatalog] = useState<Feature[]>([])
  const [complexityPrices, setComplexityPrices] = useState<any[]>([])
  const [client, setClient] = useState<ClientData>({
    project_title: initialData?.project_title || '',
    name: initialData?.name || '',
    whatsapp: initialData?.whatsapp || '',
    email: initialData?.email || '',
    package_id: initialData?.package_id || (isPublic ? '' : ''),
    details: initialData?.details || '',
    asset_link: '',
    preview_link: ''
  })

  const [standardItems, setStandardItems] = useState<StandardItem[]>([])
  const [addonItems, setAddonItems] = useState<OrderItem[]>([])
  const [hasAppliedInitial, setHasAppliedInitial] = useState(false)

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!orderId)
  const [showPreview, setShowPreview] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [dbPackages, setDbPackages] = useState<DBPackage[]>([])
  const [benefits, setBenefits] = useState<string[]>(initialBenefits || [])

  const apiPath = isPublic ? '/api/public' : '/api/monolith-core';

  // Fetch catalog, complexity prices, and packages
  useEffect(() => {
    fetch(`${apiPath}/features`).then(res => res.json()).then(data => setCatalog(Array.isArray(data) ? data : []))
    fetch(`${apiPath}/complexity-price`).then(res => res.json()).then(data => setComplexityPrices(Array.isArray(data) ? data : []))
    fetch('/api/public/pricing-packages').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setDbPackages(data)
    })
  }, [apiPath])

  // Fetch existing order data for edit mode
  useEffect(() => {
    if (!orderId) return
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/monolith-core/orders/${orderId}`)
        const order = await res.json()

        setClient({
          project_title: order.project_title || '',
          name: order.name,
          whatsapp: order.whatsapp,
          email: order.email || '',
          package_id: order.package_id || '',
          details: order.details || '',
          asset_link: order.asset_link || '',
          preview_link: order.preview_link || ''
        })

        // Separate items by classification
        const stdItems = (order.items || []).filter((i: any) => i.classification === 'STANDARD')
        const addItems = (order.items || []).filter((i: any) => i.classification === 'ADDON')

        setStandardItems(stdItems.map((item: any) => ({
          id: item.id,
          description: item.description,
          custom_note: item.custom_note || ''
        })))

        setAddonItems(addItems.map((item: any) => ({
          id: item.id,
          type: item.type || 'CUSTOM',
          classification: 'ADDON' as const,
          description: item.description,
          price: Number(item.price),
          level: item.level,
          sub_level: item.sub_level,
          feature_id: item.feature_id,
          reason: item.reason,
          custom_note: item.custom_note || '',
          isAnalyzing: false
        })))

        // Set benefits from pricing_package
        if (order.pricing_package?.benefits) {
          setBenefits(order.pricing_package.benefits)
        }

        setHasAppliedInitial(true)
      } catch (error) {
        console.error("Failed to load order for editing", error)
      } finally {
        setInitialLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  // Apply initial AI data once when dbPackages are loaded
  useEffect(() => {
    if (hasAppliedInitial || dbPackages.length === 0 || !client.package_id) return
    setHasAppliedInitial(true)

    const selectedPkg = dbPackages.find(p => p.id === client.package_id)
    if (!selectedPkg) return

    setBenefits(selectedPkg.benefits || [])
    const maxSlots = selectedPkg.max_slots

    // Standard items: use AI data if available, else default features
    if (initialStandardItems && initialStandardItems.length > 0) {
      setStandardItems(Array.from({ length: maxSlots }, (_, i) => ({
        id: crypto.randomUUID(),
        description: initialStandardItems[i]?.description || ''
      })))
    } else {
      setStandardItems(Array.from({ length: maxSlots }, (_, i) => ({
        id: crypto.randomUUID(),
        description: selectedPkg.default_features[i] || ''
      })))
    }

    // Addon items: use AI data if available
    if (initialAddonItems && initialAddonItems.length > 0) {
      console.log("Applying initial addon items:", initialAddonItems)
      setAddonItems(initialAddonItems)
    }
  }, [dbPackages, client.package_id, hasAppliedInitial])

  // When user manually changes package (after initial load), reset items
  const [prevPackageType, setPrevPackageType] = useState(client.package_id)
  useEffect(() => {
    if (client.package_id === prevPackageType) return
    setPrevPackageType(client.package_id)

    // Skip if initial data hasn't been applied yet
    if (!hasAppliedInitial || dbPackages.length === 0) return

    const selectedPkg = dbPackages.find(p => p.id === client.package_id)
    if (!selectedPkg) return

    setBenefits(selectedPkg.benefits || [])
    const maxSlots = selectedPkg.max_slots
    setStandardItems(Array.from({ length: maxSlots }, (_, i) => ({
      id: crypto.randomUUID(),
      description: selectedPkg.default_features[i] || ''
    })))
    setAddonItems([])
  }, [client.package_id, dbPackages, hasAppliedInitial, prevPackageType]);

  // AI auto-analysis for CUSTOM addon items
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    addonItems.forEach((item, index) => {
      if (item.type === 'CUSTOM' && item.description.length > 5 && !item.level && !item.isAnalyzing && !item.reason) {
        const timer = setTimeout(() => {
          analyzeAddonItem(index)
        }, 3000)
        timers.push(timer)
      }
    })
    return () => timers.forEach(clearTimeout)
  }, [addonItems])

  const analyzeAddonItem = async (index: number) => {
    const item = addonItems[index]
    if (!item.description) return
    updateAddonItem(index, { isAnalyzing: true })
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: item.description, action: 'ANALYZE_ITEM' })
      })
      const data = await res.json()
      if (data.level) {
        const priceObj = complexityPrices.find(p => p.level === data.level && p.sub_level === data.sub_level)
        updateAddonItem(index, {
          level: data.level,
          sub_level: data.sub_level,
          price: priceObj ? Number(priceObj.price) : Number(data.price),
          reason: data.reason,
          isAnalyzing: false
        })
      }
    } catch (error) {
      updateAddonItem(index, { isAnalyzing: false })
    }
  }

  // Standard item helpers
  const updateStandardItem = (index: number, updates: Partial<StandardItem>) => {
    const newItems = [...standardItems]
    newItems[index] = { ...newItems[index], ...updates }
    setStandardItems(newItems)
  }

  // Addon item helpers
  const addAddonItem = () => {
    setAddonItems([...addonItems, { id: crypto.randomUUID(), type: 'CUSTOM', classification: 'ADDON', description: '', price: 0 }])
  }

  const removeAddonItem = (id: string) => {
    setAddonItems(addonItems.filter(i => i.id !== id))
  }

  const updateAddonItem = (index: number, updates: Partial<OrderItem>) => {
    const newItems = [...addonItems]
    newItems[index] = { ...newItems[index], ...updates }
    setAddonItems(newItems)
  }

  const handleComplexityChange = (index: number, field: 'level' | 'sub_level', value: string) => {
    const item = addonItems[index]
    const nextLevel = field === 'level' ? value : (item.level || 'MUDAH')
    const nextSub = field === 'sub_level' ? value : (item.sub_level || 'MINOR')

    const priceObj = complexityPrices.find(p => p.level === nextLevel && p.sub_level === nextSub)
    updateAddonItem(index, {
      [field]: value,
      price: priceObj ? Number(priceObj.price) : item.price
    })
  }

  const handleCatalogSelect = (index: number, featureId: string) => {
    const feature = catalog.find(f => f.id === featureId)
    if (feature) {
      updateAddonItem(index, {
        feature_id: featureId,
        description: feature.name,
        price: Number(feature.price)
      })
    }
  }

  // Pricing
  const selectedPkg = dbPackages.find(p => p.id === client.package_id)
  const basePrice = Number(selectedPkg?.floor_price) || 0
  const addonTotal = addonItems.reduce((sum, item) => sum + item.price, 0)
  const grandTotal = basePrice + addonTotal

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    // Validate client identity
    const missing: string[] = []
    if (!client.project_title.trim()) missing.push('Judul Proyek')
    if (!client.name.trim()) missing.push('Nama')
    if (!client.whatsapp.trim()) missing.push('WhatsApp')
    if (!client.email.trim()) missing.push('Email')
    if (!client.package_id) missing.push('Paket')

    if (missing.length > 0) {
      toast.error(`Mohon lengkapi data berikut: ${missing.join(', ')}`)
      return
    }

    setLoading(true)

    // Combine standard + addon items for submission
    const allItems: OrderItem[] = [
      // Standard items (price=0, included in base)
      ...standardItems.filter(s => s.description.trim()).map(s => ({
        id: s.id,
        type: 'CATALOG' as const,
        classification: 'STANDARD' as const,
        description: s.description,
        price: 0,
        custom_note: s.custom_note || ''
      })),
      // Addon items
      ...addonItems
    ]

    try {
      const url = isEditMode ? `${apiPath}/orders/${orderId}` : `${apiPath}/orders`
      const method = isEditMode ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...client, items: allItems })
      })
      if (res.ok) {
        if (isEditMode) {
          toast.success('Pesanan berhasil diperbarui!')
          router.push(`/monolith-core/orders/${orderId}`)
        } else if (isPublic) {
          setSubmitted(true)
          if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          toast.success('Pesanan berhasil dibuat!')
          router.push('/monolith-core/orders')
        }
      } else {
        const d = await res.json().catch(() => ({}))
        setErrorMsg(d.error || (isEditMode ? 'Gagal memperbarui pesanan.' : 'Gagal membuat pesanan.'))
      }
    } catch (err) {
      setErrorMsg(isEditMode ? 'Gagal memperbarui pesanan. Cek koneksi.' : 'Gagal membuat pesanan. Cek koneksi.')
    } finally {
      setLoading(false)
    }
  }

  // For InvoicePreview compatibility
  const allItemsForPreview: OrderItem[] = [
    ...standardItems.filter(s => s.description.trim()).map(s => ({
      id: s.id, type: 'CATALOG' as const, classification: 'STANDARD' as const, description: s.description, price: 0, custom_note: s.custom_note || ''
    })),
    ...addonItems
  ]

  if (initialLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className={`mx-auto space-y-8 animate-in fade-in duration-500 ${isPublic ? 'w-full' : 'max-w-5xl pb-20 p-4'}`}>
      {!isPublic && (
        <div className="flex items-center gap-4">
          <Link href={isEditMode ? `/monolith-core/orders/${orderId}` : '/monolith-core/orders'} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Pesanan' : 'Buat Pesanan'}</h1>
          <div className="flex-1" />
          <button onClick={() => setShowPreview(true)} className="px-4 py-2 border rounded-lg text-sm font-bold bg-white">
            <Eye className="w-4 h-4 inline mr-2" /> Preview
          </button>
        </div>
      )}

      {isPublic && submitted && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <CheckCircle className="inline mr-2" /> Penawaran terkirim!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── Section: Informasi Klien ── */}
        <section className="p-6 rounded-2xl border shadow-sm space-y-6 bg-white">
          <div className="flex items-center gap-2 border-b pb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold uppercase tracking-widest text-sm">Informasi Klien</h2>
          </div>
          <div className="space-y-6">
            <input className="w-full px-4 py-3 rounded-xl border" placeholder="Judul Proyek, misal: Website Portfolio" value={client.project_title} onChange={e => setClient({...client, project_title: e.target.value})} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input className="w-full px-4 py-3 rounded-xl border" placeholder="Nama" value={client.name} onChange={e => setClient({...client, name: e.target.value})} />
              <input className="w-full px-4 py-3 rounded-xl border" placeholder="WhatsApp" value={client.whatsapp} onChange={e => setClient({...client, whatsapp: e.target.value})} />
              <input className="w-full px-4 py-3 rounded-xl border" placeholder="Email" value={client.email} onChange={e => setClient({...client, email: e.target.value})} />
              <select className="w-full px-4 py-3 rounded-xl border" value={client.package_id} onChange={e => setClient({...client, package_id: e.target.value})}>
              <option value="">-- Pilih Paket --</option>
              {dbPackages.length > 0
                ? dbPackages.map(pkg => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)
                : PRICING_PACKAGES.map(pkg => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)
              }
            </select>
            </div>
          </div>
          {!isEditMode && client.details && (
            <div className="pt-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Catatan AI</label>
              <p className="text-sm text-muted-foreground mt-1 bg-gray-50 p-3 rounded-lg">{client.details}</p>
            </div>
          )}
        </section>

        {/* ── Section: Project Resources & Notes (edit mode only) ── */}
        {isEditMode && (
          <section className="p-6 rounded-2xl border shadow-sm space-y-6 bg-white">
            <div className="flex items-center gap-2 border-b pb-4">
              <LinkIcon className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold uppercase tracking-widest text-sm">Project Resources</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Asset Link (Google Drive / Figma)</label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm"
                    placeholder="https://drive.google.com/..."
                    value={client.asset_link}
                    onChange={e => setClient({...client, asset_link: e.target.value})}
                  />
                  {client.asset_link && (
                    <a href={client.asset_link} target="_blank" className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors shrink-0">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Preview Link (Demo / Staging)</label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm"
                    placeholder="https://preview.domain.com/..."
                    value={client.preview_link}
                    onChange={e => setClient({...client, preview_link: e.target.value})}
                  />
                  {client.preview_link && (
                    <a href={client.preview_link} target="_blank" className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors shrink-0">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" /> Catatan Admin
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm"
                placeholder="Catatan internal untuk tim, misal: client ingin revisi 2x, deadline akhir bulan..."
                value={client.details}
                onChange={e => setClient({...client, details: e.target.value})}
              />
            </div>
          </section>
        )}

        {/* ── Section: Benefits (read-only) ── */}
        {benefits.length > 0 && (
          <section className="p-6 rounded-2xl border border-primary/20 bg-primary/5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-primary/10 pb-4">
              <CheckCircle className="w-5 h-5 text-primary" />
              <h2 className="font-bold uppercase tracking-widest text-sm text-primary">Benefit Paket</h2>
              <span className="ml-auto text-[10px] text-muted-foreground italic">Otomatis termasuk</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Section: Fitur Standar ── */}
        {standardItems.length > 0 && (
          <section className="p-6 rounded-2xl border bg-white shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-sm uppercase tracking-widest">Fitur Standar</h2>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {standardItems.filter(s => s.description.trim()).length}/{standardItems.length} slot
              </span>
            </div>

            <div className="space-y-3">
              {standardItems.map((item, index) => (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {index + 1}
                    </span>
                    <input
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                      placeholder={`Fitur standar ${index + 1}...`}
                      value={item.description}
                      onChange={e => updateStandardItem(index, { description: e.target.value })}
                    />
                    <span className="text-[10px] text-primary font-bold shrink-0">INCLUDED</span>
                  </div>
                  <div className="ml-10">
                    <input
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                      placeholder="Catatan untuk fitur ini, misal: ingin warna biru dominan (opsional)"
                      value={item.custom_note || ''}
                      onChange={e => updateStandardItem(index, { custom_note: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-dashed">
              <span className="text-sm font-semibold text-muted-foreground">Base Price ({selectedPkg?.name || 'Paket'})</span>
              <span className="text-lg font-bold">Rp {basePrice.toLocaleString('id-ID')}</span>
            </div>
          </section>
        )}

        {/* ── Section: Fitur Addon ── */}
        <section className="p-6 rounded-2xl border bg-white shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-sm uppercase tracking-widest">Fitur Tambahan (Addon)</h2>
            </div>
            <button type="button" onClick={addAddonItem} className="inline-flex items-center gap-1 text-blue-600 text-xs font-bold hover:text-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>

          {addonItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada fitur tambahan.</p>
              <button type="button" onClick={addAddonItem} className="mt-3 text-blue-600 text-xs font-bold hover:underline">
                + Tambah fitur addon
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {addonItems.map((item, index) => (
                <div key={item.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-32">
                      <select className="w-full p-2 text-xs font-bold border rounded-lg" value={item.type} onChange={e => updateAddonItem(index, { type: e.target.value as any, description: '', price: 0, feature_id: undefined, level: undefined, sub_level: undefined })}>
                        <option value="CATALOG">Katalog</option>
                        <option value="CUSTOM">Custom</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      {item.type === 'CATALOG' ? (
                        <select className="w-full p-2 border rounded-lg text-sm" value={item.feature_id || ''} onChange={e => handleCatalogSelect(index, e.target.value)}>
                          <option value="">-- Pilih Fitur --</option>
                          {catalog.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                      ) : (
                        <div className="space-y-2">
                          <input className="w-full p-2 border rounded-lg text-sm" placeholder="Deskripsi fitur tambahan..." value={item.description} onChange={e => updateAddonItem(index, { description: e.target.value })} />
                          {item.isAnalyzing && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-blue-500">
                              <Loader2 className="w-3 h-3 animate-spin" /> Menganalisis...
                            </span>
                          )}
                          {isPublic ? (
                            <>
                              {item.level && (
                                <div className="flex gap-1">
                                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{item.level}</span>
                                  {item.sub_level && <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{item.sub_level}</span>}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex gap-3">
                              <div className="flex-1">
                                <select
                                  className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg outline-none text-[10px] font-bold text-gray-700"
                                  value={item.level || ''}
                                  onChange={e => handleComplexityChange(index, 'level', e.target.value)}
                                >
                                  <option value="" disabled>-- Level --</option>
                                  <option value="MUDAH">MUDAH</option>
                                  <option value="SEDANG">SEDANG</option>
                                  <option value="SULIT">SULIT</option>
                                  <option value="SANGAT_SULIT">SANGAT SULIT</option>
                                </select>
                              </div>
                              <div className="flex-1">
                                <select
                                  className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg outline-none text-[10px] font-bold text-gray-700"
                                  value={item.sub_level || ''}
                                  onChange={e => handleComplexityChange(index, 'sub_level', e.target.value)}
                                >
                                  <option value="" disabled>-- Sub Level --</option>
                                  <option value="MINOR">MINOR</option>
                                  <option value="MAJOR">MAJOR</option>
                                </select>
                              </div>
                            </div>
                          )}
                          {item.reason && (
                            <p className="text-[10px] text-muted-foreground bg-blue-50 px-2 py-1 rounded">
                              <Sparkles className="w-3 h-3 inline mr-1 text-amber-500" />
                              {item.reason}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="w-full md:w-48">
                      {isPublic ? (
                        <div className="p-2 bg-white border rounded-lg text-sm font-bold text-right">
                          Rp {item.price.toLocaleString('id-ID')}
                        </div>
                      ) : (
                        <div className="relative">
                          <span className="absolute left-2 top-2 text-xs text-gray-400">Rp</span>
                          <input type="number" className="w-full pl-8 p-2 border rounded-lg text-sm font-bold" value={item.price} onChange={e => updateAddonItem(index, { price: Number(e.target.value) })} />
                        </div>
                      )}
                    </div>

                    <button type="button" onClick={() => removeAddonItem(item.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <input
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                      placeholder="Catatan untuk fitur ini, misal: harus support login Google (opsional)"
                      value={item.custom_note || ''}
                      onChange={e => updateAddonItem(index, { custom_note: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {addonItems.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-dashed">
              <span className="text-sm font-semibold text-muted-foreground">Subtotal Addon ({addonItems.length} item)</span>
              <span className="text-lg font-bold">Rp {addonTotal.toLocaleString('id-ID')}</span>
            </div>
          )}
        </section>

        {/* ── Section: Grand Total ── */}
        <div className="p-8 rounded-2xl bg-gray-900 text-white space-y-4">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Base Price ({selectedPkg?.name || 'Paket'})</span>
            <span>Rp {basePrice.toLocaleString('id-ID')}</span>
          </div>
          {addonItems.length > 0 && (
            <div className="flex justify-between text-sm text-gray-400">
              <span>Addon ({addonItems.length} item)</span>
              <span>Rp {addonTotal.toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
            <div>
              <h3 className="text-xs uppercase text-gray-400">Estimasi Total</h3>
              <p className="text-2xl font-bold">Rp {grandTotal.toLocaleString('id-ID')}</p>
            </div>
            <button type="submit" disabled={loading || !client.package_id} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition-colors">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isEditMode ? 'Simpan Perubahan' : 'Kirim Penawaran'}
            </button>
          </div>
          {isPublic && (
            <div className="mt-2 px-4 py-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-center">
              <p className="text-xs text-amber-300 leading-relaxed">
                Dengan mengirim penawaran, Anda <span className="text-amber-200 font-bold">belum melakukan pemesanan</span>. Tim kami akan menghubungi Anda untuk konsultasi lebih lanjut, dan harga di atas masih dapat dinegosiasikan.
              </p>
            </div>
          )}
          {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
        </div>
      </form>

      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPreview(false)} />
          <div className="relative bg-white p-6 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <button onClick={() => setShowPreview(false)} className="absolute right-4 top-4"><X className="w-5 h-5" /></button>
            <InvoicePreview
              client={{
                name: client.name,
                whatsapp: client.whatsapp,
                email: client.email,
                package_name: selectedPkg?.name || 'Custom Project'
              }}
              items={allItemsForPreview}
              total={grandTotal}
              floorPrice={basePrice}
              benefits={benefits}
              status="DRAFT"
            />
          </div>
        </div>
      )}
    </div>
  )
}
