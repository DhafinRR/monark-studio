import { Plus } from 'lucide-react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import TimelineList from '@/components/monolith-core/TimelineList'

async function getTimelineSteps() {
  const steps = await prisma.orderTimeline.findMany({
    orderBy: { step_number: 'asc' },
  })
  return steps
}

export default async function TimelinePage() {
  const steps = await getTimelineSteps()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order Timeline</h1>
          <p className="text-gray-500 text-sm">Kelola tahapan proses pemesanan yang ditampilkan di halaman About.</p>
        </div>
        <Link
          href="/monolith-core/timeline/new"
          className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Step Baru
        </Link>
      </div>

      <TimelineList initialSteps={steps as any} />
    </div>
  )
}
