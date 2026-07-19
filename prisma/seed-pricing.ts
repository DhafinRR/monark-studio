import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Pricing Packages...')
  
  const packages = [
    {
      id: 'basic_web',
      name: 'Basic Web',
      floor_price: 600000,
      max_slots: 3,
      benefits: ['Free Hosting Lifetime', 'Desain Responsif', '3x Revisi', 'Video Panduan'],
      default_features: ['Halaman Home Statis', 'Halaman About/Layanan', 'Tombol WhatsApp']
    },
    {
      id: 'web_app_cms',
      name: 'Web App / CMS',
      floor_price: 5000000,
      max_slots: 10,
      is_popular: true,
      benefits: ['Free Domain 1 Tahun', '1 Email Bisnis', 'Google Analytics', 'Dashboard Admin (CMS)'],
      default_features: ['Dashboard Admin', 'Sistem Login/Auth', 'Manajemen Konten (CRUD)', 'Search & Filter', 'Hingga 5 Halaman Dinamis']
    },
    {
      id: 'mobile_app',
      name: 'Mobile App',
      floor_price: 15000000,
      max_slots: 12,
      benefits: ['Full Custom System', 'Free CMS', 'UI/UX Premium', 'Priority Support'],
      default_features: ['Splash Screen & Icon', 'Login & Profile User', 'Navbar/Menu Navigasi', 'Web Admin Backend', 'Push Notifications']
    }
  ]

  for (const pkg of packages) {
    await prisma.pricingPackage.upsert({
      where: { id: pkg.id },
      update: pkg,
      create: pkg,
    })
  }

  console.log('Seeding Feature Catalog (Standard Features)...')
  
  const standardFeatures = [
    { name: 'Halaman Home Statis', category: 'General', price: 200000 },
    { name: 'Halaman About/Layanan', category: 'General', price: 200000 },
    { name: 'Tombol WhatsApp', category: 'General', price: 200000 },
    { name: 'Dashboard Admin', category: 'Web App', price: 1500000 },
    { name: 'Sistem Login/Auth', category: 'Web App', price: 1000000 },
    { name: 'Manajemen Konten (CRUD)', category: 'Web App', price: 1500000 },
    { name: 'Splash Screen & Icon', category: 'Mobile', price: 1000000 },
    { name: 'Push Notifications', category: 'Mobile', price: 1500000 },
  ]

  for (const feature of standardFeatures) {
    await prisma.featureCatalog.upsert({
      where: { id: feature.name }, // This might fail if ID is UUID, using name as lookup if possible or just create
      update: feature,
      create: feature,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
