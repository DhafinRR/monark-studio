import AboutEditor from '@/components/monolith-core/AboutEditor'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

async function getAboutContent() {
  const about = await prisma.aboutContent.findUnique({
    where: { id: 'default' },
  })
  return about
}

export default async function AboutManagementPage() {
  const about = await getAboutContent()

  if (!about) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">About Content</h1>
          <p className="text-gray-500 text-sm">Kelola konten halaman About untuk publik.</p>
        </div>
      </div>

      <AboutEditor initialData={about} />
    </div>
  )
}
