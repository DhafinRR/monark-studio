import QuoteEditor from '@/components/monolith-core/QuoteEditor'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

async function getQuote() {
  const quote = await prisma.aboutQuote.findUnique({
    where: { id: 'default' },
  })
  return quote
}

export default async function QuoteManagementPage() {
  const quote = await getQuote()

  if (!quote) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quote Management</h1>
          <p className="text-gray-500 text-sm">Kelola quote inspirational di halaman About.</p>
        </div>
      </div>

      <QuoteEditor initialData={quote} />
    </div>
  )
}
