'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderFormSchema, OrderFormData } from "@/lib/validation";
import { PRICING_PACKAGES } from "@/config/pricing";
import { addOrder } from "@/lib/store";
import { Send, CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import heroBg from "../../public/assets/hero-bg.jpg";

export default function OrderForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
  });

  const onSubmit = (data: OrderFormData) => {
    addOrder(data as Omit<import("@/types").Order, "id" | "status" | "createdAt">);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 4000);
  };

  const inputClasses =
    "w-full rounded-xl border border-border bg-background/60 backdrop-blur-sm px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all";

  return (
    <section id="order" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-[0.04]" loading="lazy" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/98" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
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
              Wujudkan <span className="text-gradient-secondary">Ide</span> Anda
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-base"
            >
              Isi formulir di bawah dan tim kami akan menghubungi Anda dalam 24 jam.
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-8 md:p-10 shadow-2xl shadow-primary/5"
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

            <div>
              <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Pilih Paket</label>
              <select {...register("packageType")} className={inputClasses}>
                <option value="">— Pilih Paket —</option>
                {PRICING_PACKAGES.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} — Rp {pkg.price}
                  </option>
                ))}
              </select>
              {errors.packageType && <p className="mt-1.5 text-xs text-destructive">{errors.packageType.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Detail Kebutuhan</label>
              <textarea
                {...register("details")}
                rows={4}
                className={`${inputClasses} resize-none`}
                placeholder="Ceritakan kebutuhan proyek Anda..."
              />
              {errors.details && <p className="mt-1.5 text-xs text-destructive">{errors.details.message}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 0 25px rgba(180,140,40,0.2)" }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-secondary text-accent-foreground font-bold text-sm transition-all disabled:opacity-50"
            >
              <Send size={15} />
              Kirim Pesanan
              <ArrowRight size={15} />
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
