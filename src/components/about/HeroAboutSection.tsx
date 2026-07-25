'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLanguage } from '@/lib/LanguageContext'

interface HeroAboutSectionProps {
  title: string
  subtitle?: string
  logoUrl?: string
}

export default function HeroAboutSection({ title, subtitle, logoUrl }: HeroAboutSectionProps) {
  const { t, language } = useLanguage()
  
  const displayTitle = language === 'en' ? t('about.db_title') : title
  const displaySubtitle = language === 'en' ? t('about.db_subtitle') : subtitle

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-[#FAFAFA]">
      {/* Background decorations */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at -5% 10%, rgba(198,155,40,0.06) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 105% 90%, rgba(100,100,255,0.03) 0%, transparent 65%)',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo - small, centered, above title */}
          {logoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex justify-center"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 relative">
                <Image
                  src={logoUrl}
                  alt="Monark Studio Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          )}

          {/* Page Title - centered, classic but modern */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {displayTitle}
          </motion.h1>

          {/* Accent line below title */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <div className="relative h-1 w-32">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, #C69B28, transparent)',
                }}
              />
            </div>
          </motion.div>

          {/* Subtitle (optional) */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 font-medium"
              style={{ letterSpacing: '0.05em' }}
            >
              {displaySubtitle}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  )
}
