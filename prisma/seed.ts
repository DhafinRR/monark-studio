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

  console.log("Seeding About Content...");

  await prisma.aboutContent.upsert({
    where: { id: "default" },
    update: {
      title: "About Monark Studio",
      subtitle: "Crafting Digital Excellence Since 2020",
      content: `<p>Monark Studio adalah digital agency yang berfokus pada pengembangan website dan aplikasi mobile berkualitas tinggi. Kami percaya bahwa teknologi yang baik harus sederhana, elegan, dan powerful.</p>
<p>Dengan tim yang berpengalaman dan passionate, kami telah membantu puluhan klien dari berbagai industri mewujudkan visi digital mereka. Dari startup hingga enterprise, kami siap menjadi partner teknologi yang dapat diandalkan.</p>
<p>Filosofi kami: <strong>Quality over Quantity</strong>. Kami tidak mengejar jumlah proyek, tapi fokus memberikan hasil terbaik untuk setiap client.</p>`,
      logo_url: "/assets/logo-circle.png",
    },
    create: {
      id: "default",
      title: "About Monark Studio",
      subtitle: "Crafting Digital Excellence Since 2020",
      content: `<p>Monark Studio adalah digital agency yang berfokus pada pengembangan website dan aplikasi mobile berkualitas tinggi. Kami percaya bahwa teknologi yang baik harus sederhana, elegan, dan powerful.</p>
<p>Dengan tim yang berpengalaman dan passionate, kami telah membantu puluhan klien dari berbagai industri mewujudkan visi digital mereka. Dari startup hingga enterprise, kami siap menjadi partner teknologi yang dapat diandalkan.</p>
<p>Filosofi kami: <strong>Quality over Quantity</strong>. Kami tidak mengejar jumlah proyek, tapi fokus memberikan hasil terbaik untuk setiap client.</p>`,
      logo_url: "/assets/logo-circle.png",
    },
  });

  console.log("Seeding About Quote...");

  await prisma.aboutQuote.upsert({
    where: { id: "default" },
    update: {
      text: "Great software isn't just about code—it's about understanding people, solving real problems, and building experiences that matter.",
      author: "Monark Team",
      position: "Founders & Developers",
    },
    create: {
      id: "default",
      text: "Great software isn't just about code—it's about understanding people, solving real problems, and building experiences that matter.",
      author: "Monark Team",
      position: "Founders & Developers",
    },
  });

  console.log("Seeding Ketentuan...");

  const ketentuanItems = [
    {
      order_number: 1,
      title: "Ketentuan Umum",
      icon: "📜",
      content: `<p>Ketentuan ini mengatur hubungan kerja sama antara Monark Studio dengan Client dalam pengembangan proyek digital.</p>
<ul>
<li>Client wajib memberikan brief dan requirement yang jelas sebelum proyek dimulai</li>
<li>Perubahan scope proyek setelah development dimulai akan dikenakan biaya tambahan</li>
<li>Monark Studio berhak menolak permintaan yang melanggar hukum atau etika profesional</li>
<li>Komunikasi proyek dilakukan melalui channel resmi yang telah disepakati</li>
</ul>`,
      is_active: true,
    },
    {
      order_number: 2,
      title: "Syarat Pembayaran",
      icon: "💳",
      content: `<p>Pembayaran proyek dilakukan dalam dua tahap untuk memastikan komitmen kedua belah pihak.</p>
<ul>
<li><strong>Down Payment (DP) 50%</strong> dibayarkan setelah kesepakatan kontrak dan sebelum development dimulai</li>
<li><strong>Pelunasan 50%</strong> dibayarkan setelah proyek selesai dan sebelum deployment</li>
<li>Pembayaran dapat dilakukan melalui transfer bank atau payment gateway yang disediakan</li>
<li>Invoice akan dikirimkan via email setelah setiap milestone pembayaran</li>
<li>Keterlambatan pembayaran lebih dari 7 hari akan mengakibatkan penundaan proyek</li>
</ul>`,
      is_active: true,
    },
    {
      order_number: 3,
      title: "Kebijakan Revisi",
      icon: "🔄",
      content: `<p>Kami menyediakan kesempatan revisi untuk memastikan hasil sesuai ekspektasi Client.</p>
<ul>
<li>Setiap paket sudah termasuk <strong>3x revisi mayor</strong> tanpa biaya tambahan</li>
<li>Revisi minor (typo, warna, spacing) tidak dibatasi selama masih dalam tahap development</li>
<li>Revisi harus diajukan maksimal 7 hari setelah deliverable dikirim</li>
<li>Revisi yang mengubah konsep atau scope awal akan dikenakan biaya tambahan</li>
<li>Revisi setelah proyek selesai dan di-deploy dikenakan biaya maintenance</li>
</ul>`,
      is_active: true,
    },
    {
      order_number: 4,
      title: "Hak Kekayaan Intelektual",
      icon: "©️",
      content: `<p>Kepemilikan dan penggunaan hasil karya diatur dalam ketentuan berikut.</p>
<ul>
<li>Source code dan design menjadi milik Client setelah pelunasan 100%</li>
<li>Monark Studio berhak menggunakan project sebagai portfolio dengan mencantumkan nama Client</li>
<li>Client tidak diperkenankan mengklaim project sebagai hasil karya internal tanpa menyebutkan Monark Studio</li>
<li>Library dan framework open-source yang digunakan tetap tunduk pada lisensi masing-masing</li>
<li>Custom component dan logic yang kami develop menjadi hak milik Client sepenuhnya</li>
</ul>`,
      is_active: true,
    },
    {
      order_number: 5,
      title: "Pembatalan & Pengembalian Dana",
      icon: "❌",
      content: `<p>Pembatalan proyek dapat dilakukan dengan ketentuan pengembalian dana sebagai berikut.</p>
<ul>
<li>Pembatalan sebelum development dimulai: pengembalian DP 70% (30% biaya administrasi)</li>
<li>Pembatalan setelah development >25%: pengembalian DP 50%</li>
<li>Pembatalan setelah development >50%: tidak ada pengembalian dana</li>
<li>Force majeure yang mengakibatkan pembatalan akan dibicarakan secara kasus per kasus</li>
<li>Pembatalan harus diajukan secara tertulis via email resmi</li>
</ul>`,
      is_active: true,
    },
    {
      order_number: 6,
      title: "Jaminan & Garansi",
      icon: "🛡️",
      content: `<p>Kami memberikan garansi untuk memastikan kualitas dan keberlanjutan proyek Anda.</p>
<ul>
<li><strong>Garansi bug</strong> selama 30 hari setelah deployment untuk bug yang timbul dari development kami</li>
<li>Bug yang disebabkan modifikasi oleh pihak ketiga tidak termasuk garansi</li>
<li>Garansi mencakup perbaikan error, crash, dan fungsi yang tidak sesuai spesifikasi</li>
<li>Maintenance dan update fitur baru setelah garansi akan dikenakan biaya terpisah</li>
<li>Kami tidak bertanggung jawab atas downtime yang disebabkan oleh hosting provider</li>
</ul>`,
      is_active: true,
    },
    {
      order_number: 7,
      title: "Tanggung Jawab & Batasan",
      icon: "⚖️",
      content: `<p>Batasan tanggung jawab untuk melindungi kepentingan kedua belah pihak.</p>
<ul>
<li>Monark Studio tidak bertanggung jawab atas kerugian bisnis akibat downtime atau bug</li>
<li>Client bertanggung jawab atas konten yang di-upload ke sistem (legal compliance)</li>
<li>Kami tidak menjamin ranking SEO atau traffic tertentu setelah website live</li>
<li>Security best practices akan diterapkan, namun 100% keamanan tidak dapat dijamin</li>
<li>Backup data adalah tanggung jawab Client setelah serah terima</li>
</ul>`,
      is_active: true,
    },
    {
      order_number: 8,
      title: "Force Majeure",
      icon: "🌪️",
      content: `<p>Kondisi di luar kendali yang mempengaruhi pelaksanaan proyek.</p>
<ul>
<li>Bencana alam, pandemi, atau peristiwa force majeure lainnya dapat mengakibatkan penundaan</li>
<li>Kedua pihak akan bernegosiasi untuk reschedule timeline tanpa penalti</li>
<li>Jika force majeure berlangsung >60 hari, salah satu pihak dapat mengajukan pembatalan</li>
<li>Pengembalian dana dalam kondisi force majeure akan disesuaikan dengan progress proyek</li>
</ul>`,
      is_active: true,
    },
  ];

  for (const item of ketentuanItems) {
    await prisma.ketentuan.upsert({
      where: { order_number: item.order_number },
      update: item,
      create: item,
    });
  }

  console.log("Seeding Order Timeline...");

  const timelineSteps = [
    {
      step_number: 1,
      title: "Konsultasi & Brief Awal",
      description: "Diskusi kebutuhan proyek dan analisis requirement dengan tim",
      duration: "1-2 hari",
      icon: "💬",
      is_active: true,
    },
    {
      step_number: 2,
      title: "Penawaran & Kesepakatan",
      description: "Penyusunan proposal, quotation, dan kontrak kerja sama",
      duration: "2-3 hari",
      icon: "📋",
      is_active: true,
    },
    {
      step_number: 3,
      title: "Down Payment (DP)",
      description: "Pembayaran uang muka 50% dari total biaya proyek",
      duration: "1 hari",
      icon: "💰",
      is_active: true,
    },
    {
      step_number: 4,
      title: "Design & Development",
      description: "Proses desain UI/UX dan pengembangan sistem",
      duration: "2-6 minggu",
      icon: "⚙️",
      is_active: true,
    },
    {
      step_number: 5,
      title: "Review & Revisi",
      description: "Evaluasi hasil development dan implementasi feedback client",
      duration: "3-7 hari",
      icon: "🔍",
      is_active: true,
    },
    {
      step_number: 6,
      title: "Testing & Quality Assurance",
      description: "Pengujian fungsionalitas, performa, dan keamanan sistem",
      duration: "3-5 hari",
      icon: "✅",
      is_active: true,
    },
    {
      step_number: 7,
      title: "Pelunasan Pembayaran",
      description: "Pembayaran sisa 50% sebelum deployment",
      duration: "1 hari",
      icon: "💳",
      is_active: true,
    },
    {
      step_number: 8,
      title: "Deployment & Serah Terima",
      description: "Publikasi sistem ke production dan handover ke client",
      duration: "1-2 hari",
      icon: "🚀",
      is_active: true,
    },
    {
      step_number: 9,
      title: "Training & Dokumentasi",
      description: "Pelatihan penggunaan sistem dan penyerahan dokumentasi lengkap",
      duration: "1-2 hari",
      icon: "📚",
      is_active: true,
    },
    {
      step_number: 10,
      title: "Support & Maintenance",
      description: "Dukungan teknis dan maintenance berkelanjutan",
      duration: "Ongoing",
      icon: "🛠️",
      is_active: true,
    },
  ];

  for (const step of timelineSteps) {
    await prisma.orderTimeline.upsert({
      where: { step_number: step.step_number },
      update: step,
      create: step,
    });
  }

  console.log("Seeding Privacy & Policy...");

  await prisma.privacyPolicy.upsert({
    where: { id: "default" },
    update: {
      title: "Privacy & Policy",
      content: `<h2>Pengumpulan Data</h2>
<p>Monark Studio mengumpulkan data yang diperlukan untuk memberikan layanan terbaik kepada Client.</p>
<ul>
<li><strong>Data Identitas:</strong> Nama, email, nomor telepon, dan alamat untuk komunikasi proyek</li>
<li><strong>Data Proyek:</strong> Brief, requirement, dan feedback yang diberikan selama kolaborasi</li>
<li><strong>Data Pembayaran:</strong> Invoice dan riwayat transaksi (bukan detail kartu kredit)</li>
<li><strong>Data Teknis:</strong> IP address, browser type, dan device information untuk keamanan</li>
<li>Semua data dikumpulkan dengan consent dan hanya yang relevan dengan layanan</li>
</ul>

<h2>Penggunaan Data</h2>
<p>Data yang kami kumpulkan digunakan secara terbatas untuk tujuan berikut.</p>
<ul>
<li>Komunikasi dan koordinasi proyek development dengan Client</li>
<li>Pembuatan invoice, payment reminder, dan dokumentasi keuangan</li>
<li>Analisis untuk meningkatkan kualitas layanan kami</li>
<li>Pengiriman update proyek, newsletter, dan informasi promo (dengan consent)</li>
<li>Pemenuhan kewajiban legal dan perpajakan di Indonesia</li>
<li>Kami TIDAK menjual atau menyewakan data Client ke pihak ketiga</li>
</ul>

<h2>Penyimpanan & Keamanan Data</h2>
<p>Kami menerapkan langkah-langkah keamanan untuk melindungi data Client.</p>
<ul>
<li>Data disimpan di server dengan enkripsi SSL/TLS dan akses terbatas</li>
<li>Database menggunakan password yang kuat dan firewall protection</li>
<li>Backup data dilakukan secara berkala untuk mencegah kehilangan</li>
<li>Akses data internal hanya diberikan kepada tim yang membutuhkan</li>
<li>Data proyek dihapus setelah 2 tahun selesai (kecuali data legal yang wajib disimpan)</li>
<li>Meskipun kami menerapkan best practices, tidak ada sistem yang 100% aman</li>
</ul>

<h2>Cookies & Teknologi Pelacakan</h2>
<p>Website kami menggunakan cookies untuk meningkatkan pengalaman pengguna.</p>
<ul>
<li><strong>Essential Cookies:</strong> Diperlukan untuk fungsi website (session, login)</li>
<li><strong>Analytics Cookies:</strong> Google Analytics untuk memahami traffic dan perilaku user</li>
<li><strong>Marketing Cookies:</strong> Retargeting ads (dengan consent)</li>
<li>Anda dapat menonaktifkan cookies melalui browser settings, namun beberapa fitur mungkin terganggu</li>
<li>Kami tidak menggunakan cookies untuk tracking invasif atau menjual data</li>
</ul>

<h2>Hak Privasi Anda</h2>
<p>Client memiliki hak penuh atas data pribadi yang kami simpan.</p>
<ul>
<li><strong>Hak Akses:</strong> Meminta salinan data pribadi yang kami simpan</li>
<li><strong>Hak Koreksi:</strong> Memperbaiki data yang tidak akurat atau tidak lengkap</li>
<li><strong>Hak Penghapusan:</strong> Meminta penghapusan data (kecuali yang wajib disimpan untuk legal)</li>
<li><strong>Hak Portabilitas:</strong> Meminta data dalam format yang dapat dibaca mesin</li>
<li><strong>Hak Menolak:</strong> Menolak penggunaan data untuk marketing atau analytics</li>
<li>Untuk menggunakan hak ini, hubungi kami via email resmi dengan identitas valid</li>
</ul>

<h2>Layanan Pihak Ketiga</h2>
<p>Kami menggunakan layanan pihak ketiga yang memiliki kebijakan privasi sendiri.</p>
<ul>
<li><strong>Google Analytics:</strong> Analisis traffic website</li>
<li><strong>Payment Gateway:</strong> Proses pembayaran (data kartu tidak disimpan oleh kami)</li>
<li><strong>Email Service:</strong> Pengiriman email transaksional dan newsletter</li>
<li><strong>Cloud Hosting:</strong> Penyimpanan data di server (dengan SLA dan security standards)</li>
<li>Kami hanya bekerja dengan vendor yang memiliki kebijakan privasi yang ketat</li>
<li>Client bertanggung jawab membaca privacy policy dari layanan yang mereka pilih untuk proyek</li>
</ul>

<h2>Transfer Data Internasional</h2>
<p>Beberapa layanan yang kami gunakan mungkin menyimpan data di luar Indonesia.</p>
<ul>
<li>Server utama berada di Indonesia atau region Asia-Pacific</li>
<li>Backup data dapat disimpan di cloud provider internasional (AWS, Google Cloud)</li>
<li>Transfer data ke luar negeri dilakukan dengan perlindungan standar internasional</li>
<li>Kami memastikan vendor internasional comply dengan GDPR atau standar serupa</li>
</ul>

<h2>Perubahan Kebijakan Privasi</h2>
<p>Kebijakan privasi ini dapat diperbarui sesuai dengan perkembangan layanan dan regulasi.</p>
<ul>
<li>Perubahan signifikan akan diumumkan via email atau notifikasi di website</li>
<li>Tanggal "Last Updated" akan selalu tertera di bagian atas kebijakan</li>
<li>Client yang tidak setuju dengan perubahan dapat menghentikan layanan</li>
<li>Penggunaan layanan setelah perubahan dianggap sebagai persetujuan terhadap kebijakan baru</li>
</ul>`,
      is_active: true,
    },
    create: {
      id: "default",
      title: "Privacy & Policy",
      content: `<h2>Pengumpulan Data</h2>
<p>Monark Studio mengumpulkan data yang diperlukan untuk memberikan layanan terbaik kepada Client.</p>
<ul>
<li><strong>Data Identitas:</strong> Nama, email, nomor telepon, dan alamat untuk komunikasi proyek</li>
<li><strong>Data Proyek:</strong> Brief, requirement, dan feedback yang diberikan selama kolaborasi</li>
<li><strong>Data Pembayaran:</strong> Invoice dan riwayat transaksi (bukan detail kartu kredit)</li>
<li><strong>Data Teknis:</strong> IP address, browser type, dan device information untuk keamanan</li>
<li>Semua data dikumpulkan dengan consent dan hanya yang relevan dengan layanan</li>
</ul>

<h2>Penggunaan Data</h2>
<p>Data yang kami kumpulkan digunakan secara terbatas untuk tujuan berikut.</p>
<ul>
<li>Komunikasi dan koordinasi proyek development dengan Client</li>
<li>Pembuatan invoice, payment reminder, dan dokumentasi keuangan</li>
<li>Analisis untuk meningkatkan kualitas layanan kami</li>
<li>Pengiriman update proyek, newsletter, dan informasi promo (dengan consent)</li>
<li>Pemenuhan kewajiban legal dan perpajakan di Indonesia</li>
<li>Kami TIDAK menjual atau menyewakan data Client ke pihak ketiga</li>
</ul>

<h2>Penyimpanan & Keamanan Data</h2>
<p>Kami menerapkan langkah-langkah keamanan untuk melindungi data Client.</p>
<ul>
<li>Data disimpan di server dengan enkripsi SSL/TLS dan akses terbatas</li>
<li>Database menggunakan password yang kuat dan firewall protection</li>
<li>Backup data dilakukan secara berkala untuk mencegah kehilangan</li>
<li>Akses data internal hanya diberikan kepada tim yang membutuhkan</li>
<li>Data proyek dihapus setelah 2 tahun selesai (kecuali data legal yang wajib disimpan)</li>
<li>Meskipun kami menerapkan best practices, tidak ada sistem yang 100% aman</li>
</ul>

<h2>Cookies & Teknologi Pelacakan</h2>
<p>Website kami menggunakan cookies untuk meningkatkan pengalaman pengguna.</p>
<ul>
<li><strong>Essential Cookies:</strong> Diperlukan untuk fungsi website (session, login)</li>
<li><strong>Analytics Cookies:</strong> Google Analytics untuk memahami traffic dan perilaku user</li>
<li><strong>Marketing Cookies:</strong> Retargeting ads (dengan consent)</li>
<li>Anda dapat menonaktifkan cookies melalui browser settings, namun beberapa fitur mungkin terganggu</li>
<li>Kami tidak menggunakan cookies untuk tracking invasif atau menjual data</li>
</ul>

<h2>Hak Privasi Anda</h2>
<p>Client memiliki hak penuh atas data pribadi yang kami simpan.</p>
<ul>
<li><strong>Hak Akses:</strong> Meminta salinan data pribadi yang kami simpan</li>
<li><strong>Hak Koreksi:</strong> Memperbaiki data yang tidak akurat atau tidak lengkap</li>
<li><strong>Hak Penghapusan:</strong> Meminta penghapusan data (kecuali yang wajib disimpan untuk legal)</li>
<li><strong>Hak Portabilitas:</strong> Meminta data dalam format yang dapat dibaca mesin</li>
<li><strong>Hak Menolak:</strong> Menolak penggunaan data untuk marketing atau analytics</li>
<li>Untuk menggunakan hak ini, hubungi kami via email resmi dengan identitas valid</li>
</ul>

<h2>Layanan Pihak Ketiga</h2>
<p>Kami menggunakan layanan pihak ketiga yang memiliki kebijakan privasi sendiri.</p>
<ul>
<li><strong>Google Analytics:</strong> Analisis traffic website</li>
<li><strong>Payment Gateway:</strong> Proses pembayaran (data kartu tidak disimpan oleh kami)</li>
<li><strong>Email Service:</strong> Pengiriman email transaksional dan newsletter</li>
<li><strong>Cloud Hosting:</strong> Penyimpanan data di server (dengan SLA dan security standards)</li>
<li>Kami hanya bekerja dengan vendor yang memiliki kebijakan privasi yang ketat</li>
<li>Client bertanggung jawab membaca privacy policy dari layanan yang mereka pilih untuk proyek</li>
</ul>

<h2>Transfer Data Internasional</h2>
<p>Beberapa layanan yang kami gunakan mungkin menyimpan data di luar Indonesia.</p>
<ul>
<li>Server utama berada di Indonesia atau region Asia-Pacific</li>
<li>Backup data dapat disimpan di cloud provider internasional (AWS, Google Cloud)</li>
<li>Transfer data ke luar negeri dilakukan dengan perlindungan standar internasional</li>
<li>Kami memastikan vendor internasional comply dengan GDPR atau standar serupa</li>
</ul>

<h2>Perubahan Kebijakan Privasi</h2>
<p>Kebijakan privasi ini dapat diperbarui sesuai dengan perkembangan layanan dan regulasi.</p>
<ul>
<li>Perubahan signifikan akan diumumkan via email atau notifikasi di website</li>
<li>Tanggal "Last Updated" akan selalu tertera di bagian atas kebijakan</li>
<li>Client yang tidak setuju dengan perubahan dapat menghentikan layanan</li>
<li>Penggunaan layanan setelah perubahan dianggap sebagai persetujuan terhadap kebijakan baru</li>
</ul>`,
      is_active: true,
    },
  });

  console.log("Seeding Terms & Conditions...");

  await prisma.termsCondition.upsert({
    where: { id: "default" },
    update: {
      title: "Terms & Conditions",
      content: `<h2>Penerimaan Syarat & Ketentuan</h2>
<p>Dengan menggunakan layanan Monark Studio, Client dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan ini.</p>
<ul>
<li>Syarat ini berlaku sejak kesepakatan kontrak ditandatangani atau pembayaran DP diterima</li>
<li>Jika tidak setuju dengan salah satu poin, Client dapat mengajukan negosiasi sebelum proyek dimulai</li>
<li>Ketentuan ini mengikat secara hukum dan melindungi kepentingan kedua belah pihak</li>
<li>Versi terbaru dari Terms & Conditions selalu dapat diakses di website kami</li>
</ul>

<h2>Deskripsi Layanan</h2>
<p>Monark Studio menyediakan jasa pengembangan digital dengan scope yang jelas dan terukur.</p>
<ul>
<li><strong>Web Development:</strong> Landing page, company profile, web app, dan e-commerce</li>
<li><strong>Mobile Development:</strong> Native iOS/Android atau cross-platform apps</li>
<li><strong>UI/UX Design:</strong> Desain interface yang user-friendly dan modern</li>
<li><strong>CMS Integration:</strong> Dashboard admin untuk manajemen konten</li>
<li><strong>Maintenance & Support:</strong> Layanan post-launch dengan paket terpisah</li>
<li>Setiap layanan memiliki specification document yang disepakati di awal proyek</li>
</ul>

<h2>Kewajiban Client</h2>
<p>Client memiliki tanggung jawab untuk memastikan kelancaran proyek.</p>
<ul>
<li>Menyediakan brief, requirement, dan aset (logo, konten, gambar) secara lengkap dan tepat waktu</li>
<li>Memberikan feedback yang konstruktif dan spesifik dalam waktu yang disepakati</li>
<li>Melakukan pembayaran sesuai invoice dan timeline yang telah ditetapkan</li>
<li>Memastikan konten yang di-upload tidak melanggar hukum, hak cipta, atau etika</li>
<li>Memberikan akses yang diperlukan (hosting, domain, API keys) untuk deployment</li>
<li>Keterlambatan dari sisi Client dapat mengakibatkan penundaan timeline tanpa penalti ke kami</li>
</ul>

<h2>Hak Kekayaan Intelektual</h2>
<p>Kepemilikan source code dan design diatur dengan jelas untuk menghindari konflik di kemudian hari.</p>
<ul>
<li><strong>Sebelum Pelunasan:</strong> Semua IP (source code, design) adalah milik Monark Studio</li>
<li><strong>Setelah Pelunasan 100%:</strong> IP beralih sepenuhnya ke Client tanpa royalty berkelanjutan</li>
<li>Monark Studio berhak menggunakan project sebagai portfolio dengan mencantumkan nama Client (kecuali diminta confidential)</li>
<li>Open-source libraries dan frameworks yang digunakan tetap tunduk pada lisensi aslinya</li>
<li>Client tidak boleh mengklaim project sebagai hasil karya internal tanpa kredit ke Monark Studio</li>
<li>Modifikasi source code setelah serah terima adalah hak penuh Client</li>
</ul>

<h2>Pembatasan Tanggung Jawab</h2>
<p>Monark Studio tidak bertanggung jawab atas kondisi tertentu di luar kendali kami.</p>
<ul>
<li><strong>Kerugian Bisnis:</strong> Tidak bertanggung jawab atas kehilangan revenue, profit, atau data akibat downtime</li>
<li><strong>Konten Ilegal:</strong> Client bertanggung jawab penuh atas konten yang di-upload ke sistem</li>
<li><strong>Hosting & Infrastructure:</strong> Downtime dari hosting provider bukan tanggung jawab kami</li>
<li><strong>Third-Party Services:</strong> Gangguan pada API atau layanan eksternal di luar kendali kami</li>
<li><strong>SEO & Marketing:</strong> Kami tidak menjamin ranking tertentu atau traffic ke website</li>
<li>Total liability kami terbatas pada nilai kontrak proyek yang telah dibayarkan</li>
</ul>

<h2>Pemutusan Kontrak</h2>
<p>Kontrak dapat diakhiri oleh salah satu pihak dengan ketentuan yang jelas.</p>
<ul>
<li><strong>Oleh Client:</strong> Dapat membatalkan proyek dengan kebijakan pengembalian dana sesuai progress (lihat ketentuan)</li>
<li><strong>Oleh Monark Studio:</strong> Dapat membatalkan jika Client melanggar ketentuan atau melakukan pembayaran terlambat >30 hari</li>
<li>Pemutusan harus dilakukan secara tertulis via email resmi dengan pemberitahuan minimal 7 hari</li>
<li>Hasil pekerjaan hingga tanggal pemutusan tetap menjadi hak Client jika sudah dibayar</li>
<li>Sisa dana (jika ada) akan dikembalikan dalam 14 hari kerja setelah konfirmasi pemutusan</li>
</ul>

<h2>Penyelesaian Sengketa</h2>
<p>Jika terjadi perselisihan, kedua pihak sepakat untuk menyelesaikan secara profesional.</p>
<ul>
<li><strong>Negosiasi Langsung:</strong> Tahap pertama adalah diskusi baik-baik untuk mencari solusi win-win</li>
<li><strong>Mediasi:</strong> Jika negosiasi gagal, dapat melibatkan mediator netral</li>
<li><strong>Arbitrase/Litigasi:</strong> Sebagai opsi terakhir, sengketa diselesaikan di pengadilan Jakarta Selatan</li>
<li>Hukum yang berlaku adalah hukum Republik Indonesia</li>
<li>Semua komunikasi terkait sengketa harus didokumentasikan secara tertulis</li>
</ul>

<h2>Perubahan Ketentuan</h2>
<p>Monark Studio berhak memperbarui syarat dan ketentuan untuk proyek yang akan datang.</p>
<ul>
<li>Perubahan tidak berlaku retroaktif untuk proyek yang sudah berjalan</li>
<li>Proyek baru akan tunduk pada versi Terms & Conditions terbaru saat kontrak ditandatangani</li>
<li>Client akan diinformasikan tentang perubahan signifikan sebelum memulai proyek baru</li>
<li>Versi terbaru selalu tersedia di website kami dengan timestamp "Last Updated"</li>
</ul>`,
      is_active: true,
    },
    create: {
      id: "default",
      title: "Terms & Conditions",
      content: `<h2>Penerimaan Syarat & Ketentuan</h2>
<p>Dengan menggunakan layanan Monark Studio, Client dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan ini.</p>
<ul>
<li>Syarat ini berlaku sejak kesepakatan kontrak ditandatangani atau pembayaran DP diterima</li>
<li>Jika tidak setuju dengan salah satu poin, Client dapat mengajukan negosiasi sebelum proyek dimulai</li>
<li>Ketentuan ini mengikat secara hukum dan melindungi kepentingan kedua belah pihak</li>
<li>Versi terbaru dari Terms & Conditions selalu dapat diakses di website kami</li>
</ul>

<h2>Deskripsi Layanan</h2>
<p>Monark Studio menyediakan jasa pengembangan digital dengan scope yang jelas dan terukur.</p>
<ul>
<li><strong>Web Development:</strong> Landing page, company profile, web app, dan e-commerce</li>
<li><strong>Mobile Development:</strong> Native iOS/Android atau cross-platform apps</li>
<li><strong>UI/UX Design:</strong> Desain interface yang user-friendly dan modern</li>
<li><strong>CMS Integration:</strong> Dashboard admin untuk manajemen konten</li>
<li><strong>Maintenance & Support:</strong> Layanan post-launch dengan paket terpisah</li>
<li>Setiap layanan memiliki specification document yang disepakati di awal proyek</li>
</ul>

<h2>Kewajiban Client</h2>
<p>Client memiliki tanggung jawab untuk memastikan kelancaran proyek.</p>
<ul>
<li>Menyediakan brief, requirement, dan aset (logo, konten, gambar) secara lengkap dan tepat waktu</li>
<li>Memberikan feedback yang konstruktif dan spesifik dalam waktu yang disepakati</li>
<li>Melakukan pembayaran sesuai invoice dan timeline yang telah ditetapkan</li>
<li>Memastikan konten yang di-upload tidak melanggar hukum, hak cipta, atau etika</li>
<li>Memberikan akses yang diperlukan (hosting, domain, API keys) untuk deployment</li>
<li>Keterlambatan dari sisi Client dapat mengakibatkan penundaan timeline tanpa penalti ke kami</li>
</ul>

<h2>Hak Kekayaan Intelektual</h2>
<p>Kepemilikan source code dan design diatur dengan jelas untuk menghindari konflik di kemudian hari.</p>
<ul>
<li><strong>Sebelum Pelunasan:</strong> Semua IP (source code, design) adalah milik Monark Studio</li>
<li><strong>Setelah Pelunasan 100%:</strong> IP beralih sepenuhnya ke Client tanpa royalty berkelanjutan</li>
<li>Monark Studio berhak menggunakan project sebagai portfolio dengan mencantumkan nama Client (kecuali diminta confidential)</li>
<li>Open-source libraries dan frameworks yang digunakan tetap tunduk pada lisensi aslinya</li>
<li>Client tidak boleh mengklaim project sebagai hasil karya internal tanpa kredit ke Monark Studio</li>
<li>Modifikasi source code setelah serah terima adalah hak penuh Client</li>
</ul>

<h2>Pembatasan Tanggung Jawab</h2>
<p>Monark Studio tidak bertanggung jawab atas kondisi tertentu di luar kendali kami.</p>
<ul>
<li><strong>Kerugian Bisnis:</strong> Tidak bertanggung jawab atas kehilangan revenue, profit, atau data akibat downtime</li>
<li><strong>Konten Ilegal:</strong> Client bertanggung jawab penuh atas konten yang di-upload ke sistem</li>
<li><strong>Hosting & Infrastructure:</strong> Downtime dari hosting provider bukan tanggung jawab kami</li>
<li><strong>Third-Party Services:</strong> Gangguan pada API atau layanan eksternal di luar kendali kami</li>
<li><strong>SEO & Marketing:</strong> Kami tidak menjamin ranking tertentu atau traffic ke website</li>
<li>Total liability kami terbatas pada nilai kontrak proyek yang telah dibayarkan</li>
</ul>

<h2>Pemutusan Kontrak</h2>
<p>Kontrak dapat diakhiri oleh salah satu pihak dengan ketentuan yang jelas.</p>
<ul>
<li><strong>Oleh Client:</strong> Dapat membatalkan proyek dengan kebijakan pengembalian dana sesuai progress (lihat ketentuan)</li>
<li><strong>Oleh Monark Studio:</strong> Dapat membatalkan jika Client melanggar ketentuan atau melakukan pembayaran terlambat >30 hari</li>
<li>Pemutusan harus dilakukan secara tertulis via email resmi dengan pemberitahuan minimal 7 hari</li>
<li>Hasil pekerjaan hingga tanggal pemutusan tetap menjadi hak Client jika sudah dibayar</li>
<li>Sisa dana (jika ada) akan dikembalikan dalam 14 hari kerja setelah konfirmasi pemutusan</li>
</ul>

<h2>Penyelesaian Sengketa</h2>
<p>Jika terjadi perselisihan, kedua pihak sepakat untuk menyelesaikan secara profesional.</p>
<ul>
<li><strong>Negosiasi Langsung:</strong> Tahap pertama adalah diskusi baik-baik untuk mencari solusi win-win</li>
<li><strong>Mediasi:</strong> Jika negosiasi gagal, dapat melibatkan mediator netral</li>
<li><strong>Arbitrase/Litigasi:</strong> Sebagai opsi terakhir, sengketa diselesaikan di pengadilan Jakarta Selatan</li>
<li>Hukum yang berlaku adalah hukum Republik Indonesia</li>
<li>Semua komunikasi terkait sengketa harus didokumentasikan secara tertulis</li>
</ul>

<h2>Perubahan Ketentuan</h2>
<p>Monark Studio berhak memperbarui syarat dan ketentuan untuk proyek yang akan datang.</p>
<ul>
<li>Perubahan tidak berlaku retroaktif untuk proyek yang sudah berjalan</li>
<li>Proyek baru akan tunduk pada versi Terms & Conditions terbaru saat kontrak ditandatangani</li>
<li>Client akan diinformasikan tentang perubahan signifikan sebelum memulai proyek baru</li>
<li>Versi terbaru selalu tersedia di website kami dengan timestamp "Last Updated"</li>
</ul>`,
      is_active: true,
    },
  });

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
