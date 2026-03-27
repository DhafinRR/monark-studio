import { PricingPackage } from "@/types";

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: "basic_web",
    name: "Basic Web",
    tagline: "Landing page profesional untuk memulai kehadiran online Anda.",
    price: "1 Juta",
    priceNote: "Start from",
    target: "UMKM / Personal",
    features: [
      { text: "1 Minggu Pengerjaan" },
      { text: "Free Hosting Lifetime" },
      { text: "Desain Responsif" },
      { text: "1 Landing Page" },
      { text: "Tombol WhatsApp" },
      { text: "3x Revisi" },
      { text: "Garansi Bug" },
      { text: "Video Panduan" },
    ],
  },
  {
    id: "web_app_cms",
    name: "Web App / CMS",
    tagline: "Website lengkap dengan sistem manajemen konten untuk bisnis Anda.",
    price: "5 Juta",
    priceNote: "Start from",
    target: "Perusahaan / Toko",
    highlighted: true,
    features: [
      { text: "Free Domain 1 Tahun" },
      { text: "Hingga 5 Halaman" },
      { text: "1 Email Bisnis" },
      { text: "Google Analytics" },
      { text: "Fast Loading" },
      { text: "Video Tutorial" },
      { text: "3x Revisi" },
      { text: "Garansi Bug" },
    ],
  },
  {
    id: "mobile_app",
    name: "Mobile App",
    tagline: "Aplikasi mobile custom dengan fitur lengkap dan performa tinggi.",
    price: "15 Juta",
    priceNote: "Start from",
    target: "Startup / Sistem Booking",
    features: [
      { text: "Full Custom System" },
      { text: "Free CMS" },
      { text: "Database & Login" },
      { text: "Cloud Server" },
      { text: "Payment Gateway" },
      { text: "UI/UX Premium" },
      { text: "Priority Support" },
      { text: "Dokumen Teknis" },
      { text: "Garansi Bug" },
      { text: "Video Training" },
    ],
  },
];

export const PACKAGE_LABELS: Record<string, string> = {
  basic_web: "Basic Web",
  web_app_cms: "Web App / CMS",
  mobile_app: "Mobile App",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  dealing: "Dealing",
  closed: "Closed",
};
