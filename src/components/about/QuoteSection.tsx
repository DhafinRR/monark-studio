'use client'

import { motion } from 'framer-motion'
import { Quote as QuoteIcon } from 'lucide-react'

interface QuoteSectionProps {
  text: string
  author?: string
  position?: string
}

export default function QuoteSection({ text, author, position }: QuoteSectionProps) {
  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background decoration */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(198, 155, 40, 0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Quote Card */}
          <div className="relative bg-white rounded-3xl border-2 border-gray-100 p-8 md:p-12 shadow-xl">
            {/* Gold accent corner */}
            <div
              className="absolute top-0 left-0 w-24 h-24 rounded-tl-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(198,155,40,0.1) 0%, transparent 100%)',
              }}
            />

            {/* Quote Icon */}
            <div className="flex justify-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #C69B28, #E8C040)',
                }}
              >
                <QuoteIcon className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Quote Text */}
            <blockquote className="text-center">
              <p
                className="text-xl md:text-2xl lg:text-3xl text-gray-800 leading-relaxed mb-6 italic font-serif"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  letterSpacing: '0.01em',
                }}
              >
                "{text}"
              </p>

              {/* Author */}
              {author && (
                <footer className="text-center">
                  <cite className="not-italic">
                    <div className="font-bold text-gray-900 text-lg mb-1">
                      — {author}
                    </div>
                    {position && (
                      <div className="text-gray-600 text-sm" style={{ letterSpacing: '0.05em' }}>
                        {position}
                      </div>
                    )}
                  </cite>
                </footer>
              )}
            </blockquote>

            {/* Bottom decoration */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-1.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: '#C69B28', opacity: 0.3 + i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
