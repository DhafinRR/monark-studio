import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Pricing Packages...");

  const pricingPackages = [
    {
      id: "basic_web",
      name: "Basic Web",
      tagline: "Landing page profesional untuk memulai kehadiran online Anda.",
      target: "UMKM / Personal",
      price_note: "Start from",
      floor_price: 600000,
      max_slots: 3,
      benefits: [
        "1 Minggu Pengerjaan",
        "Free Hosting Lifetime",
        "Desain Responsif",
        "Tombol WhatsApp",
        "3x Revisi",
        "Garansi Bug",
        "Video Panduan"
      ],
      default_features: [
        "Halaman Home Statis",
        "Pilihan Halaman About/Layanan",
        "Integrasi Tombol WhatsApp"
      ],
      is_popular: false,
      is_active: true,
    },
    {
      id: "web_app_cms",
      name: "Web App / CMS",
      tagline: "Website lengkap dengan sistem manajemen konten untuk bisnis Anda.",
      target: "Perusahaan / Toko",
      price_note: "Start from",
      floor_price: 5000000,
      max_slots: 10,
      benefits: [
        "Free Domain 1 Tahun",
        "Free Hosting",
        "Email Bisnis",
        "Google Analytics",
        "Fast Loading",
        "Dashboard Admin (CMS)",
        "3x Revisi",
        "Garansi Bug"
      ],
      default_features: [
        "Dashboard Admin",
        "Sistem Login/Auth",
        "Manajemen Konten (CRUD)",
        "Search & Filter",
        "Halaman Dinamis"
      ],
      is_popular: true,
      is_active: true,
    },
    {
      id: "mobile_app",
      name: "Mobile App",
      tagline: "Aplikasi mobile custom dengan fitur lengkap dan performa tinggi.",
      target: "Startup / Sistem Booking",
      price_note: "Start from (1 Platform)",
      floor_price: 15000000,
      max_slots: 12,
      benefits: [
        "Full Custom System",
        "Free CMS",
        "Database & Login",
        "Web Admin Panel",
        "Push Notifications",
        "UI/UX Premium",
        "Priority Support",
        "Garansi Bug"
      ],
      default_features: [
        "Splash Screen & Icon",
        "Login & Profile User",
        "Navbar/Menu Navigasi",
        "Web Admin Backend",
        "Push Notifications"
      ],
      is_popular: false,
      is_active: true,
    },
  ];

  for (const pkg of pricingPackages) {
    await prisma.pricingPackage.upsert({
      where: { id: pkg.id },
      update: pkg,
      create: pkg,
    });
  }

  console.log("Seeding TechStacks...");

  const techStacks = [
    // Web
    { name: "React", icon_url: "https://cdn.worldvectorlogo.com/logos/react-2.svg", color_hex: "#61DAFB" },
    { name: "Next.js", icon_url: "https://cdn.worldvectorlogo.com/logos/next-js.svg", color_hex: "#000000" },
    { name: "Tailwind CSS", icon_url: "https://cdn.worldvectorlogo.com/logos/tailwindcss.svg", color_hex: "#06B6D4" },
    { name: "TypeScript", icon_url: "https://cdn.worldvectorlogo.com/logos/typescript.svg", color_hex: "#3178C6" },
    { name: "Node.js", icon_url: "https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg", color_hex: "#339933" },
    { name: "PostgreSQL", icon_url: "https://cdn.worldvectorlogo.com/logos/postgresql.svg", color_hex: "#4169E1" },
    { name: "Prisma", icon_url: "https://cdn.worldvectorlogo.com/logos/prisma-2.svg", color_hex: "#2D3748" },
    { name: "Vue", icon_url: "https://cdn.worldvectorlogo.com/logos/vue-9.svg", color_hex: "#4FC08D" },
    // Mobile
    { name: "Flutter", icon_url: "https://cdn.worldvectorlogo.com/logos/flutter.svg", color_hex: "#02569B" },
    { name: "React Native", icon_url: "https://cdn.worldvectorlogo.com/logos/react-native-1.svg", color_hex: "#61DAFB" },
    { name: "Swift", icon_url: "https://cdn.worldvectorlogo.com/logos/swift-15.svg", color_hex: "#F05138" },
    { name: "Kotlin", icon_url: "https://cdn.worldvectorlogo.com/logos/kotlin-1.svg", color_hex: "#7F52FF" },
    // Backend/DB
    { name: "Supabase", icon_url: "https://cdn.worldvectorlogo.com/logos/supabase-1.svg", color_hex: "#3ECF8E" },
    { name: "Firebase", icon_url: "https://cdn.worldvectorlogo.com/logos/firebase-1.svg", color_hex: "#FFCA28" },
    { name: "Golang", icon_url: "https://cdn.worldvectorlogo.com/logos/golang-gopher.svg", color_hex: "#00ADD8" },
  ];

  for (const stack of techStacks) {
    await prisma.techStack.upsert({
      where: { name: stack.name },
      update: {},
      create: stack,
    });
  }

  console.log("Seeding Portfolio Projects...");

  const projects = [
    {
      title: "EcoMart - Sustainable E-commerce",
      description: "Platform belanja online modern dengan fokus pada produk ramah lingkungan.",
      full_description: "EcoMart adalah platform e-commerce lengkap yang dibangun untuk mengurangi jejak karbon digital. Fitur utama meliputi filter produk berkelanjutan, pelacakan pengiriman ramah lingkungan, dan dashboard penjual yang intuitif.",
      type: "WEB" as const,
      image_url: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1600",
      gallery: [
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
      ],
      features: ["Multi-vendor Support", "Real-time Inventory", "Eco-credit Rewards", "Secure AI Payment"],
      client_name: "Green Solutions Corp",
      project_url: "https://ecomart.example.com",
      stacks: ["Next.js", "Tailwind CSS", "TypeScript", "PostgreSQL", "Prisma", "Supabase"]
    },
    {
      title: "Flow - Fintech Dashboard",
      description: "Sistem manajemen keuangan perusahaan dengan analitik real-time yang canggih.",
      full_description: "Flow membantu perusahaan melacak arus kas, pengeluaran, dan proyeksi keuangan dalam satu dashboard visual. Terintegrasi dengan berbagai API bank internasional.",
      type: "WEB" as const,
      image_url: "https://images.unsplash.com/photo-1551288049-bbda44a5f798?auto=format&fit=crop&q=80&w=1600",
      gallery: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
      ],
      features: ["Predictive Analytics", "Automated Invoicing", "Multi-currency Support", "Blockchain Security"],
      client_name: "FinFlow Inc",
      project_url: "https://flow-fintech.example.com",
      stacks: ["React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"]
    },
    {
      title: "QuickBite - Food Delivery App",
      description: "Aplikasi pengiriman makanan super cepat dengan pelacakan kurir real-time.",
      full_description: "QuickBite menyederhanakan cara memesan makanan dengan antarmuka yang sangat responsif, sistem poin loyalitas, dan integrasi peta yang akurat untuk pelacakan pengiriman.",
      type: "MOBILE" as const,
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1600",
      gallery: [
        "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=800"
      ],
      features: ["Real-time Driver Tracking", "AI Food Recommendation", "Subscription Model", "In-app Chat"],
      client_name: "BiteMe Ltd",
      project_url: null,
      stacks: ["Flutter", "Firebase", "Node.js"]
    },
    {
      title: "Zenith - Property Listing & Management",
      description: "Portal properti premium dengan fitur tur virtual 3D terintegrasi.",
      full_description: "Zenith mendefinisikan ulang cara orang mencari properti mewah. Dilengkapi dengan tur virtual 3D, kalkulator hipotek interaktif, dan sistem manajemen agen properti.",
      type: "WEB" as const,
      image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1600",
      gallery: [],
      features: ["3D Virtual Tours", "Dynamic Property Map", "Lead Generation CRM", "Agent Dashboard"],
      client_name: "Elite Realty Group",
      project_url: "https://zenith-property.example.com",
      stacks: ["Next.js", "Prisma", "PostgreSQL", "Tailwind CSS"]
    },
    {
      title: "Vitals - Health & Fitness Tracker",
      description: "Aplikasi kesehatan komprehensif yang terhubung dengan perangkat wearable.",
      full_description: "Vitals melacak detak jantung, pola tidur, dan asupan nutrisi Anda. Memberikan wawasan kesehatan berbasis AI untuk mencapai gaya hidup yang lebih seimbang.",
      type: "MOBILE" as const,
      image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1600",
      gallery: [],
      features: ["Wearable Syncing", "Personalized Workout Plans", "Nutrition Database", "Sleep Cycle Analysis"],
      client_name: "HealthConnect",
      project_url: null,
      stacks: ["React Native", "Firebase", "TypeScript"]
    },
    {
      title: "EduStream - Learning Management System",
      description: "Platform pembelajaran online interaktif untuk korporasi dan institusi pendidikan.",
      full_description: "EduStream memungkinkan pembuatan kursus yang kaya media, kuis interaktif, dan pelacakan kemajuan siswa secara mendalam dengan sistem sertifikasi otomatis.",
      type: "WEB" as const,
      image_url: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1600",
      gallery: [],
      features: ["Interactive Video Lessons", "Auto-grading Quizzes", "Student Collaboration Hub", "Certificate Generator"],
      client_name: "EduTech Global",
      project_url: "https://edustream.example.com",
      stacks: ["Vue", "Node.js", "PostgreSQL", "Tailwind CSS"]
    },
    {
      title: "Nexus - SaaS Landing Page",
      description: "Landing page konversi tinggi untuk startup SaaS dengan performa SEO terbaik.",
      full_description: "Halaman landing yang dioptimalkan untuk kecepatan dan konversi. Nexus fokus pada estetika minimalis namun tetap fungsional dan informatif untuk audiens B2B.",
      type: "WEB" as const,
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600",
      gallery: [],
      features: ["Extreme Performance (100 Lighthouse)", "A/B Testing Ready", "Responsive Design", "SEO Metadata Engine"],
      client_name: "Nexus Core",
      project_url: "https://nexus-saas.example.com",
      stacks: ["Next.js", "Tailwind CSS", "TypeScript"]
    },
    {
      title: "GoService - Professional Booking App",
      description: "Solusi satu pintu untuk memesan layanan profesional ke rumah klien.",
      full_description: "Dari kebersihan hingga perbaikan elektronik, GoService menghubungkan pengguna dengan profesional terpercaya dengan sistem pembayaran escrow yang aman.",
      type: "MOBILE" as const,
      image_url: "https://images.unsplash.com/photo-1621905252507-b354bc2d1d6e?auto=format&fit=crop&q=80&w=1600",
      gallery: [],
      features: ["Escrow Payments", "Background Checked Pros", "Booking Scheduler", "Review System"],
      client_name: "Local Service Pro",
      project_url: null,
      stacks: ["Kotlin", "Golang", "PostgreSQL"]
    },
    {
      title: "CreativeHub - Social Media for Creatives",
      description: "Platform sosial eksklusif untuk berbagi karya dan kolaborasi antar kreator.",
      full_description: "CreativeHub menggabungkan portofolio dengan fitur sosial, memungkinkan kreator untuk menemukan rekan kolaborasi dan mendapatkan feedback dari komunitas.",
      type: "WEB" as const,
      image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600",
      gallery: [],
      features: ["Portfolio Grid Layout", "Messaging & Collaboration", "Community Forums", "Job Board"],
      client_name: "Creative Network",
      project_url: "https://creativehub.example.com",
      stacks: ["React", "Node.js", "Supabase", "Tailwind CSS"]
    },
    {
      title: "Arkitect - Architectural Visualization",
      description: "Portofolio interaktif untuk arsitek dengan visualisasi 3D yang memukau.",
      full_description: "Menggabungkan seni dan teknologi, Arkitect menyajikan proyek aristektur dengan detail visual yang tinggi, tur 360 derajat, dan interaksi mendalam.",
      type: "WEB" as const,
      image_url: "https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=1600",
      gallery: [],
      features: ["360 View Integration", "High-res Image Support", "Interactive Floor Plans", "Dynamic Lighting Effects"],
      client_name: "Studio 101 Architects",
      project_url: "https://arkitect-studio.example.com",
      stacks: ["Next.js", "TypeScript", "Tailwind CSS"]
    }
  ];

  for (const p of projects) {
    const { stacks, ...projectData } = p;
    await prisma.portfolioProject.create({
      data: {
        ...projectData,
        stacks: {
          connect: stacks.map(s => ({ name: s }))
        }
      }
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
