'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

interface AboutContentSectionProps {
  subtitle?: string
  content: string
}

export default function AboutContentSection({ subtitle, content }: AboutContentSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-10%' })
  const { t, lang: language } = useLanguage()

  const displaySubtitle = language === 'EN' ? t('about.db_subtitle') : subtitle
  const displayContent = language === 'EN' ? t('about.db_content') : content

  return (
    <section className="relative py-16 md:py-20 bg-white" ref={containerRef}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Subtitle with accent line */}
          {displaySubtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {displaySubtitle}
              </h2>
              {/* Accent line below subtitle */}
              <div className="flex justify-center">
                <div className="relative h-0.5 w-24">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, transparent, #C69B28, transparent)',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Content with wider letter-spacing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <div
              className="prose prose-lg prose-gray max-w-none prose-p:leading-relaxed prose-headings:font-display prose-headings:font-bold"
              style={{
                letterSpacing: '0.02em',
                lineHeight: '1.8',
              }}
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
