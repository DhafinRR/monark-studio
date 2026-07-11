import PrivacyPolicyEditor from '@/components/monolith-core/PrivacyPolicyEditor'
import prisma from '@/lib/prisma'

async function getPrivacyPolicy() {
  const privacyPolicy = await prisma.privacyPolicy.findUnique({
    where: { id: 'default' },
  })
  return privacyPolicy
}

export default async function PrivacyPolicyManagementPage() {
  const privacyPolicy = await getPrivacyPolicy()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Privacy & Policy</h1>
          <p className="text-gray-500 text-sm">Kelola kebijakan privasi untuk website.</p>
        </div>
      </div>

      <PrivacyPolicyEditor initialData={privacyPolicy} />
    </div>
  )
}
