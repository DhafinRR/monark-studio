'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderFormSchema, OrderFormData } from "@/lib/validation";
import { PRICING_PACKAGES } from "@/config/pricing";
import { addOrder } from "@/lib/store";
import { Send, CheckCircle, Sparkles, ArrowRight, ArrowLeft, Bot } from "lucide-react";
import heroBg from "../../../../public/assets/hero-bg.jpg"; // Adjust path if needed
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleField from "@/components/ParticleField";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AIOrderPage() {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
  });

  const packageType = watch("packageType");
  const selectedPackage = PRICING_PACKAGES.find(p => p.id === packageType);

  useEffect(() => {
    // Check for AI data in localStorage
    const storedData = localStorage.getItem("ai_order_data");
    if (storedData) {
      try {
        const parsed: Partial<OrderFormData> = JSON.parse(storedData);
        if (parsed.name) setValue("name", parsed.name);
        if (parsed.email) setValue("email", parsed.email);
        if (parsed.whatsapp) setValue("whatsapp", parsed.whatsapp);
        if (parsed.packageType) setValue("packageType", parsed.packageType);
        if (parsed.details) setValue("details", parsed.details);
      } catch (e) {
        console.error("Failed to parse AI data", e);
      }
    }
  }, [setValue]);

  const onSubmit = (data: OrderFormData) => {
    addOrder(data as Omit<import("@/types").Order, "id" | "status" | "createdAt">);
    setSubmitted(true);
    reset();
    localStorage.removeItem("ai_order_data");
    setTimeout(() => setSubmitted(false), 4000);
  };

  const inputClasses =
    "w-full rounded-xl border border-border bg-background/60 backdrop-blur-sm px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all";

  // Readonly inputs have slightly different styling to indicate they shouldn't be touched unless necessary
  const readonlyClasses = 
    "w-full rounded-xl border border-primary/20 bg-primary/5 px-4 py-3.5 text-sm text-foreground cursor-not-allowed opacity-90";

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
          <div className="max-w-2xl mx-auto">
            <Link 
              href="/#order" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Kembali
            </Link>

            <div className="text-center mb-10">
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

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary mb-8"
              >
                <CheckCircle size={20} />
                <span className="text-sm font-medium">
                  Pesanan berhasil dikirim! Kami akan segera menghubungi Anda.
                </span>
              </motion.div>
            )}

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 rounded-2xl border border-primary/30 bg-card/60 backdrop-blur-xl p-8 md:p-10 shadow-2xl shadow-primary/10"
            >
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <input {...register("name")} className={inputClasses} placeholder="John Doe" />
                {errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Email</label>
                  <input type="email" {...register("email")} className={inputClasses} placeholder="john@example.com" />
                  {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">WhatsApp</label>
                  <input {...register("whatsapp")} className={inputClasses} placeholder="08123456789" />
                  {errors.whatsapp && <p className="mt-1.5 text-xs text-destructive">{errors.whatsapp.message}</p>}
                </div>
              </div>

               {/* AI READONLY FIELDS */}
               <div className="p-5 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 mt-6 mb-2">
                <div className="flex items-center gap-2 mb-4">
                  <Bot size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">Rekomendasi Paket AI</span>
                </div>
                
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Paket Terpilih</label>
                  <div className="w-full rounded-lg border border-primary/20 bg-background/50 px-4 py-3 text-sm font-medium flex justify-between items-center">
                    <span>{selectedPackage?.name || "Memuat..."}</span>
                    <span className="text-primary font-bold">
                      {selectedPackage ? `Rp ${selectedPackage.price}` : ""}
                    </span>
                  </div>
                  {/* Hidden input to pass value */}
                  <input type="hidden" {...register("packageType")} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Detail Kebutuhan (Disusun AI)</label>
                  <textarea
                    {...register("details")}
                    rows={4}
                    className={`${inputClasses} bg-background/50`}
                    placeholder="Ceritakan kebutuhan proyek Anda..."
                  />
                  {errors.details && <p className="mt-1.5 text-xs text-destructive">{errors.details.message}</p>}
                  <p className="mt-2 text-xs text-muted-foreground">
                    *Anda masih dapat mengubah detail ini jika ada yang kurang sesuai.
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01, boxShadow: "0 0 25px rgba(180,140,40,0.2)" }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-secondary text-accent-foreground font-bold text-sm transition-all disabled:opacity-50 mt-4"
              >
                <Send size={15} />
                Kirim Pesanan
                <ArrowRight size={15} />
              </motion.button>
            </motion.form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
