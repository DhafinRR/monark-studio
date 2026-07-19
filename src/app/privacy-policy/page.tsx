import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Privacy & Policy - Monark Studio',
  description: 'Pelajari bagaimana Monark Studio melindungi dan mengelola data Anda dengan standar keamanan tertinggi.',
  alternates: {
    canonical: 'https://monarkstudio.com/privacy-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function PrivacyPolicyPage() {
  const data = await prisma.privacyPolicy.findUnique({
    where: { id: 'default' },
  })

  if (!data || !data.is_active) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            {data.title}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10 max-w-2xl">
            Kepercayaan Anda adalah fondasi dari setiap proyek yang kami bangun. Dokumen ini menjelaskan secara transparan bagaimana Monark Studio mengumpulkan, mengelola, dan melindungi informasi pribadi Anda — mulai dari data kontak hingga detail proyek — dengan standar keamanan industri tertinggi. Kami berkomitmen untuk menjaga kerahasiaan data Anda di setiap tahap kolaborasi.
          </p>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-10" />
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
