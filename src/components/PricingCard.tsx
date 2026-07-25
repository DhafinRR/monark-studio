import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/lib/LanguageContext";

interface DisplayPackage {
  id: string
  name: string
  tagline: string
  target: string
  priceNote: string
  price: string
  floorPrice?: number
  highlighted?: boolean
  benefits: string[]
  features: string[]
}

interface PricingCardProps {
  pkg: DisplayPackage;
  index: number;
}

export default function PricingCard({ pkg, index }: PricingCardProps) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6, type: "spring" }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`relative group overflow-visible ${
        pkg.highlighted ? "md:-mt-4 md:mb-4" : ""
      }`}
    >
      {/* Glow effect for highlighted */}
      {pkg.highlighted && (
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-secondary opacity-60 blur-sm group-hover:opacity-80 transition-opacity" />
      )}

      <div
        className={`relative rounded-2xl p-px ${
          pkg.highlighted
            ? "bg-gradient-secondary"
            : "bg-border/60 group-hover:bg-primary/30"
        } transition-all duration-500`}
      >
        <div className="relative rounded-[15px] bg-card p-8 h-full flex flex-col">
          {/* Popular badge */}
          {pkg.highlighted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
            >
              <span className="flex items-center gap-1.5 px-5 py-1.5 text-[10px] font-bold tracking-wider uppercase bg-gradient-secondary text-accent-foreground rounded-full shadow-lg whitespace-nowrap">
                <Crown size={11} />
                {t("pricingCard.popular")}
              </span>
            </motion.div>
          )}

          {/* Package icon/tier */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
            pkg.highlighted
              ? "bg-gradient-secondary text-accent-foreground"
              : "bg-primary/10 text-primary"
          }`}>
            <Sparkles size={20} />
          </div>

          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-1">
            {pkg.target}
          </p>
          <h3 className="text-xl font-display font-bold text-foreground mb-2">
            {pkg.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow-0">
            {pkg.tagline}
          </p>

          <div className="mb-6">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{pkg.priceNote}</span>
            {pkg.id === 'mobile_app' && pkg.floorPrice ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-3xl font-display font-bold text-gradient-secondary mt-0.5 flex items-center gap-2 cursor-help">
                      Rp {pkg.price}
                      <Info size={16} className="text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {t("pricingCard.mobileTooltip")} <br />
                      <span className="font-bold">Rp {(pkg.floorPrice * 1.8).toLocaleString('id-ID')}</span>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="text-3xl font-display font-bold text-gradient-secondary mt-0.5">
                Rp {pkg.price}
              </div>
            )}
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

          <ul className="space-y-3 mb-8 flex-1">
            {pkg.benefits.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 + i * 0.04 }}
                className="flex items-start gap-3 text-sm text-secondary-foreground"
              >
                <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  pkg.highlighted
                    ? "bg-gradient-secondary text-accent-foreground"
                    : "bg-primary/10 text-primary"
                }`}>
                  <Check size={11} strokeWidth={3} />
                </div>
                {f}
              </motion.li>
            ))}
          </ul>
          <h3 className="text-xl font-display font-bold text-foreground mb-2">
            {t("pricingCard.standardFeatures")}
          </h3>
          <h5 className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow-0">{t("pricingCard.customizable")}</h5>
          <ul className="space-y-3 mb-8 flex-1">
            {pkg.features.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 + i * 0.04 }}
                className="flex items-start gap-3 text-sm text-secondary-foreground"
              >
                <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  pkg.highlighted
                    ? "bg-gradient-secondary text-accent-foreground"
                    : "bg-primary/10 text-primary"
                }`}>
                  <Check size={11} strokeWidth={3} />
                </div>
                {f}
              </motion.li>
            ))}
          </ul>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#order"
            className={`block text-center py-3.5 rounded-xl font-bold text-sm transition-all ${
              pkg.highlighted
                ? "bg-gradient-secondary text-accent-foreground shadow-glow-accent hover:opacity-90"
                : "border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
            }`}
          >
            {t("pricingCard.orderNow")}
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
