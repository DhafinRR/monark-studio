'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { getStoragePublicUrl } from '@/lib/storage-url'
import { useLanguage } from '@/lib/LanguageContext'

interface TimelineStep {
  id: string
  step_number: number
  title: string
  description: string
  duration: string | null
  icon: string | null
}

interface TimelineHorizontalSectionProps {
  steps: TimelineStep[]
}

export default function TimelineHorizontalSection({ steps }: TimelineHorizontalSectionProps) {
  const { t } = useLanguage()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {t("about.timelineTitle")}
          </h2>
          <div className="flex justify-center mb-4">
            <div className="relative h-0.5 w-24">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, #C69B28, transparent)',
                }}
              />
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("about.timelineDesc")}
          </p>
        </motion.div>

        {/* Horizontal Scrolling Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* Scroll hint - left */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

          {/* Scroll hint - right */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#C69B28 #F3F4F6',
            }}
          >
            <div className="flex gap-6 min-w-max px-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex-shrink-0 w-80"
                >
                  {/* Card */}
                  <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-lg hover:shadow-xl transition-shadow h-full">
                    {/* Step number with icon */}
                    <div className="flex items-center gap-4 mb-4">
                      {step.icon && (step.icon.trimStart().startsWith('<svg') || step.icon.trimStart().startsWith('<?xml')) ? (
                        <div className="w-12 h-12 [&>svg]:w-full [&>svg]:h-full">
                          <div dangerouslySetInnerHTML={{ __html: step.icon }} />
                        </div>
                      ) : step.icon ? (
                        <img src={getStoragePublicUrl(step.icon)} alt="" className="w-12 h-12 object-contain" />
                      ) : null}
                      <div className="flex-1">
                        <div
                          className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                          style={{
                            background: 'linear-gradient(135deg, #C69B28, #E8C040)',
                            color: '#1C1200',
                          }}
                        >
                          {t("about.step")} {step.step_number}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Duration */}
                    {step.duration && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium">{step.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* Connector line (except last item) */}
                  {index < steps.length - 1 && (
                    <div
                      className="absolute top-1/2 -right-6 w-6 h-0.5 -translate-y-1/2 z-0"
                      style={{ background: '#C69B28' }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
