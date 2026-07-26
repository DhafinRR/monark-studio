const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const about = await prisma.aboutContent.findUnique({ where: { id: 'default' } });
  const terms = await prisma.termsCondition.findUnique({ where: { id: 'default' } });
  const privacy = await prisma.privacyPolicy.findUnique({ where: { id: 'default' } });
  const timeline = await prisma.orderTimeline.findMany();
  const ketentuan = await prisma.ketentuan.findMany();
  
  console.log(JSON.stringify({ about, terms, privacy, timeline, ketentuan }, null, 2));
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
