'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import translations, { type Lang } from './translations'

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ID")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("monark_lang") as Lang | null
    if (saved === "ID" || saved === "EN") {
      setLangState(saved)
    }
    setMounted(true)
  }, [])

  const setLang = (newLang: Lang) => {
    setLangState(newLang)
    localStorage.setItem("monark_lang", newLang)
  }

  const t = (key: string): string => {
    const entry = translations[key]
    if (!entry) return key
    return entry[lang] || entry["ID"] || key
  }

  // Prevent hydration mismatch by rendering children only after mounting
  // but still render them during SSR with default lang (ID)
  return (
    <LanguageContext.Provider value={{ lang: mounted ? lang : "ID", setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
