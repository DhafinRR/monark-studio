'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function LegalIntro({ type }: { type: 'privacy' | 'terms' }) {
  const { t } = useLanguage()
  
  return (
    <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10 max-w-2xl">
      {type === 'privacy' ? t("privacy.intro") : t("terms.intro")}
    </p>
  )
}
