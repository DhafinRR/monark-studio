import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import HeroAboutSection from '@/components/about/HeroAboutSection'
import AboutContentSection from '@/components/about/AboutContentSection'
import TimelineHorizontalSection from '@/components/about/TimelineHorizontalSection'
import KetentuanCardsSection from '@/components/about/KetentuanCardsSection'
import QuoteSection from '@/components/about/QuoteSection'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About Us - Monark Studio | Digital Agency',
  description: 'Tentang Monark Studio, proses pemesanan, dan ketentuan layanan pembuatan website dan aplikasi mobile profesional.',
  keywords: [
    'about monark studio',
    'tentang kami',
    'proses pemesanan',
    'ketentuan layanan',
    'digital agency indonesia',
  ],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://monarkstudio.com/about',
    siteName: 'Monark Studio',
    title: 'About Us - Monark Studio',
    description: 'Tentang Monark Studio, proses pemesanan, dan ketentuan layanan.',
    images: [
      {
        url: '/assets/logo-circle.png',
        width: 1200,
        height: 630,
        alt: 'Monark Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Monark Studio',
    description: 'Tentang Monark Studio, proses pemesanan, dan ketentuan layanan.',
    images: ['/assets/logo-circle.png'],
  },
  alternates: {
    canonical: 'https://monarkstudio.com/about',
  },
  robots: {
    index: true,
    follow: true,
  },
}

async function getAboutContent() {
  const about = await prisma.aboutContent.findUnique({
    where: { id: 'default' },
  })
  return about
}

async function getTimelineSteps() {
  const steps = await prisma.orderTimeline.findMany({
    where: { is_active: true },
    orderBy: { step_number: 'asc' },
  })
  return steps
}

async function getKetentuanItems() {
  const items = await prisma.ketentuan.findMany({
    where: { is_active: true },
    orderBy: { order_number: 'asc' },
  })
  return items
}

async function getQuote() {
  const quote = await prisma.aboutQuote.findUnique({
    where: { id: 'default' },
  })
  return quote
}

export default async function AboutPage() {
  // Fetch all data in parallel
  const [about, timelineSteps, ketentuanItems, quote] = await Promise.all([
    getAboutContent(),
    getTimelineSteps(),
    getKetentuanItems(),
    getQuote(),
  ])

  // If no about content found, show 404
  if (!about) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Logo, Title, Accent Line */}
      <HeroAboutSection
        title={about.title}
        subtitle={about.subtitle || undefined}
        logoUrl={about.logo_url || undefined}
      />

      {/* About Content - Subtitle, Content with wide letter-spacing */}
      <AboutContentSection
        subtitle={about.subtitle || undefined}
        content={about.content}
      />

      {/* Timeline - Horizontal Scroll */}
      <TimelineHorizontalSection steps={timelineSteps as any} />

      {/* Ketentuan - Vertical Cards */}
      <KetentuanCardsSection items={ketentuanItems as any} />

      {/* Quote Section */}
      {quote && (
        <QuoteSection
          text={quote.text}
          author={quote.author || undefined}
          position={quote.position || undefined}
        />
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
