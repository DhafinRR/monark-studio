import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import LegalContent from '@/components/LegalContent'

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
          <LegalContent 
            type="privacy" 
            dbTitle={data.title} 
            dbContent={data.content} 
          />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
