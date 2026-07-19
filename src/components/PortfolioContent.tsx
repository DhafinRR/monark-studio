'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Filter } from 'lucide-react'
import Link from 'next/link'
import { BlurFade } from '@/components/magicui/blur-fade'
import { MagicCard } from '@/components/magicui/magic-card'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { BorderBeam } from '@/components/magicui/border-beam'
import { Highlighter } from '@/components/magicui/text-highlighter'
import { getStoragePublicUrl } from '@/lib/storage-url'

interface TechStack {
  id: string
  name: string
  icon_url: string | null
  color_hex: string | null
}

interface PortfolioProject {
  id: string
  title: string
  description: string
  type: 'WEB' | 'MOBILE'
  image_url: string
  stacks: TechStack[]
  project_url: string | null
  created_at: Date
}

type FilterType = 'ALL' | 'WEB' | 'MOBILE'

interface PortfolioContentProps {
  initialProjects: PortfolioProject[]
}

export default function PortfolioContent({ initialProjects }: PortfolioContentProps) {
  const [filter, setFilter] = useState<FilterType>('ALL')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filtered = filter === 'ALL'
    ? initialProjects
    : initialProjects.filter(p => p.type === filter)

  // Staggered layout pattern: [full, half+half, full, half+half, ...]
  const getLayoutItems = useCallback(() => {
    const items: { project: PortfolioProject; span: 'full' | 'half'; index: number }[] = []
    let pos = 0
    filtered.forEach((project, i) => {
      const cycle = pos % 3
      const span = cycle === 0 ? 'full' : 'half'
      items.push({ project, span, index: i })
      pos++
    })
    return items
  }, [filtered])

  const layoutItems = getLayoutItems()

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-30" />
        <div className="absolute inset-0 grid-pattern opacity-40" />

        <div className="container mx-auto px-4 relative z-10">
          <BlurFade delay={0.1} inView>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-semibold tracking-[0.2em] uppercase bg-accent/10 text-accent border border-accent/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Portfolio
              </span>
            </div>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-foreground leading-[0.9] mb-6">
              Karya<br />
              <Highlighter action='highlight' color='#C69B28'>Terbaik</Highlighter> Kami
              <span className="text-accent">.</span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <div className="flex items-end justify-between gap-8 mt-10">
              <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
                Setiap proyek adalah kolaborasi unik yang kami rancang dengan dedikasi penuh untuk klien dari berbagai industri.
              </p>

              <div className="hidden md:flex items-center gap-6">
                <div className="text-right">
                  <div className="text-5xl font-display font-bold text-foreground">
                    <NumberTicker value={initialProjects.length} delay={0.5} />
                    <span className="text-accent">+</span>
                  </div>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                    Projects
                  </span>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-right">
                  <div className="text-5xl font-display font-bold text-foreground">
                    <NumberTicker value={initialProjects.filter(p => p.type === 'WEB').length} delay={0.7} />
                  </div>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                    Website
                  </span>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-right">
                  <div className="text-5xl font-display font-bold text-foreground">
                    <NumberTicker value={initialProjects.filter(p => p.type === 'MOBILE').length} delay={0.9} />
                  </div>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                    Mobile
                  </span>
                </div>
              </div>
            </div>
          </BlurFade>

          {/* Filter */}
          <BlurFade delay={0.4} inView>
            <div className="flex items-center gap-3 mt-14">
              <Filter size={14} className="text-muted-foreground" />
              {(['ALL', 'WEB', 'MOBILE'] as FilterType[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                    filter === f
                      ? 'bg-primary text-primary-foreground shadow-glow'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {f === 'ALL' ? 'Semua' : f === 'WEB' ? 'Website' : 'Mobile'}
                </button>
              ))}
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Decorative line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* Portfolio Grid */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-10" />

        <div className="container mx-auto px-4 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {layoutItems.map(({ project, span, index }) => (
                <BlurFade
                  key={project.id}
                  delay={0.05 * Math.min(index, 8)}
                  inView
                  className={span === 'full' ? 'md:col-span-2' : 'md:col-span-1'}
                >
                  <Link href={`/portfolio/${project.id}`}>
                    <MagicCard
                      className="relative rounded-2xl border border-border/60 bg-card overflow-hidden cursor-pointer transition-all duration-500 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5"
                      gradientColor="hsl(38 75% 45% / 0.12)"
                      gradientSize={span === 'full' ? 400 : 250}
                      onMouseEnter={() => setHoveredId(project.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* Border beam on hover */}
                      {hoveredId === project.id && (
                        <BorderBeam
                          size={span === 'full' ? 300 : 200}
                          duration={10}
                          colorFrom="hsl(38 75% 45%)"
                          colorTo="hsl(153 40% 28%)"
                        />
                      )}

                      {/* Editorial number */}
                      <div className="absolute top-6 left-6 z-20">
                        <span className="text-6xl md:text-7xl font-display font-bold text-foreground/[0.04] leading-none select-none">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Type badge */}
                      <div className="absolute top-5 right-5 z-20">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                          project.type === 'WEB'
                            ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                            : 'bg-violet-500/10 text-violet-700 border-violet-500/20'
                        }`}>
                          {project.type === 'WEB' ? 'Website' : 'Mobile'}
                        </span>
                      </div>

                      {/* Image */}
                      <div className={`relative overflow-hidden ${span === 'full' ? 'aspect-[21/9]' : 'aspect-video'}`}>
                        <motion.img
                          src={getStoragePublicUrl(project.image_url)}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.7, ease: 'easeOut' }}
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

                        {/* Hover overlay with arrow */}
                        <motion.div
                          className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: hoveredId === project.id ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div
                            className="w-14 h-14 rounded-full bg-card/90 border border-border flex items-center justify-center shadow-lg"
                            initial={{ scale: 0.5 }}
                            animate={{ scale: hoveredId === project.id ? 1 : 0.5 }}
                            transition={{ duration: 0.3, type: 'spring' }}
                          >
                            <ArrowUpRight size={20} className="text-foreground" />
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="p-6 md:p-8">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className={`font-display font-bold text-foreground group-hover:text-accent transition-colors ${
                            span === 'full' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
                          }`}>
                            {project.title}
                          </h3>
                        </div>

                        <p className={`text-muted-foreground leading-relaxed mb-5 ${
                          span === 'full' ? 'text-base max-w-2xl' : 'text-sm line-clamp-2'
                        }`}>
                          {project.description}
                        </p>

                        {/* Tech stacks */}
                        <div className="flex flex-wrap gap-2">
                          {project.stacks.slice(0, span === 'full' ? 8 : 4).map((stack) => (
                            <span
                              key={stack.id}
                              className="text-[10px] px-3 py-1 rounded-full font-semibold border"
                              style={{
                                backgroundColor: `${stack.color_hex || '#C69B28'}15`,
                                color: stack.color_hex || 'hsl(var(--accent))',
                                borderColor: `${stack.color_hex || '#C69B28'}30`,
                              }}
                            >
                              {stack.name}
                            </span>
                          ))}
                          {project.stacks.length > (span === 'full' ? 8 : 4) && (
                            <span className="text-[10px] px-3 py-1 rounded-full font-semibold bg-secondary text-muted-foreground">
                              +{project.stacks.length - (span === 'full' ? 8 : 4)}
                            </span>
                          )}
                        </div>
                      </div>
                    </MagicCard>
                  </Link>
                </BlurFade>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-32">
              <p className="text-muted-foreground text-lg">Belum ada portfolio untuk kategori ini.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
