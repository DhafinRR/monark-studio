import KetentuanEditForm from '@/components/monolith-core/KetentuanEditForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface KetentuanEditPageProps {
  params: Promise<{ id: string }>
}

async function getKetentuan(id: string) {
  const ketentuan = await prisma.ketentuan.findUnique({
    where: { id },
  })
  return ketentuan
}

export default async function KetentuanEditPage({ params }: KetentuanEditPageProps) {
  const { id } = await params
  const ketentuan = await getKetentuan(id)

  if (!ketentuan) {
    notFound()
  }

  return <KetentuanEditForm initialData={ketentuan} />
}
