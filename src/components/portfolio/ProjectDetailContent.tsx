"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Globe, Calendar, User, CheckCircle2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { Highlighter } from "@/components/magicui/text-highlighter"
import { BlurFade } from "@/components/magicui/blur-fade"
import { BorderBeam } from "@/components/magicui/border-beam"
import { Backlight } from "../magicui/backlight"
import { getStoragePublicUrl } from "@/lib/storage-url"

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
  full_description: string | null
  type: 'WEB' | 'MOBILE'
  image_url: string
  gallery: string[]
  stacks: TechStack[]
  features: string[]
  client_name: string | null
  project_url: string | null
  role: string | null
  status: string | null
  start_date: string | null
  end_date: string | null
}

interface ProjectDetailContentProps {
  project: PortfolioProject
  nextProject?: {
    id: string
    title: string
    image_url: string
  } | null
}

export default function ProjectDetailContent({ project, nextProject }: ProjectDetailContentProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric'
    })
  }

  const duration = () => {
    const start = formatDate(project.start_date)
    const end = project.status === 'Live' ? formatDate(project.end_date) : 'Sekarang'
    if (!start) return null
    return `${start} — ${end || 'Sekarang'}`
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/portfolio"
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-accent/40 transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Kembali ke Portfolio
          </Link>

          {project.project_url && (
            <Link href={project.project_url} target="_blank">
              <ShimmerButton className="h-10 px-6 text-xs font-bold uppercase tracking-widest">
                Kunjungi Website <ExternalLink size={12} className="ml-2" />
              </ShimmerButton>
            </Link>
          )}
        </div>
      </nav>

      <main className="pt-32">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid lg:grid-cols-[1fr_380px] gap-16 items-start">

            {/* LEFT CONTENT */}
            <div className="space-y-12">
              {/* Hero Info */}
              <section>
                <BlurFade delay={0.1}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-bold uppercase tracking-widest text-accent mb-6">
                    <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                    {project.type === 'WEB' ? 'Website Case Study' : 'Mobile App Case Study'}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-[1.1] mb-8">
                    {project.title.split(' ').slice(0, -1).join(' ')}{' '}
                    <Highlighter action="underline" color="#C69B28" isView={true}>
                      {project.title.split(' ').pop()}
                    </Highlighter>
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                    {project.description}
                  </p>
                </BlurFade>
              </section>

              {/* Main Image */}
              <BlurFade delay={0.2}>
                <Backlight blur={20} className="w-full h-full">
                  <div className="relative rounded-3xl aspect-[4/2] overflow-hidden">
                    <img
                      src={getStoragePublicUrl(project.image_url)}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </Backlight>
              </BlurFade>

              {/* Full Description Section */}
              {project.full_description && (
                <section className="space-y-6">
                  <BlurFade delay={0.25}>
                    <h2 className="text-2xl font-display font-bold">Tentang Proyek</h2>
                    <div className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap space-y-4">
                      {project.full_description}
                    </div>
                  </BlurFade>
                </section>
              )}

              {/* Features Section */}
              {project.features.length > 0 && (
                <section className="space-y-8">
                  <BlurFade delay={0.3}>
                    <h2 className="text-2xl font-display font-bold">Fitur Utama</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {project.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-3 p-5 rounded-2xl bg-white/5 border border-white/10">
                          <CheckCircle2 size={18} className="text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-sm font-medium leading-relaxed">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </BlurFade>
                </section>
              )}

              {/* Gallery Section */}
              {project.gallery.length > 0 && (
                <GallerySection project={project} />
              )}
            </div>

            {/* RIGHT SIDEBAR (Quick Info) */}
            <aside className="lg:sticky lg:top-32 space-y-8">
              <BlurFade delay={0.2}>
                <div className="rounded-3xl p-8 bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-8 shadow-xl">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Status</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase">
                      {project.status || 'Live'}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {/* Role */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User size={14} className="text-accent" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Peran Kami</span>
                      </div>
                      <p className="text-sm font-bold">{project.role || 'Fullstack Development'}</p>
                    </div>

                    {/* Client */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe size={14} className="text-accent" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Klien</span>
                      </div>
                      <p className="text-sm font-bold">{project.client_name || 'Project Personal'}</p>
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={14} className="text-accent" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Waktu Pengerjaan</span>
                      </div>
                      <p className="text-sm font-bold">{duration() || 'Selesai'}</p>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="pt-8 border-t border-white/5 space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground block">Teknologi</span>
                    <div className="flex flex-wrap gap-3">
                      {project.stacks.map(stack => (
                        <motion.div
                          key={stack.id}
                          title={stack.name}
                          whileHover={{
                            scale: 1.15,
                            rotate: 5,
                            boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2.5 hover:border-accent/60 hover:bg-white/10 cursor-help transition-colors"
                          style={{ borderColor: stack.color_hex ? `${stack.color_hex}40` : undefined }}
                        >
                          {stack.icon_url && (stack.icon_url.trimStart().startsWith('<svg') || stack.icon_url.trimStart().startsWith('<?xml')) ? (
                            <div
                              className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                              dangerouslySetInnerHTML={{ __html: stack.icon_url }}
                            />
                          ) : stack.icon_url ? (
                            <img src={getStoragePublicUrl(stack.icon_url)} alt={stack.name} className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full rounded-full bg-accent/20" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </BlurFade>
            </aside>

          </div>

          {/* Next Project Navigation */}
          {nextProject && (
            <section className="mt-32 pt-20 border-t border-white/5">
              <BlurFade delay={0.5}>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent block mb-8 text-center">Eksplorasi Lebih Lanjut</span>
                <Link href={`/portfolio/${nextProject.id}`} className="group relative block w-full aspect-[21/9] md:aspect-[32/10] rounded-3xl overflow-hidden border border-white/10">
                  <img
                    src={getStoragePublicUrl(nextProject.image_url)}
                    alt={nextProject.title}
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 group-hover:text-accent transition-colors">Proyek Berikutnya</span>
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground">
                      {nextProject.title}
                    </h2>
                    <div className="mt-8 p-4 rounded-full bg-white/5 border border-white/10 group-hover:bg-accent group-hover:text-background transition-all">
                      <ExternalLink size={24} />
                    </div>
                  </div>
                </Link>
              </BlurFade>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

/* ─── Gallery Section with adaptive masonry layout ─── */
function GallerySection({ project }: { project: PortfolioProject }) {
  const [orientations, setOrientations] = useState<Record<number, 'portrait' | 'landscape'>>({})
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const handleImageLoad = useCallback((index: number, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const orientation = img.naturalHeight > img.naturalWidth ? 'portrait' : 'landscape'
    setOrientations(prev => ({ ...prev, [index]: orientation }))
  }, [])

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const goNext = () => setLightboxIndex(prev => prev !== null ? (prev + 1) % project.gallery.length : null)
  const goPrev = () => setLightboxIndex(prev => prev !== null ? (prev - 1 + project.gallery.length) % project.gallery.length : null)

  return (
    <section className="space-y-8">
      <BlurFade delay={0.4}>
        <h2 className="text-2xl mb-12 font-display font-bold">Visual Showcase</h2>

        {/* Adaptive masonry grid */}
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {project.gallery.map((img, i) => {
            const orientation = orientations[i]
            const isPortrait = orientation === 'portrait'

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.5 }}
                className="break-inside-avoid cursor-pointer group"
                onClick={() => openLightbox(i)}
              >
                <Backlight blur={20} className="w-full">
                  <div className={`relative rounded-2xl overflow-hidden ${
                    isPortrait ? 'aspect-[3/4]' : 'aspect-video'
                  }`}>
                    <img
                      src={getStoragePublicUrl(img)}
                      alt={`${project.title} screenshot ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onLoad={(e) => handleImageLoad(i, e)}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </Backlight>
              </motion.div>
            )
          })}
        </div>
      </BlurFade>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={closeLightbox}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Prev button */}
            {project.gallery.length > 1 && (
              <button
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                onClick={(e) => { e.stopPropagation(); goPrev() }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}

            {/* Next button */}
            {project.gallery.length > 1 && (
              <button
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                onClick={(e) => { e.stopPropagation(); goNext() }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={getStoragePublicUrl(project.gallery[lightboxIndex])}
              alt={`${project.title} screenshot ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium backdrop-blur-sm">
              {lightboxIndex + 1} / {project.gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
