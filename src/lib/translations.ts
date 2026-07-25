export type Lang = "ID" | "EN";

const translations: Record<string, Record<Lang, string>> = {
  // ─── Navbar ───
  "nav.home": { ID: "Home", EN: "Home" },
  "nav.portfolio": { ID: "Portfolio", EN: "Portfolio" },
  "nav.about": { ID: "About", EN: "About" },
  "nav.aboutUs": { ID: "About Us", EN: "About Us" },
  "nav.ketentuan": { ID: "Ketentuan", EN: "Terms" },
  "nav.order": { ID: "Order", EN: "Order" },
  "nav.startProject": { ID: "Mulai Proyek", EN: "Start Project" },

  // ─── Hero Section ───
  "hero.badge": { ID: "Digital Agency", EN: "Digital Agency" },
  "hero.headline1": { ID: "Kami Bangun", EN: "We Build" },
  "hero.headline2": { ID: "untuk Bisnis Anda", EN: "for Your Business" },
  "hero.body": {
    ID: "Dari landing page sederhana hingga aplikasi mobile custom — solusi digital yang",
    EN: "From simple landing pages to custom mobile apps — digital solutions that are",
  },
  "hero.bodyFast": { ID: "cepat", EN: "fast" },
  "hero.bodyScalable": { ID: "scalable", EN: "scalable" },
  "hero.bodyEnd": { ID: "dan berperforma tinggi.", EN: "and high-performing." },
  "hero.ctaPricing": { ID: "Lihat Paket Harga", EN: "View Pricing" },
  "hero.ctaPortfolio": { ID: "Lihat Portfolio", EN: "View Portfolio" },
  "hero.statProjects": { ID: "Proyek", EN: "Projects" },
  "hero.statClients": { ID: "Klien", EN: "Clients" },
  "hero.statUptime": { ID: "Uptime", EN: "Uptime" },
  "hero.scroll": { ID: "Scroll", EN: "Scroll" },
  "hero.serviceWebDesc": { ID: "Landing page & web app", EN: "Landing page & web app" },
  "hero.serviceMobileDesc": { ID: "iOS & Android native", EN: "iOS & Android native" },
  "hero.serviceDesignDesc": { ID: "Design konversi tinggi", EN: "High-conversion design" },

  // ─── Pricing Section ───
  "pricing.badge": { ID: "Paket Harga", EN: "Pricing Plans" },
  "pricing.title1": { ID: "Investasi untuk", EN: "Invest in Your" },
  "pricing.titleHighlight": { ID: "Masa Depan", EN: "Future" },
  "pricing.title2": { ID: "Digital", EN: "Digital" },
  "pricing.subtitle": {
    ID: "Setiap paket dirancang untuk kebutuhan bisnis yang berbeda.",
    EN: "Each plan is tailored to different business needs.",
  },

  // ─── Pricing Card ───
  "pricingCard.popular": { ID: "PALING POPULER", EN: "MOST POPULAR" },
  "pricingCard.standardFeatures": { ID: "Fitur Standar", EN: "Standard Features" },
  "pricingCard.customizable": { ID: "Fitur dapat di sesuaikan", EN: "Features are customizable" },
  "pricingCard.orderNow": { ID: "Pesan Sekarang", EN: "Order Now" },
  "pricingCard.mobileTooltip": {
    ID: "Harga untuk platform Android & iOS:",
    EN: "Price for Android & iOS platform:",
  },

  // ─── Portfolio Showcase ───
  "portfolio.badge": { ID: "Portfolio", EN: "Portfolio" },
  "portfolio.title1": { ID: "Karya", EN: "Our" },
  "portfolio.titleHighlight": { ID: "Terbaik", EN: "Best" },
  "portfolio.title2": { ID: "Kami", EN: "Work" },
  "portfolio.subtitle": {
    ID: "Beberapa proyek yang telah kami selesaikan untuk klien dari berbagai industri.",
    EN: "Some projects we have completed for clients across various industries.",
  },
  "portfolio.empty": { ID: "Belum ada portfolio.", EN: "No portfolio yet." },

  // ─── Order Form ───
  "order.badge": { ID: "Mulai Proyek", EN: "Start Project" },
  "order.title1": { ID: "Wujudkan", EN: "Realize Your" },
  "order.titleHighlight": { ID: "Ide", EN: "Ideas" },
  "order.title2": { ID: "Anda", EN: "" },
  "order.subtitle": {
    ID: "Pilih cara berkonsultasi yang paling nyaman untuk Anda. Tim atau AI kami siap membantu merumuskan kebutuhan proyek Anda.",
    EN: "Choose the consultation method that works best for you. Our team or AI is ready to help define your project requirements.",
  },
  "order.waTitle": { ID: "Konsultasi Langsung", EN: "Direct Consultation" },
  "order.waDesc": {
    ID: "Diskusikan ide proyek Anda langsung dengan tim ahli kami melalui WhatsApp. Cepat dan personal.",
    EN: "Discuss your project ideas directly with our expert team via WhatsApp. Fast and personal.",
  },
  "order.waCta": { ID: "Chat Sekarang", EN: "Chat Now" },
  "order.aiBadge": { ID: "Rekomendasi", EN: "Recommended" },
  "order.aiTitle": { ID: "Tanya Asisten AI", EN: "Ask AI Assistant" },
  "order.aiDesc": {
    ID: "Ceritakan secara singkat apa yang Anda butuhkan dengan bahasa sehari-hari. AI kami akan merumuskan spesifikasinya.",
    EN: "Briefly describe what you need in everyday language. Our AI will formulate the specifications.",
  },
  "order.aiPlaceholder": {
    ID: "Contoh: Saya butuh website untuk jualan baju online dengan fitur keranjang belanja...",
    EN: "Example: I need a website to sell clothes online with a shopping cart feature...",
  },
  "order.aiAnalyzing": { ID: "Menganalisis...", EN: "Analyzing..." },
  "order.aiButton": { ID: "Gunakan AI", EN: "Use AI" },
  "order.formTitle": { ID: "Isi Form Manual", EN: "Fill Manual Form" },
  "order.formDesc": {
    ID: "Sudah tahu persis apa yang Anda butuhkan? Isi formulir pemesanan secara mandiri dan pilih paket Anda.",
    EN: "Already know exactly what you need? Fill out the order form independently and choose your plan.",
  },
  "order.formCta": { ID: "Isi Formulir", EN: "Fill Form" },
  // Platform modal
  "order.platformTitle": { ID: "Pilih Platform Aplikasi", EN: "Choose App Platform" },
  "order.platformSubtitle": {
    ID: "Kami mendeteksi kebutuhan aplikasi mobile. Mana yang Anda butuhkan?",
    EN: "We detected a need for a mobile application. Which one do you need?",
  },
  "order.platformAndroid": { ID: "Aplikasi untuk Play Store", EN: "App for Play Store" },
  "order.platformIos": { ID: "Aplikasi untuk App Store", EN: "App for App Store" },
  "order.platformBoth": { ID: "Dua platform sekaligus dengan harga khusus", EN: "Both platforms at a special price" },
  "order.platformBothLabel": { ID: "Keduanya (Android & iOS)", EN: "Both (Android & iOS)" },
  "order.platformCancel": { ID: "Batal", EN: "Cancel" },

  // ─── Footer ───
  "footer.desc": {
    ID: "Kami membantu bisnis Anda hadir secara digital dengan website dan aplikasi berkualitas tinggi.",
    EN: "We help your business go digital with high-quality websites and applications.",
  },
  "footer.navigation": { ID: "Navigasi", EN: "Navigation" },
  "footer.services": { ID: "Layanan", EN: "Services" },
  "footer.contact": { ID: "Kontak", EN: "Contact" },
  "footer.legal": { ID: "Legal", EN: "Legal" },
  "footer.madeWith": { ID: "Made with", EN: "Made with" },
  "footer.inIndonesia": { ID: "in Indonesia", EN: "in Indonesia" },

  // ─── Service Bento ───
  "service.title": { ID: "Mengapa Memilih", EN: "Why Choose" },
  "service.subtitle": {
    ID: "Kami menggabungkan keahlian teknis tingkat tinggi dengan desain yang memukau untuk membangun masa depan digital Anda.",
    EN: "We combine high-level technical expertise with stunning design to build your digital future.",
  },
  "service.perfName": { ID: "Performa Kilat", EN: "Lightning Performance" },
  "service.perfDesc": {
    ID: "Situs web dengan skor Lighthouse 100 dan waktu muat di bawah 2 detik.",
    EN: "Websites with Lighthouse score of 100 and load times under 2 seconds.",
  },
  "service.perfCta": { ID: "Pelajari lebih lanjut", EN: "Learn more" },
  "service.techName": { ID: "Modern Tech Stack", EN: "Modern Tech Stack" },
  "service.techDesc": {
    ID: "Kami menggunakan teknologi terbaru seperti Next.js, TypeScript, dan Supabase.",
    EN: "We use the latest technologies like Next.js, TypeScript, and Supabase.",
  },
  "service.techCta": { ID: "Lihat Stack", EN: "View Stack" },
  "service.intName": { ID: "Seamless Integration", EN: "Seamless Integration" },
  "service.intDesc": {
    ID: "Terhubung otomatis dengan GCP, Xendit, WhatsApp, dan ekosistem bisnis Anda lainnya.",
    EN: "Automatically connects with GCP, Xendit, WhatsApp, and your other business ecosystem.",
  },
  "service.intCta": { ID: "Lihat Integrasi", EN: "View Integrations" },
  "service.customName": { ID: "Custom Solutions", EN: "Custom Solutions" },
  "service.customDesc": {
    ID: "Solusi perangkat lunak yang disesuaikan khusus untuk kebutuhan unik bisnis Anda.",
    EN: "Custom software solutions tailored specifically for your unique business needs.",
  },
  "service.customCta": { ID: "Konsultasi", EN: "Consult" },

  // ─── Portfolio Page ───
  "portfolioPage.ctaTitle1": { ID: "Punya Ide", EN: "Have a" },
  "portfolioPage.ctaTitleHighlight": { ID: "Proyek", EN: "Project" },
  "portfolioPage.ctaTitle2": { ID: "?", EN: "Idea?" },
  "portfolioPage.ctaDesc": { ID: "Mari wujudkan visi digital Anda bersama kami.", EN: "Let's bring your digital vision to life with us." },
  "portfolioPage.ctaButton": { ID: "Mulai Proyek", EN: "Start Project" },
  "portfolioPage.all": { ID: "Semua", EN: "All" },

  // ─── About Page ───
  "about.timelineTitle": { ID: "Proses Pemesanan", EN: "Ordering Process" },
  "about.timelineDesc": { ID: "Timeline tahapan pemesanan dari konsultasi hingga serah terima", EN: "Timeline of the ordering stages from consultation to handover" },
  "about.step": { ID: "Tahap", EN: "Step" },
  
  "about.ketentuanTitle": { ID: "Ketentuan Layanan", EN: "Terms of Service" },
  "about.ketentuanDesc": { ID: "Hal-hal yang perlu Anda ketahui sebelum dan selama pengerjaan proyek", EN: "Things you need to know before and during the project execution" },

  // ─── Order Page ───
  "order.back": { ID: "Kembali", EN: "Back" },
  "order.title1": { ID: "Formulir", EN: "Manual" },
  "order.titleHighlight": { ID: "Manual", EN: "Form" },
  "order.subtitle": { ID: "Silakan isi detail proyek Anda di bawah ini", EN: "Please fill in your project details below" },

  // ─── Legal Pages ───
  "privacy.intro": {
    ID: "Kepercayaan Anda adalah fondasi dari setiap proyek yang kami bangun. Dokumen ini menjelaskan secara transparan bagaimana Monark Studio mengumpulkan, mengelola, dan melindungi informasi pribadi Anda — mulai dari data kontak hingga detail proyek — dengan standar keamanan industri tertinggi. Kami berkomitmen untuk menjaga kerahasiaan data Anda di setiap tahap kolaborasi.",
    EN: "Your trust is the foundation of every project we build. This document transparently explains how Monark Studio collects, manages, and protects your personal information — from contact data to project details — with the highest industry security standards. We are committed to maintaining the confidentiality of your data at every stage of collaboration."
  },
  "terms.intro": {
    ID: "Di Monark Studio, kami percaya bahwa kolaborasi terbaik dibangun di atas kejelasan dan saling pengertian. Dokumen ini menguraikan syarat, ketentuan, serta hak dan kewajiban kedua belah pihak — mencakup lingkup layanan, proses pembayaran, hingga hak kekayaan intelektual — agar setiap proyek berjalan lancar, profesional, dan saling menguntungkan.",
    EN: "At Monark Studio, we believe that the best collaborations are built on clarity and mutual understanding. This document outlines the terms, conditions, as well as the rights and obligations of both parties — covering the scope of services, payment processes, to intellectual property rights — so that every project runs smoothly, professionally, and mutually beneficial."
  },

  // ─── Order Form ───
  "form.clientInfo": { ID: "Informasi Klien", EN: "Client Information" },
  "form.projectTitle": { ID: "Judul Proyek, misal: Website Portfolio", EN: "Project Title, e.g. Portfolio Website" },
  "form.name": { ID: "Nama", EN: "Name" },
  "form.selectPackage": { ID: "-- Pilih Paket --", EN: "-- Select Package --" },
  "form.platform": { ID: "Platform Aplikasi *", EN: "Application Platform *" },
  "form.aiNote": { ID: "Catatan AI", EN: "AI Note" },
  "form.benefits": { ID: "Benefit Paket", EN: "Package Benefits" },
  "form.included": { ID: "Otomatis termasuk", EN: "Automatically included" },
  "form.standardFeatures": { ID: "Fitur Standar", EN: "Standard Features" },
  "form.slot": { ID: "slot", EN: "slots" },
  "form.standardPlaceholder": { ID: "Fitur standar", EN: "Standard feature" },
  "form.notePlaceholder": { ID: "Catatan untuk fitur ini, misal: ingin warna biru dominan (opsional)", EN: "Note for this feature, e.g. dominant blue color (optional)" },
  "form.addonFeatures": { ID: "Fitur Tambahan (Addon)", EN: "Additional Features (Addon)" },
  "form.addonDesc1": { ID: "Tambahkan fitur tambahan sesuai kebutuhan proyek Anda.", EN: "Add additional features according to your project needs." },
  "form.addonDesc2": { ID: "Harga akan muncul", EN: "The price will appear" },
  "form.addonDesc3": { ID: "setelah Anda memilih fitur atau mengisi deskripsi fitur custom", EN: "after you select a feature or fill in a custom feature description" },
  "form.addonDesc4": { ID: "secara otomatis", EN: "automatically" },
  "form.add": { ID: "Tambah", EN: "Add" },
  "form.noAddon": { ID: "Belum ada fitur tambahan.", EN: "No additional features yet." },
  "form.addAddon": { ID: "+ Tambah fitur addon", EN: "+ Add addon feature" },

  // ─── DB Fallbacks ───
  "about.db_title": { ID: "Transformasi Digital, Dimulai dari Sini", EN: "Digital Transformation, Starts Here" },
  "about.db_subtitle": { ID: "Ketahui lebih lanjut tentang Monark Studio", EN: "Learn more about Monark Studio" },
  "about.db_content": { 
    ID: "", 
    EN: "<p>At Monark Studio, we believe that a strong digital presence is the key to business success in the modern era. We are a team of professionals dedicated to helping you build innovative, beautiful, and highly functional digital solutions.</p><p>From company profiles to complex mobile applications, we approach every project with the same passion: to deliver the best results for our clients.</p>" 
  },
  
  "terms.db_title": { ID: "Syarat & Ketentuan", EN: "Terms & Conditions" },
  "terms.db_content": { 
    ID: "", 
    EN: "<h3>1. Introduction</h3><p>By using Monark Studio's services, you agree to these terms and conditions. We strive to provide transparent and fair guidelines for all our digital projects.</p><h3>2. Services</h3><p>We provide web development, mobile app development, and related digital services as agreed upon in the project scope.</p><h3>3. Payment Terms</h3><p>Standard payment terms require a 50% down payment before project initiation, and the remaining 50% upon project completion and before final deployment.</p><h3>4. Intellectual Property</h3><p>Upon full payment, the source code and design assets become the property of the client. However, Monark Studio reserves the right to showcase the completed project in our portfolio.</p><h3>5. Revisions</h3><p>We offer up to 3 major revisions during the development phase. Additional major revisions may incur extra charges.</p>" 
  },

  "privacy.db_title": { ID: "Kebijakan Privasi", EN: "Privacy Policy" },
  "privacy.db_content": {
    ID: "",
    EN: "<h3>1. Data Collection</h3><p>We collect necessary information such as your name, email, phone number, and project details to provide our services effectively.</p><h3>2. Data Usage</h3><p>Your information is solely used for communication, project management, and invoicing. We do not sell or share your data with third parties for marketing purposes.</p><h3>3. Security</h3><p>We implement standard industry security measures to protect your personal and project data from unauthorized access or disclosure.</p><h3>4. Your Rights</h3><p>You have the right to request access to, correction of, or deletion of your personal data stored in our systems.</p>"
  },
};

export default translations;
