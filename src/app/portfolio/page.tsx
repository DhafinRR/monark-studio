import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ParticleField from '@/components/ParticleField'
import { BlurFade } from '@/components/magicui/blur-fade'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import PortfolioContent from '@/components/PortfolioContent'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  const projects = await prisma.portfolioProject.findMany({
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      image_url: true,
      project_url: true,
      created_at: true,
      stacks: {
        select: {
          id: true,
          name: true,
          icon_url: true,
          color_hex: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-background relative">
      <div className="relative">
        <ParticleField />
      </div>
      <Navbar />

      <PortfolioContent initialProjects={projects} />

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <BlurFade delay={0.1} inView>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-5">
              Punya Ide <span className="text-gradient-secondary">Proyek</span>?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-base mb-10">
              Mari wujudkan visi digital Anda bersama kami.
            </p>
            <Link href="/#order">
              <ShimmerButton
                className="mx-auto"
                shimmerColor="hsl(38 75% 55%)"
                shimmerSize="0.1em"
                background="hsl(153 40% 18%)"
              >
                <span className="text-sm font-bold tracking-wider uppercase text-primary-foreground">
                  Mulai Proyek
                </span>
              </ShimmerButton>
            </Link>
          </BlurFade>
        </div>
      </section>

      <Footer />
    </div>
  )
}
