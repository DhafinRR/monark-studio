'use client'

import { motion } from 'framer-motion'
import { getStoragePublicUrl } from '@/lib/storage-url'

interface KetentuanItem {
  id: string
  order_number: number
  title: string
  content: string
  icon: string | null
}

interface KetentuanCardsSectionProps {
  items: KetentuanItem[]
}

export default function KetentuanCardsSection({ items }: KetentuanCardsSectionProps) {
  return (
    <section id="ketentuan" className="relative py-16 md:py-20 bg-gray-50">
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
            Ketentuan & Syarat
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
            Ketentuan pemesanan yang berlaku untuk semua project
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm hover:shadow-lg transition-all h-full group">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Icon */}
                  {item.icon && (item.icon.trimStart().startsWith('<svg') || item.icon.trimStart().startsWith('<?xml')) ? (
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center p-2"
                      style={{
                        background: 'linear-gradient(135deg, #C69B2810, #E8C04015)',
                        border: '1px solid #C69B2820',
                      }}
                    >
                      <div
                        className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                        dangerouslySetInnerHTML={{ __html: item.icon }}
                      />
                    </div>
                  ) : item.icon ? (
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center p-2"
                      style={{
                        background: 'linear-gradient(135deg, #C69B2810, #E8C04015)',
                        border: '1px solid #C69B2820',
                      }}
                    >
                      <img src={getStoragePublicUrl(item.icon)} alt="" className="w-full h-full object-contain" />
                    </div>
                  ) : null}

                  {/* Order number & Title */}
                  <div className="flex-1">
                    <div
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-2"
                      style={{
                        background: 'linear-gradient(135deg, #C69B28, #E8C040)',
                        color: '#1C1200',
                      }}
                    >
                      #{item.order_number}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#C69B28] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Rich HTML Content */}
                <div
                  className="prose prose-sm max-w-none text-gray-700"
                  style={{
                    lineHeight: '1.7',
                  }}
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada ketentuan tersedia.</p>
          </div>
        )}
      </div>

      {/* Add custom styles for rendered HTML content */}
      <style jsx global>{`
        .prose p {
          margin-bottom: 0.75rem;
        }
        .prose p:last-child {
          margin-bottom: 0;
        }
        .prose ul {
          margin-top: 0.5rem;
          margin-bottom: 0.75rem;
          padding-left: 1.25rem;
          list-style-type: disc;
        }
        .prose li {
          margin-bottom: 0.375rem;
          color: #4B5563;
        }
        .prose li:last-child {
          margin-bottom: 0;
        }
        .prose strong {
          color: #111827;
          font-weight: 600;
        }
        .prose em {
          font-style: italic;
        }
      `}</style>
    </section>
  )
}
