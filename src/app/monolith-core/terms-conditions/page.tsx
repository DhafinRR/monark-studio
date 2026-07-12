import TermsConditionEditor from '@/components/monolith-core/TermsConditionEditor'
import prisma from '@/lib/prisma'

async function getTermsCondition() {
  const termsCondition = await prisma.termsCondition.findUnique({
    where: { id: 'default' },
  })
  return termsCondition
}

export default async function TermsConditionManagementPage() {
  const termsCondition = await getTermsCondition()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Terms & Conditions</h1>
          <p className="text-gray-500 text-sm">Kelola dokumen syarat dan ketentuan layanan yang mencakup lingkup kerja, pembayaran, dan hak kekayaan intelektual. Konten ini akan ditampilkan di halaman publik /terms-conditions.</p>
        </div>
      </div>

      <TermsConditionEditor initialData={termsCondition} />
    </div>
  )
}
