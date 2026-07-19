'use client'

import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import logoImg from "../../public/assets/logo-circle.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  {
    label: "About",
    href: "/about",
    submenu: [
      { label: "About Us", href: "/about" },
      { label: "Ketentuan", href: "/about#ketentuan" },
    ]
  },
  { label: "Order", href: "/order" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-card/80 backdrop-blur-2xl border-b border-border/30 shadow-lg shadow-background/30"
          : "bg-transparent"
        }`}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.img
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
            src={logoImg.src}
            alt="Monark Studio"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-accent/40 transition-all"
          />
          <span className="text-lg font-display font-bold text-foreground">
            Monark<span className="text-accent">.</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {mounted ? (
            navLinks.map((l) => {
              const hasSubmenu = 'submenu' in l && l.submenu;

              if (hasSubmenu) {
                return (
                  <div
                    key={l.href}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(l.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className="relative px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors group flex items-center gap-1"
                    >
                      {l.label}
                      <ChevronDown className="w-3 h-3" />
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-4/5 h-[2px] bg-accent rounded-full transition-all duration-300" />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === l.label && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full mt-2 left-0 min-w-[160px] bg-card/95 backdrop-blur-2xl border border-border/30 rounded-lg shadow-lg overflow-hidden"
                        >
                          {l.submenu?.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="relative px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  {l.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-4/5 h-[2px] bg-accent rounded-full transition-all duration-300" />
                </Link>
              );
            })
          ) : (
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="px-4 py-2 w-20 h-8 rounded-lg bg-secondary/20 animate-pulse" />
              ))}
            </div>
          )}

          <Link
            href="/#order"
            className="ml-3 px-5 py-2 rounded-lg bg-gradient-secondary text-accent-foreground text-sm font-bold transition-all hover:scale-[1.03] active:scale-[0.97] inline-block"
          >
            Mulai Proyek
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card/95 backdrop-blur-2xl border-t border-border/30 overflow-hidden"
          >
            <div className="container mx-auto flex flex-col gap-1 py-4 px-4">
              {mounted && navLinks.map((l) => {
                const hasSubmenu = 'submenu' in l && l.submenu;

                if (hasSubmenu) {
                  const isSubmenuOpen = mobileSubmenuOpen === l.label;

                  return (
                    <div key={l.href}>
                      <button
                        onClick={() => setMobileSubmenuOpen(isSubmenuOpen ? null : l.label)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                      >
                        <span>{l.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${isSubmenuOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {isSubmenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden ml-4 mt-1"
                          >
                            {l.submenu?.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => {
                                  setOpen(false);
                                  setMobileSubmenuOpen(null);
                                }}
                                className="block px-4 py-2.5 rounded-lg text-sm text-muted-foreground/80 hover:text-foreground hover:bg-secondary/30 transition-all"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                  >
                    {l.label}
                  </Link>
                );
              })}

              <Link
                href="/#order"
                onClick={() => setOpen(false)}
                className="mt-2 px-5 py-3 rounded-lg bg-gradient-secondary text-accent-foreground text-sm font-bold text-center"
              >
                Mulai Proyek
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
