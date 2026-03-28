'use client'

import { Heart, ArrowUpRight } from "lucide-react";
import Link from 'next/link';
import { motion } from "framer-motion";
import logoImg from "../../public/assets/logo.jpg";

const footerLinks = [
  { label: "Layanan", href: "#pricing" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Order", href: "#order" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border/30 bg-primary/[0.03]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img src={logoImg} alt="Monark Studio" className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20" />
              <span className="text-lg font-display font-bold text-foreground">
                Monark<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Kami membantu bisnis Anda hadir secara digital dengan website dan aplikasi berkualitas tinggi.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-3">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1 group">
                    {l.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Kontak</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/6281322639234"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  WhatsApp: 081322639234
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}{" "}
            <span className="font-display font-bold text-foreground">Monark Studio</span>
            . All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart size={11} className="text-destructive" /> in Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
