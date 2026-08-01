'use client'

import { motion } from 'framer-motion'
import { getStoragePublicUrl } from '@/lib/storage-url'
import { useLanguage } from '@/lib/LanguageContext'

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
  const { t } = useLanguage()
  const fallbackItems: KetentuanItem[] = [
    {
      id: 'fallback-1',
      order_number: 1,
      title: 'Ruang Lingkup & Alur',
      content: '<p>Pengerjaan proyek mengikuti tahap terstruktur mulai dari konsultasi, pembayaran DP, perancangan desain, pengembangan, pengujian, hingga serah terima. Klien diwajibkan untuk menyediakan materi tepat waktu guna kelancaran proyek.</p>',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>',
    },
    {
      id: 'fallback-2',
      order_number: 2,
      title: 'Pembayaran & Pembatalan',
      content: '<p>Pembayaran dilakukan dalam 2 tahap: <strong>50% DP</strong> (Uang Muka) di awal sebelum pengerjaan dan <strong>50% pelunasan</strong> sebelum serah terima akhir. DP yang telah dibayarkan <em>tidak dapat dikembalikan (non-refundable)</em> jika terjadi pembatalan sepihak.</p>',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
    },
    {
      id: 'fallback-3',
      order_number: 3,
      title: 'Revisi & Perubahan',
      content: '<p>Tersedia kuota untuk <strong>revisi minor</strong> (penyesuaian warna, teks, layout ringan). Perombakan desain besar atau penambahan fitur di luar kesepakatan awal (<em>Change Request</em>) akan dikenakan biaya tambahan sesuai persetujuan bersama.</p>',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>',
    },
    {
      id: 'fallback-4',
      order_number: 4,
      title: 'Hak Cipta & Garansi',
      content: '<p>Setelah pelunasan 100%, hak kepemilikan dan <em>source code</em> hasil akhir sepenuhnya diserahkan kepada Klien. Kami juga memberikan <strong>garansi gratis perbaikan error/bug</strong> selama 30 hari kalender setelah tahap serah terima (handover).</p>',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>',
    }
  ];

  const displayItems = items && items.length > 0 ? items : fallbackItems;

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
            {t("about.ketentuanTitle")}
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
            {t("about.ketentuanDesc")}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayItems.map((item, index) => (
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
