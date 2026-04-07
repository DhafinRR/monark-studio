import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PricingSection from "@/components/PricingSection";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParticleField from "@/components/ParticleField";
import prisma from "@/lib/prisma";

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
