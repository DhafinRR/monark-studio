import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PricingSection from "@/components/PricingSection";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParticleField from "@/components/ParticleField";
import { MonarkStudioSchema } from "@/components/StructuredData";
import prisma from "@/lib/prisma";
import { Metadata } from "next";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Monark Studio - Jasa Pembuatan Website & Aplikasi Mobile',
  description: 'Monark Studio menyediakan jasa pembuatan website, aplikasi mobile, dan sistem informasi untuk UMKM, perusahaan, dan startup.',
  keywords: ['jasa pembuatan website', 'jasa aplikasi mobile', 'web developer indonesia', 'aplikasi android ios', 'website company profile', 'web app cms', 'monark studio'],
  authors: [{ name: 'Monark Studio' }],
  creator: 'Monark Studio',
  publisher: 'Monark Studio',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://monarkstudio.com',
    siteName: 'Monark Studio',
    title: 'Monark Studio - Jasa Pembuatan Website & Aplikasi Mobile',
    description: 'Jasa pembuatan website dan aplikasi mobile profesional untuk UMKM, perusahaan, dan startup. Konsultasi gratis via WhatsApp.',
    images: [
      {
        url: '/assets/logo-circle.png',
        width: 1200,
        height: 630,
        alt: 'Monark Studio Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monark Studio - Jasa Pembuatan Website & Aplikasi Mobile',
    description: 'Jasa pembuatan website dan aplikasi mobile profesional. Konsultasi gratis via WhatsApp.',
    images: ['/assets/logo-circle.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Ganti dengan kode verifikasi Google Search Console
  },
  alternates: {
    canonical: 'https://monarkstudio.com',
  },
}

export default async function Home() {
  const projects = await prisma.portfolioProject.findMany({
    orderBy: { created_at: 'desc' },
    take: 3,
    include: {
      stacks: true,
    },
  });

  return (
    <div className="min-h-screen bg-background relative">
      <MonarkStudioSchema />
      <div className="relative">
        <ParticleField />
      </div>
      <Navbar />
      <HeroSection />
      <PricingSection />
      <PortfolioShowcase projects={projects} />
      <OrderForm />
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
