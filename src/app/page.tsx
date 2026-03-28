'use client'

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PricingSection from "@/components/PricingSection";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParticleField from "@/components/ParticleField";


// src/app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Paste konten dari Index.tsx di sini */}
      <ParticleField />
      <Navbar />
      <HeroSection />
      <PricingSection />
      <PortfolioShowcase />
      <OrderForm />
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
