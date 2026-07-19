import TimelineEditForm from '@/components/monolith-core/TimelineEditForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface TimelineEditPageProps {
  params: Promise<{ id: string }>
}

async function getTimelineStep(id: string) {
  const step = await prisma.orderTimeline.findUnique({
    where: { id },
  })
  return step
}

export default async function TimelineEditPage({ params }: TimelineEditPageProps) {
  const { id } = await params
  const step = await getTimelineStep(id)

  if (!step) {
    notFound()
  }

  return <TimelineEditForm initialData={step} />
}
