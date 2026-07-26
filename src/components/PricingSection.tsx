"use client"

import { useState, useEffect, useRef } from "react";
import { PRICING_PACKAGES } from "@/config/pricing";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PricingCard from "./PricingCard";
import patternBg from "../../public/assets/pattern-bg.jpg"
import { Highlighter } from "./magicui/text-highlighter";

interface DBPackage {
  id: string
  name: string
  tagline: string | null
  target: string | null
  price_note: string | null
  floor_price: string
  max_slots: number
  benefits: string[]
  default_features: string[]
  is_popular: boolean
}

import { useLanguage } from "@/lib/LanguageContext";

export default function PricingSection() {
  const { t } = useLanguage();
  const [packages, setPackages] = useState<DBPackage[]>([])
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetch("/api/public/pricing-packages")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setPackages(data)
      })
  }, [])

  // Map DB packages to PricingCard format, fallback to static config
  const displayPackages = packages.length > 0
    ? packages.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        tagline: pkg.tagline || "",
        target: pkg.target || "",
        priceNote: pkg.price_note || "Mulai dari",
        price: Number(pkg.floor_price).toLocaleString("id-ID"),
        floorPrice: Number(pkg.floor_price),
        highlighted: pkg.is_popular,
        benefits: pkg.benefits,
        features: pkg.default_features,
      }))
    : PRICING_PACKAGES.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        tagline: pkg.tagline,
        target: pkg.target,
        priceNote: pkg.priceNote,
        price: pkg.price,
        floorPrice: parseInt(pkg.price.replace(/\./g, "")),
        highlighted: pkg.highlighted,
        benefits: pkg.features.map(f => f.text),
        features: pkg.defaultFeatures,
      }))

  return (
    <section id="pricing" className="relative py-28 overflow-hidden">
      {/* Background image with heavy overlay */}
      <div className="absolute inset-0">
        <img src={patternBg.src} alt="" className="w-full h-full object-cover opacity-[0.06]" loading="lazy" width={1920} height={800} />
        <div className="absolute inset-0 bg-background/95" />
      </div>

      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* Decorative elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -right-40 w-[500px] h-[500px] border border-primary/5 rounded-full"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-semibold tracking-[0.2em] uppercase bg-accent/10 text-accent border border-accent/20 mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {t("pricing.badge")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-bold text-foreground mb-5"
          >
            {t("pricing.title1")}{" "}
            <Highlighter action="highlight" iterations={3} color="#C69B28" isView={true}>
              <span className="text-secondary">{t("pricing.titleHighlight")}</span>
            </Highlighter>{" "}
            {t("pricing.title2")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-md mx-auto text-base"
          >
            {t("pricing.subtitle")}
          </motion.p>
        </div>

        {displayPackages.length > 3 ? (
          <div className="relative max-w-7xl mx-auto">
            {/* Scroll navigation arrows */}
            <div className="flex justify-end items-center gap-3 mb-6 px-2">
              <button
                onClick={() => handleScroll("left")}
                className="w-10 h-10 rounded-full border border-border/80 bg-card/80 backdrop-blur hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center justify-center transition-all shadow-md active:scale-95 text-foreground"
                aria-label="Previous pricing plans"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="w-10 h-10 rounded-full border border-border/80 bg-card/80 backdrop-blur hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center justify-center transition-all shadow-md active:scale-95 text-foreground"
                aria-label="Next pricing plans"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Horizontal scroll container */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-10 px-4 scroll-smooth no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {displayPackages.map((pkg, i) => (
                <div key={pkg.id} className="w-[310px] sm:w-[340px] md:w-[360px] shrink-0 snap-center flex flex-col pt-4">
                  <PricingCard pkg={pkg} index={i} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-6">
            {displayPackages.map((pkg, i) => (
              <PricingCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
