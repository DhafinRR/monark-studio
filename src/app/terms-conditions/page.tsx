import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Terms & Conditions - Monark Studio',
  description: 'Syarat dan ketentuan layanan Monark Studio dalam pembuatan website dan aplikasi.',
  alternates: {
    canonical: 'https://monarkstudio.com/terms-conditions',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function TermsConditionsPage() {
  const data = await prisma.termsCondition.findUnique({
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
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-8">
            {data.title}
          </h1>
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
