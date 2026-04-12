'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Bot, Loader2 } from "lucide-react";
import heroBg from "../../../../public/assets/hero-bg.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleField from "@/components/ParticleField";
import Link from "next/link";
import ClientOrderForm from "@/components/ClientOrderForm";

interface DBPackage {
  id: string
  name: string
  floor_price: string
  max_slots: number
  benefits: string[]
  default_features: string[]
  is_popular: boolean
}

export default function AIOrderPage() {
  const [initialData, setInitialData] = useState<any>(null);
  const [initialStandardItems, setInitialStandardItems] = useState<{ description: string }[]>([]);
  const [initialAddonItems, setInitialAddonItems] = useState<any[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadAIData() {
      const storedData = localStorage.getItem("ai_order_data");
      if (!storedData) {
        setIsReady(true);
        return;
      }

      try {
        const parsed = JSON.parse(storedData);
        console.log("=== AI DATA FROM LOCALSTORAGE ===")
        console.log("All keys:", Object.keys(parsed))
        console.log("standard_items:", parsed.standard_items)
        console.log("addon_items:", parsed.addon_items)
        console.log("items (old format):", parsed.items)
        console.log("Full data:", JSON.stringify(parsed, null, 2))
        console.log("=== END AI DATA ===")

        // Fetch packages from database
        const res = await fetch("/api/public/pricing-packages");
        const dbPackages: DBPackage[] = await res.json();

        // Match AI-selected package with DB package
        const selectedPkg = dbPackages.find(p => p.id === parsed.package_id) || dbPackages[0];

        // Set client data
        setInitialData({
          name: "",
          email: "",
          whatsapp: "",
          package_id: selectedPkg?.id || "",
          details: parsed.analysis_summary || ""
        });

        // Set benefits from DB (read-only)
        if (selectedPkg?.benefits) {
          setBenefits(selectedPkg.benefits);
        }

        // New JSON structure: standard_items[] and addon_items[] are separate
        const maxSlots = selectedPkg?.max_slots || 3

        // Parse standard items (new structure: parsed.standard_items)
        // Fallback: also support old structure (parsed.items with classification)
        const rawStandard: any[] = parsed.standard_items
          || parsed.items?.filter((i: any) => i.classification === "STANDARD" && !i.description?.startsWith("Layanan Inti"))
          || []

        const aiStandard = rawStandard
          .slice(0, maxSlots)
          .map((item: any) => ({ description: item.description || "" }))

        // Parse addon items (new structure: parsed.addon_items)
        // Fallback: also support old structure (parsed.items with classification)
        const rawAddon: any[] = parsed.addon_items
          || parsed.items?.filter((i: any) => i.classification === "ADDON")
          || []

        // Overflow standard items beyond max_slots also become addons
        const overflowAddon = rawStandard.slice(maxSlots)

        const aiAddon = [...rawAddon, ...overflowAddon].map((item: any) => ({
          id: crypto.randomUUID(),
          type: (item.type || "CUSTOM") as "CATALOG" | "CUSTOM",
          classification: "ADDON" as const,
          description: item.description || "",
          price: Number(item.price) || 0,
          level: item.level || undefined,
          sub_level: item.sub_level || undefined,
          custom_note: item.custom_note || "",
          reason: item.reason || "",
        }))

        console.log("=== PARSED RESULT ===")
        console.log("aiStandard:", aiStandard)
        console.log("aiAddon:", aiAddon)
        console.log("rawAddon source:", rawAddon)
        console.log("=== END PARSED RESULT ===")

        setInitialStandardItems(aiStandard)
        setInitialAddonItems(aiAddon)

        // Show fallback notice
        if (parsed.is_fallback) {
          console.warn("AI fallback mode:", parsed.fallback_note);
        }
      } catch (e) {
        console.error("Failed to parse AI data", e);
      }

      setIsReady(true);
    }

    loadAIData();
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
            {isReady ? (
              <ClientOrderForm
                isPublic={true}
                initialData={initialData}
                initialStandardItems={initialStandardItems}
                initialAddonItems={initialAddonItems}
                initialBenefits={benefits}
              />
            ) : (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Memuat data AI...</span>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
