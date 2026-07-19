'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, MessageCircle, Bot, FileText, ArrowRight, Loader2 } from "lucide-react";
import heroBg from "../../public/assets/hero-bg.jpg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Assuming sonner is used for toast, if not I'll just use simple alert/state, wait, package.json has sonner!
import { Highlighter } from "./magicui/text-highlighter";

export default function OrderForm() {
  const router = useRouter();
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<"ANDROID" | "IOS" | "BOTH" | null>(null);

  const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285846072435";
  const WA_LINK = `https://wa.me/${WA_NUMBER}?text=Halo%20tim%20Monark%20Studio,%20saya%20ingin%20berkonsultasi%20tentang%20pembuatan%20proyek%20digital.`;

  const handleAiSubmit = async (platformOverride?: string) => {
    if (!aiPrompt.trim()) return;

    // Deteksi kata kunci mobile jika belum memilih platform
    const isMobileKeyword = /mobile|aplikasi|android|ios|iphone|seluler/i.test(aiPrompt);
    if (isMobileKeyword && !selectedPlatform && !platformOverride) {
      setShowPlatformModal(true);
      return;
    }

    setIsAiLoading(true);
    try {
      const platform = platformOverride || selectedPlatform || undefined;
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: aiPrompt,
          action: "PARSE_ORDER",
          ...(platform ? { platform } : {}),
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error("Gagal mem-parsing respons server.");
      }

      if (!res.ok) {
        throw new Error(data.details || data.error || "Gagal menganalisis. Pastikan API key sudah benar.");
      }

      // Show fallback notice if applicable
      if (data.is_fallback || data.fallback_note) {
        toast.warning(data.fallback_note || "Layanan AI sedang sibuk. Menampilkan estimasi dasar.", {
          duration: 5000,
        });
      }

      localStorage.setItem("ai_order_data", JSON.stringify(data));
      router.push("/order/ai");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan saat menghubungi peladen AI.");
    } finally {
      setIsAiLoading(false);
      setShowPlatformModal(false);
    }
  };

  const handleSelectPlatform = (platform: "ANDROID" | "IOS" | "BOTH") => {
    setSelectedPlatform(platform);
    handleAiSubmit(platform);
  };

  return (
    <section id="order" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg.src} alt="" className="w-full h-full object-cover opacity-[0.04]" loading="lazy" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/98" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-semibold tracking-[0.2em] uppercase bg-primary/10 text-primary border border-primary/20 mb-5"
            >
              <Sparkles size={12} />
              Mulai Proyek
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-display font-bold text-foreground mb-5"
            >
              Wujudkan <Highlighter action="circle" color="#C69B28" isView={true}> <span className="text-gradient-secondary">Ide</span></Highlighter> Anda
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-base max-w-2xl mx-auto"
            >
              Pilih cara berkonsultasi yang paling nyaman untuk Anda. Tim atau AI kami siap membantu merumuskan kebutuhan proyek Anda.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 1. Konsultasi WhatsApp */}
            <motion.a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="flex flex-col h-full rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-8 shadow-xl shadow-primary/5 hover:border-primary/40 hover:shadow-primary/10 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-6">
                <MessageCircle size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Konsultasi Langsung</h3>
              <p className="text-muted-foreground text-sm flex-1 mb-8">
                Diskusikan ide proyek Anda langsung dengan tim ahli kami melalui WhatsApp. Cepat dan personal.
              </p>
              <div className="flex items-center text-sm font-semibold text-[#25D366] mt-auto">
                Chat Sekarang <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>

            {/* 2. Tanya AI (Untuk Awam) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col h-full rounded-2xl border-2 border-primary/30 bg-primary/5 backdrop-blur-xl p-8 shadow-2xl shadow-primary/10 md:col-span-2 lg:col-span-1 relative overflow-hidden"
            >
              {/* Highlight badge */}
              <div className="absolute top-0 right-0 bg-primary text-background text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Rekomendasi
              </div>

              <div className="w-14 h-14 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                <Bot size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Tanya Asisten AI</h3>
              <p className="text-muted-foreground text-sm mb-5">
                Ceritakan secara singkat apa yang Anda butuhkan dengan bahasa sehari-hari. AI kami akan merumuskan spesifikasinya.
              </p>
              
              <div className="flex flex-col flex-1">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Contoh: Saya butuh website untuk jualan baju online dengan fitur keranjang belanja..."
                  className="w-full text-sm bg-background/80 border border-primary/20 rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 resize-none mb-4"
                />
                <button
                  onClick={() => handleAiSubmit()}
                  disabled={isAiLoading || !aiPrompt.trim()}
                  className="w-full mt-auto flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Menganalisis...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Gunakan AI
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* 3. Form Manual */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -5 }}
              className="flex flex-col h-full rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-8 shadow-xl shadow-primary/5 hover:border-primary/40 hover:shadow-primary/10 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Isi Form Manual</h3>
              <p className="text-muted-foreground text-sm flex-1 mb-8">
                Sudah tahu persis apa yang Anda butuhkan? Isi formulir pemesanan secara mandiri dan pilih paket Anda.
              </p>
              
              <Link 
                href="/order"
                className="mt-auto block w-full text-center py-3.5 rounded-xl border border-border bg-background hover:bg-muted font-semibold text-sm transition-colors"
              >
                Isi Formulir
              </Link>
            </motion.div>
            
          </div>
        </div>
      </div>
      {/* Platform Selection Modal */}
      {showPlatformModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowPlatformModal(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg bg-card border border-border/60 shadow-2xl rounded-3xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                <Sparkles size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Pilih Platform Aplikasi</h3>
              <p className="text-muted-foreground text-sm">
                Kami mendeteksi kebutuhan aplikasi mobile. Mana yang Anda butuhkan?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleSelectPlatform("ANDROID")}
                disabled={isAiLoading}
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div>
                  <div className="font-bold text-lg">Android</div>
                  <div className="text-xs text-muted-foreground">Aplikasi untuk Play Store</div>
                </div>
                {isAiLoading ? <Loader2 size={20} className="animate-spin text-primary" /> : <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />}
              </button>
              <button
                onClick={() => handleSelectPlatform("IOS")}
                disabled={isAiLoading}
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div>
                  <div className="font-bold text-lg">iOS</div>
                  <div className="text-xs text-muted-foreground">Aplikasi untuk App Store</div>
                </div>
                {isAiLoading ? <Loader2 size={20} className="animate-spin text-primary" /> : <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />}
              </button>
              <button
                onClick={() => handleSelectPlatform("BOTH")}
                disabled={isAiLoading}
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div>
                  <div className="font-bold text-lg">Keduanya (Android & iOS)</div>
                  <div className="text-xs text-muted-foreground">Dua platform sekaligus dengan harga khusus</div>
                </div>
                {isAiLoading ? <Loader2 size={20} className="animate-spin text-primary" /> : <Sparkles size={20} className="text-primary group-hover:scale-110 transition-transform" />}
              </button>
            </div>

            <button 
              onClick={() => setShowPlatformModal(false)}
              className="mt-6 w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Batal
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
