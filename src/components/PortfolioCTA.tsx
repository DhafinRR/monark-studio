'use client'

import Link from 'next/link'
import { BlurFade } from '@/components/magicui/blur-fade'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { useLanguage } from '@/lib/LanguageContext'

export default function PortfolioCTA() {
  const { t } = useLanguage()
  
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <BlurFade delay={0.1} inView>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-5">
            {t("portfolioPage.ctaTitle1")} <span className="text-gradient-secondary">{t("portfolioPage.ctaTitleHighlight")}</span>{t("portfolioPage.ctaTitle2")}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-base mb-10">
            {t("portfolioPage.ctaDesc")}
          </p>
          <Link href="/#order">
            <ShimmerButton
              className="mx-auto"
              shimmerColor="hsl(38 75% 55%)"
              shimmerSize="0.1em"
              background="hsl(153 40% 18%)"
            >
              <span className="text-sm font-bold tracking-wider uppercase text-primary-foreground">
                {t("portfolioPage.ctaButton")}
              </span>
            </ShimmerButton>
          </Link>
        </BlurFade>
      </div>
    </section>
  )
}
