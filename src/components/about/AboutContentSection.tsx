'use client'

import { motion } from 'framer-motion'

interface AboutContentSectionProps {
  subtitle?: string
  content: string
}

export default function AboutContentSection({ subtitle, content }: AboutContentSectionProps) {
  return (
    <section className="relative py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Subtitle with accent line */}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {subtitle}
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
            style={{
              letterSpacing: '0.03em', // Wider letter spacing as requested
            }}
          >
            <div
              className="text-gray-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
