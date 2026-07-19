"use client";

import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import Marquee from "@/components/magicui/marquee";
import { 
  Globe, 
  Zap, 
  Search, 
  ShieldCheck, 
  Code2,
  Mail,
  MessageSquare,
  CreditCard,
  Instagram,
  ChevronRight
} from "lucide-react";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { useRef, forwardRef } from "react";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:bg-black",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

const features = [
  {
    Icon: Zap,
    name: "Performa Kilat",
    description: "Situs web dengan skor Lighthouse 100 dan waktu muat di bawah 2 detik.",
    href: "#",
    cta: "Pelajari lebih lanjut",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute right-0 top-0 h-full w-full opacity-10 [mask-image:linear-gradient(to_top,transparent,black)]">
         <div className="flex h-full items-center justify-center text-8xl font-bold text-accent">100</div>
      </div>
    ),
  },
  {
    Icon: Globe,
    name: "Modern Tech Stack",
    description: "Kami menggunakan teknologi terbaru seperti Next.js, TypeScript, dan Supabase.",
    href: "#",
    cta: "Lihat Stack",
    className: "col-span-3 lg:col-span-2",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent,black)]"
      >
        {["Next.js", "React", "TypeScript", "Tailwind", "Prisma", "Supabase", "Framer Motion", "Magic UI"].map((f, idx) => (
          <div
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white line-clamp-1">
                  {f}
                </figcaption>
              </div>
            </div>
          </div>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: ShieldCheck,
    name: "Seamless Integration",
    description: "Terhubung otomatis dengan GCP, Xendit, WhatsApp, dan ekosistem bisnis Anda lainnya.",
    href: "#",
    cta: "Lihat Integrasi",
    className: "col-span-3 lg:col-span-2",
    background: (
      <IntegrationBeam />
    ),
  },
  {
    Icon: Code2,
    name: "Custom Solutions",
    description: "Solusi perangkat lunak yang disesuaikan khusus untuk kebutuhan unik bisnis Anda.",
    href: "#",
    cta: "Konsultasi",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute right-0 top-10 w-full p-4 opacity-10 transition-all duration-300 group-hover:opacity-20 uppercase font-mono text-[10px] leading-tight overflow-hidden h-full">
        {`const monarkValue = {
  quality: "Premium",
  code: "Clean",
  design: "State of Art",
  performance: "Optimized"
};

function buildSuccess() {
  return deploy(monarkValue);
}`}
      </div>
    ),
  },
];

function IntegrationBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden p-10 pt-16"
      ref={containerRef}
    >
      <div className="flex h-full w-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div1Ref} className="h-10 w-10">
            <Globe className="text-[#4285F4] w-5 h-5" />
          </Circle>
          <Circle ref={div2Ref} className="h-10 w-10">
             <CreditCard className="text-accent w-5 h-5" />
          </Circle>
          <Circle ref={div3Ref} className="h-10 w-10">
            <Instagram className="text-pink-500 w-5 h-5" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div4Ref} className="h-16 w-16 border-accent/20 bg-accent/5">
             <Zap className="h-8 w-8 text-accent fill-accent/20" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div5Ref} className="h-10 w-10">
             <MessageSquare className="text-green-500 w-5 h-5" />
          </Circle>
          <Circle ref={div6Ref} className="h-10 w-10">
            <Mail className="text-blue-400 w-5 h-5" />
          </Circle>
          <Circle ref={div7Ref} className="h-10 w-10">
             <Search className="text-purple-400 w-5 h-5" />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-50}
        endYOffset={-10}
        gradientStartColor="#4285F4"
        gradientStopColor="#C69B28"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
        gradientStartColor="#C69B28"
        gradientStopColor="#C69B28"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={50}
        endYOffset={10}
        gradientStartColor="#E1306C"
        gradientStopColor="#C69B28"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-50}
        endYOffset={-10}
        reverse
        gradientStartColor="#25D366"
        gradientStopColor="#C69B28"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        reverse
        gradientStartColor="#60A5FA"
        gradientStopColor="#C69B28"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={50}
        endYOffset={10}
        reverse
        gradientStartColor="#A78BFA"
        gradientStopColor="#C69B28"
      />
    </div>
  );
}

export function ServiceBento() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Mengapa Memilih <span className="text-accent">Monark?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kami menggabungkan keahlian teknis tingkat tinggi dengan desain yang memukau untuk membangun masa depan digital Anda.
          </p>
        </div>
        
        <BentoGrid>
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
