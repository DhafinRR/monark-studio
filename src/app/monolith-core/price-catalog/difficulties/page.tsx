'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Sparkles, HelpCircle, ArrowUpRight } from 'lucide-react'

const LEVELS = ['MUDAH', 'SEDANG', 'SULIT', 'SANGAT_SULIT']
const SUB_LEVELS = ['MINOR', 'MAJOR']

interface DifficultyPrice {
  level: string
  sub_level: string
  price: string
}

export default function DifficultiesPage() {
  const [prices, setPrices] = useState<DifficultyPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    try {
      const res = await fetch('/api/monolith-core/complexity-price')
      const data = await res.json()
      if (res.ok && Array.isArray(data)) setPrices(data)
      else setPrices([])
    } finally {
      setLoading(false)
    }
  }

  const getPriceValue = (level: string, sub_level: string) => {
    const arr = Array.isArray(prices) ? prices : []
    const item = arr.find(p => p.level === level && p.sub_level === sub_level)
    return item ? item.price : ''
  }

  const handleUpdate = async (level: string, sub_level: string, value: string) => {
    const key = `${level}-${sub_level}`
    setSaving(key)
    try {
      console.log("Update price", value)
      await fetch('/api/monolith-core/complexity-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          sub_level,
          price: parseFloat(value) || 0
        })
      })
      await fetchPrices()
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Difficulty Matrix</h1>
          <p className="text-gray-500 text-sm">Configure base pricing for AI-estimated features</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <div className="text-xs text-blue-800">
            <p className="font-bold">AI Helper Active</p>
            <p className="opacity-80">Prices below are used for auto-estimation.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {LEVELS.map((level) => (
          <div key={level} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <span className={`text-sm font-bold tracking-widest ${
                level === 'SANGAT_SULIT' ? 'text-red-600' :
                level === 'SULIT' ? 'text-orange-600' :
                level === 'SEDANG' ? 'text-blue-600' : 'text-emerald-600'
              }`}>
                {level}
              </span>
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            </div>
            
            <div className="p-6 space-y-6">
              {SUB_LEVELS.map((sub) => {
                const key = `${level}-${sub}`
                return (
                  <div key={sub} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-500 uppercase">{sub}</label>
                      {saving === key && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
                    </div>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rp</span>
                      <input 
                        type="number" 
                        defaultValue={getPriceValue(level, sub)}
                        onBlur={(e) => handleUpdate(level, sub, e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 group-hover:border-gray-300 transition-all font-semibold"
                        placeholder="0"
                      />
                      <ArrowUpRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex items-start gap-4">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Save className="w-5 h-5 text-yellow-700" />
        </div>
        <div className="text-sm text-yellow-800">
          <p className="font-bold">Auto-Save Enabled</p>
          <p className="opacity-80">Changing values above will immediately update all future estimates. Previous orders remain unaffected.</p>
        </div>
      </div>
    </div>
  )
}
