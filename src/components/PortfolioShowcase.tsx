import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { getPortfolio } from "@/lib/store";

export default function PortfolioShowcase() {
  const projects = getPortfolio();

  return (
    <section id="portfolio" className="relative py-28 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-mesh opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
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
            Karya <span className="text-gradient-secondary">Terbaik</span> Kami
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-accent/30 transition-all duration-500 hover:shadow-xl hover:shadow-accent/5"
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                {/* Hover overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-primary/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
                >
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-card/90 border border-border text-foreground text-sm font-semibold flex items-center gap-2 hover:bg-card transition-colors"
                  >
                    Lihat Detail <ArrowUpRight size={14} />
                  </a>
                </motion.div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-bold text-foreground group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    <ExternalLink size={15} />
                  </a>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
