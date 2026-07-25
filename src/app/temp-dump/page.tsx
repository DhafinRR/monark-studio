import prisma from '@/lib/prisma'

export default async function TempDumpPage() {
  const about = await prisma.aboutContent.findUnique({ where: { id: 'default' } });
  const terms = await prisma.termsCondition.findUnique({ where: { id: 'default' } });
  const privacy = await prisma.privacyPolicy.findUnique({ where: { id: 'default' } });
  const timeline = await prisma.orderTimeline.findMany();
  const ketentuan = await prisma.ketentuan.findMany();
  
  return (
    <pre>{JSON.stringify({ about, terms, privacy, timeline, ketentuan }, null, 2)}</pre>
  )
}
