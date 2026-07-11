import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Privacy & Policy - Monark Studio',
  description: 'Kebijakan privasi Monark Studio dalam pengelolaan data dan informasi pengguna.',
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
