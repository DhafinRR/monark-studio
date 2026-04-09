'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Bot } from "lucide-react";
import heroBg from "../../../../public/assets/hero-bg.jpg"; // Adjust path if needed
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleField from "@/components/ParticleField";
import Link from "next/link";
import ClientOrderForm from "@/components/ClientOrderForm";
import { PRICING_PACKAGES } from "@/config/pricing";

export default function AIOrderPage() {
  const [initialData, setInitialData] = useState<any>(null);
  const [initialItems, setInitialItems] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check for AI data in localStorage
    const storedData = localStorage.getItem("ai_order_data");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        // Mapping packageType to the string representation if necessary
        const selectedPackage = PRICING_PACKAGES.find(p => p.id === parsed.packageType);
        
        setInitialData({
          name: parsed.name || "",
          email: parsed.email || "",
          whatsapp: parsed.whatsapp || "",
          package_type: selectedPackage ? selectedPackage.name : (parsed.packageType || ""),
          details: parsed.details || ""
        });

        if (selectedPackage) {
          let parsedPrice = 0;
          if (selectedPackage.price.toLowerCase().includes('juta')) {
            parsedPrice = parseFloat(selectedPackage.price) * 1000000;
          } else {
            parsedPrice = parseInt(selectedPackage.price.replace(/\D/g, '')) || 0;
          }

          setInitialItems([{
            id: crypto.randomUUID(),
            type: 'CUSTOM',
            description: `Paket Rekomendasi AI: ${selectedPackage.name}`,
            price: parsedPrice,
            reason: parsed.details
          }]);
        }
      } catch (e) {
        console.error("Failed to parse AI data", e);
      }
    }
    setIsReady(true);
  }, []);

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <ParticleField />
      <Navbar />

      <main className="flex-1 relative pt-32 pb-20">
        <div className="absolute inset-0 z-0">
          <img src={heroBg?.src || ''} alt="" className="w-full h-full object-cover opacity-[0.04]" loading="lazy" />
          <div className="absolute inset-0 bg-background/98" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto mb-10">
            <Link 
              href="/#order" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Kembali
            </Link>

            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-semibold tracking-[0.2em] uppercase bg-primary/10 text-primary border border-primary/20 mb-5"
              >
                <Bot size={14} />
                Rekomendasi AI
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl font-display font-bold text-foreground mb-5"
              >
                Formulir <span className="text-gradient-secondary">Cerdas</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground text-base"
              >
                AI kami telah menyusun kebutuhan proyek Anda. Silakan periksa dan lengkapi data diri Anda.
              </motion.p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            {isReady && <ClientOrderForm isPublic={true} initialData={initialData} initialItems={initialItems} />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
