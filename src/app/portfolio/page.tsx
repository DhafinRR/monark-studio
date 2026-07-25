import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ParticleField from '@/components/ParticleField'
import PortfolioContent from '@/components/PortfolioContent'
import PortfolioCTA from '@/components/PortfolioCTA'
import prisma from '@/lib/prisma'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Portfolio Monark Studio | Website & Mobile App',
  description: 'Lihat portfolio project website dan aplikasi mobile yang telah kami kerjakan untuk berbagai klien. Dari company profile, e-commerce, hingga aplikasi mobile.',
  keywords: ['portfolio monark studio', 'project website', 'project aplikasi mobile', 'showcase web development', 'contoh website profesional'],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://monarkstudio.com/portfolio',
    siteName: 'Monark Studio',
    title: 'Portfolio - Monark Studio',
    description: 'Lihat portfolio project website dan aplikasi mobile yang telah kami kerjakan untuk berbagai klien.',
    images: [
      {
        url: '/assets/logo-circle.png',
        width: 1200,
        height: 630,
        alt: 'Monark Studio Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio - Monark Studio',
    description: 'Lihat portfolio project website dan aplikasi mobile yang telah kami kerjakan.',
    images: ['/assets/logo-circle.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://monarkstudio.com/portfolio',
  },
}

export default async function PortfolioPage() {
  const projects = await prisma.portfolioProject.findMany({
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      image_url: true,
      project_url: true,
      created_at: true,
      stacks: {
        select: {
          id: true,
          name: true,
          icon_url: true,
          color_hex: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-background relative">
      <div className="relative">
        <ParticleField />
      </div>
      <Navbar />

      <PortfolioContent initialProjects={projects} />

      <PortfolioCTA />

      <Footer />
    </div>
  )
}
