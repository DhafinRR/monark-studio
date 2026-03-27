import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PricingSection from "@/components/PricingSection";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParticleField from "@/components/ParticleField";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleField />
      <Navbar />
      <HeroSection />
      <PricingSection />
      <PortfolioShowcase />
      <OrderForm />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
