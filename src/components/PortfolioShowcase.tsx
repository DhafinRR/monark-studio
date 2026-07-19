'use client'

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Highlighter } from "./magicui/text-highlighter";
import { Backlight } from "./magicui/backlight";
import { getStoragePublicUrl } from "@/lib/storage-url";

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
}

interface PortfolioShowcaseProps {
  projects: PortfolioProject[]
}

export default function PortfolioShowcase({ projects }: PortfolioShowcaseProps) {
  return (
    <section id="portfolio" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-semibold tracking-[0.2em] uppercase bg-accent/10 text-accent border border-accent/20 mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Portfolio
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-bold text-foreground mb-5"
          >
            Karya<Highlighter action="underline" color="#C69B28" isView={true}> <span className="text-gradient-secondary">Terbaik</span></Highlighter> Kami
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-md mx-auto text-base"
          >
            Beberapa proyek yang telah kami selesaikan untuk klien dari berbagai industri.
          </motion.p>
        </div>

        {/* Portfolio items — alternating layout */}
        <div className="max-w-6xl mx-auto space-y-20">
          {projects.map((project, i) => {
            const isEven = i % 2 === 0;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1, type: "spring", stiffness: 80 }}
                className="relative"
              >
                <div className="relative">
                  {/* Image — 58% width, positioned left or right */}
                  <Backlight blur={40} className="w-full">
                    <div className={`relative overflow-hidden rounded-2xl md:w-[58%] ${isEven ? 'md:mr-auto' : 'md:ml-auto'
                      }`}>
                      <div className="aspect-video">
                        <img
                          src={getStoragePublicUrl(project.image_url)}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
                    </div>
                  </Backlight>

                  {/* Content — 58% width, overlaps ~1/3 of image */}
                  <div className={`relative flex flex-col z-10 md:absolute md:top-1/2 md:-translate-y-1/2 md:w-[58%] ${isEven ? 'md:right-0 items-end' : 'md:left-0 items-start'
                    }`}>
                    {/* Type + Title */}
                    <div className={`mb-4 mt-4 md:w-2/3 md:mt-0 ${isEven ? 'md:text-right md:right-0' : 'md:text-left md:left-0'}`}>
                      <span className="text-accent text-sm font-semibold tracking-wide">
                        {project.type === 'WEB' ? 'Website' : 'Mobile App'}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-1">
                        {project.title}
                      </h3>
                    </div>

                    {/* Description card */}
                    <div className="bg-primary/95 backdrop-blur-sm text-primary-foreground p-6 md:p-8 rounded-2xl shadow-lg">
                      <p className="text-sm md:text-base leading-relaxed opacity-90">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech stacks + link */}
                    <div className={`flex flex-wrap items-center gap-2 mt-5 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                      {project.stacks.map((stack) => (
                        <span
                          key={stack.id}
                          className="text-[11px] px-3 py-1.5 rounded-full font-semibold border"
                          style={{
                            backgroundColor: `${stack.color_hex || '#C69B28'}20`,
                            color: stack.color_hex || 'hsl(var(--accent))',
                            borderColor: `${stack.color_hex || '#C69B28'}35`,
                          }}
                        >
                          {stack.name}
                        </span>
                      ))}
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 p-2 rounded-full text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                        >
                          <ArrowUpRight size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Belum ada portfolio.</p>
          </div>
        )}
      </div>
    </section>
  );
}
