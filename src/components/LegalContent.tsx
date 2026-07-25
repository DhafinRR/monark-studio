'use client'

import { useLanguage } from '@/lib/LanguageContext'

interface LegalContentProps {
  type: 'privacy' | 'terms'
  dbTitle: string
  dbContent: string
}

export default function LegalContent({ type, dbTitle, dbContent }: LegalContentProps) {
  const { t, language } = useLanguage()
  
  const displayTitle = language === 'en' ? t(`${type}.db_title`) : dbTitle
  const displayContent = language === 'en' ? t(`${type}.db_content`) : dbContent
  
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
        {displayTitle}
      </h1>
      
      <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10 max-w-2xl">
        {t(`${type}.intro`)}
      </p>
      
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-10" />
      
      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: displayContent }}
      />
    </>
  )
}
