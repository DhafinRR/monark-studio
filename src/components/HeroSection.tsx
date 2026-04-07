'use client'

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Globe, Smartphone, Palette } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Highlighter } from "./magicui/text-highlighter";

/* ─── Typed words ─── */
const WORDS = ["Website", "Mobile App", "Web App", "E-Commerce"];

function useTypingEffect() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[idx];
    const speed = deleting ? 38 : 95;
    const t = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, text.length + 1));
        if (text === word) setTimeout(() => setDeleting(true), 2400);
      } else {
        setText(word.slice(0, text.length - 1));
        if (text === "") {
          setDeleting(false);
          setIdx((p) => (p + 1) % WORDS.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, idx]);

  return text;
}

const STATS = [
  { val: "50+", label: "Proyek" },
  { val: "30+", label: "Klien" },
  { val: "99%", label: "Uptime" },
];

const SERVICES = [
  { Icon: Globe, title: "Website", desc: "Landing page & web app", pos: "left-0 top-12" },
  { Icon: Smartphone, title: "Mobile App", desc: "iOS & Android native", pos: "right-0 top-[38%]" },
  { Icon: Palette, title: "UI/UX Design", desc: "Design konversi tinggi", pos: "left-4 bottom-16" },
];

export default function HeroSection() {
  const typed = useTypingEffect();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Baris yang error sudah diperbaiki di sini:
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const opac = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#FAFAFA" }}
    >
      {/* ── Background: pure CSS, zero images ── */}

      {/* Gold bloom — top-left */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 60% at -5% 10%, rgba(198,155,40,0.06) 0%, transparent 70%)",
      }} />

      {/* Blue bloom — bottom-right */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 50% at 105% 90%, rgba(100,100,255,0.03) 0%, transparent 65%)",
      }} />

      {/* Hairline grid */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }} />

      {/* Film grain */}
      <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "200px",
      }} />

      {/* Vertical gold rail */}
      <div aria-hidden className="absolute left-16 top-0 bottom-0 w-px pointer-events-none hidden xl:block" style={{
        background: "linear-gradient(to bottom, transparent, rgba(198,155,40,0.15) 30%, rgba(198,155,40,0.15) 70%, transparent)",
      }} />

      {/* ── Content ── */}
      <motion.div style={{ y: yText, opacity: opac }} className="relative z-10 w-full">
        <div className="container mx-auto px-6 xl:px-20 py-28">
          <div className="grid lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_520px] gap-12 xl:gap-20 items-center">

            {/* LEFT */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mb-10 flex items-center gap-3"
              >
                <span className="block w-6 h-px" style={{ background: "rgba(198,155,40,0.6)" }} />
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase",
                  color: "#A07820", fontFamily: "'DM Sans', sans-serif",
                }}>
                  Digital Agency
                </span>
                <span className="relative flex h-1.5 w-1.5 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C69B28] opacity-60" />
                  <span className="relative rounded-full h-1.5 w-1.5 bg-[#C69B28]" />
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: "clamp(3.2rem, 6.5vw, 6rem)",
                  fontWeight: 700, lineHeight: 1.03, letterSpacing: "-0.025em",
                  color: "#111827",
                }}
              >
                Kami Bangun
                <br />
                <span style={{ position: "relative", display: "inline-block" }}>
                  <span style={{
                    background: "linear-gradient(120deg, #B08020 0%, #D4A330 55%, #8B6510 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>
                    {typed}
                  </span>
                  <motion.span
                    animate={{ opacity: [0, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                    style={{
                      display: "inline-block", width: 3, marginLeft: 4,
                      height: "0.75em", verticalAlign: "middle", borderRadius: 2, background: "#C69B28",
                    }}
                  />
                  <motion.span
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: "absolute", bottom: -4, left: 0, right: 0, height: 1.5, borderRadius: 2,
                      background: "linear-gradient(90deg, #C69B28 0%, rgba(198,155,40,0.0) 100%)",
                    }}
                  />
                </span>
                <br />
                <span style={{
                  color: "#6B7280", fontWeight: 400,
                  fontSize: "clamp(2.2rem, 4.5vw, 4.2rem)", letterSpacing: "-0.015em",
                }}>
                  untuk Bisnis Anda
                </span>
              </motion.h1>

              {/* Body copy */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.78,
                  color: "#4B5563", maxWidth: 480,
                  marginTop: 28, marginBottom: 40, fontWeight: 400, letterSpacing: "0.01em",
                }}
              >
                Dari landing page sederhana hingga aplikasi mobile custom — solusi digital yang{" "}
                <Highlighter action="underline" color="#C69B28" isView={true}>cepat</Highlighter>,{" "}
                <Highlighter action="circle" color="#214533" isView={true}>scalable</Highlighter>
                {" "}dan berperforma tinggi.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32 }}
                className="flex flex-wrap gap-3 mb-16"
              >
                <motion.a
                  href="#pricing"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.975 }}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-6 py-3.5"
                  style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                    letterSpacing: "0.02em", color: "#1C1200",
                    background: "linear-gradient(135deg, #C69B28 0%, #E8C040 60%, #B08020 100%)",
                    boxShadow: "0 0 0 1px rgba(198,155,40,0.4), 0 6px 20px rgba(198,155,40,0.2)",
                  }}
                >
                  <motion.span
                    className="absolute inset-0 -skew-x-12"
                    style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)" }}
                    animate={{ x: ["-120%", "120%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5 }}
                  />
                  <span className="relative">Lihat Paket Harga</span>
                  <ArrowUpRight size={14} className="relative group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </motion.a>

                <motion.a
                  href="#portfolio"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.975 }}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 transition-all duration-300"
                  style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                    letterSpacing: "0.02em", color: "#4B5563",
                    border: "1px solid rgba(0,0,0,0.1)", background: "rgba(0,0,0,0.02)",
                  }}
                >
                  Lihat Portfolio
                </motion.a>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-start gap-10"
                style={{ paddingTop: 24, borderTop: "1px solid rgba(0,0,0,0.08)" }}
              >
                {STATS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.07 }}
                  >
                    <div style={{
                      fontFamily: "'Cormorant Garamond', serif", fontSize: "2.6rem",
                      fontWeight: 700, lineHeight: 1,
                      background: "linear-gradient(135deg, #B08020, #D4A330)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                      {s.val}
                    </div>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.22em", textTransform: "uppercase",
                      color: "#9CA3AF", marginTop: 6,
                    }}>
                      {s.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — glass card diubah ke versi terang */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block relative"
            >
              <motion.div
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                {/* Main glass card - Disesuaikan untuk light mode */}
                <div style={{
                  position: "relative", borderRadius: 24, overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,248,250,0.98) 100%)",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.8) inset",
                  padding: "40px 36px 36px", minHeight: 400,
                }}>
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 mb-8">
                    {["rgba(255,95,87,1)", "rgba(255,189,46,1)", "rgba(40,200,64,1)"].map((c, i) => (
                      <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
                    ))}
                    <div style={{
                      marginLeft: 12, flex: 1, height: 24, borderRadius: 8,
                      background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.04)",
                      display: "flex", alignItems: "center", paddingLeft: 10,
                    }}>
                      <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "monospace" }}>
                        monark.studio
                      </span>
                    </div>
                  </div>

                  {/* Skeleton UI */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Heading lines */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ height: 14, width: "80%", borderRadius: 4, background: "rgba(0,0,0,0.12)" }} />
                      <div style={{ height: 10, width: "65%", borderRadius: 4, background: "rgba(0,0,0,0.06)" }} />
                      <div style={{ height: 10, width: "50%", borderRadius: 4, background: "rgba(0,0,0,0.04)" }} />
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <div style={{ height: 32, width: 120, borderRadius: 8, background: "linear-gradient(135deg,#C69B28,#E8C040)" }} />
                      <div style={{ height: 32, width: 100, borderRadius: 8, background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)" }} />
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "8px 0" }} />

                    {/* Stats row */}
                    <div style={{ display: "flex", gap: 24 }}>
                      {["50+", "30+", "99%"].map((v, i) => (
                        <div key={i}>
                          <div style={{
                            fontSize: 22, fontWeight: 700, fontFamily: "serif",
                            background: "linear-gradient(135deg,#B08020,#D4A330)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                          }}>
                            {v}
                          </div>
                          <div style={{ height: 8, width: 40, marginTop: 4, borderRadius: 3, background: "rgba(0,0,0,0.06)" }} />
                        </div>
                      ))}
                    </div>

                    {/* Code block */}
                    <div style={{
                      marginTop: 8, borderRadius: 12, padding: "14px 16px",
                      background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)",
                      display: "flex", flexDirection: "column", gap: 7,
                    }}>
                      {[
                        { w: "55%", c: "#C69B28" },
                        { w: "80%", c: "rgba(0,0,0,0.2)" },
                        { w: "40%", c: "rgba(59,130,246,0.5)" },
                        { w: "70%", c: "rgba(0,0,0,0.1)" },
                        { w: "35%", c: "rgba(16,185,129,0.4)" },
                      ].map((line, i) => (
                        <div key={i} style={{ height: 8, width: line.w, borderRadius: 3, background: line.c }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating service chips */}
                {SERVICES.map((svc, i) => (
                  <motion.div
                    key={svc.title}
                    initial={{ opacity: 0, scale: 0.82, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.9 + i * 0.15, type: "spring", stiffness: 180, damping: 16 }}
                    className={`absolute ${svc.pos}`}
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4.5 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
                    >
                      <div style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 14px", borderRadius: 14,
                        border: "1px solid rgba(0,0,0,0.08)",
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,1) inset",
                      }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: "linear-gradient(135deg, #C69B28, #E8C040)",
                          boxShadow: "0 3px 10px rgba(198,155,40,0.25)",
                        }}>
                          <svc.Icon size={13} color="#1C1200" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p style={{
                            margin: 0, fontSize: 12, fontWeight: 700,
                            color: "#111827", fontFamily: "'DM Sans', sans-serif", lineHeight: 1,
                          }}>
                            {svc.title}
                          </p>
                          <p style={{
                            margin: "3px 0 0", fontSize: 10,
                            color: "#6B7280", fontFamily: "'DM Sans', sans-serif", lineHeight: 1,
                          }}>
                            {svc.desc}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700,
          letterSpacing: "0.35em", textTransform: "uppercase", color: "#9CA3AF",
        }}>
          Scroll
        </span>
        <div style={{ width: 1, height: 36, borderRadius: 2, overflow: "hidden", background: "rgba(0,0,0,0.1)" }}>
          <motion.div
            style={{ width: "100%", height: "40%", borderRadius: 2, background: "rgba(198,155,40,0.6)" }}
            animate={{ y: ["0%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}