import type { PackageType } from '@/types'

export interface PricingPackage {
  id: PackageType;
  name: string;
  tagline: string;
  price: string;
  floorPrice: number;
  maxSlots: number;
  priceNote: string;
  target: string;
  highlighted?: boolean;
  features: { text: string; isStandard?: boolean }[];
  defaultFeatures: string[];
}

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: "basic_web",
    name: "Basic Web",
    tagline: "Landing page profesional untuk memulai kehadiran online Anda.",
    price: "600 Ribu",
    floorPrice: 600000,
    maxSlots: 3,
    priceNote: "Start from",
    target: "UMKM / Personal",
    defaultFeatures: ["Halaman Home Statis", "Pilihan Halaman About/Layanan", "Integrasi Tombol WhatsApp"],
    features: [
      { text: "1 Minggu Pengerjaan", isStandard: true },
      { text: "Free Hosting Lifetime", isStandard: true },
      { text: "Desain Responsif", isStandard: true },
      { text: "Hingga 3 Halaman", isStandard: true },
      { text: "Tombol WhatsApp", isStandard: true },
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
    floorPrice: 5000000,
    maxSlots: 10,
    priceNote: "Start from",
    target: "Perusahaan / Toko",
    highlighted: true,
    defaultFeatures: ["Dashboard Admin", "Sistem Login/Auth", "Manajemen Konten (CRUD)", "Search & Filter", "Hingga 5 Halaman Dinamis"],
    features: [
      { text: "Free Domain 1 Tahun", isStandard: true },
      { text: "Hingga 5 Halaman Dinamis", isStandard: true },
      { text: "1 Email Bisnis", isStandard: true },
      { text: "Google Analytics", isStandard: true },
      { text: "Fast Loading", isStandard: true },
      { text: "Dashboard Admin (CMS)", isStandard: true },
      { text: "3x Revisi" },
      { text: "Garansi Bug" },
    ],
  },
  {
    id: "mobile_app",
    name: "Mobile App",
    tagline: "Aplikasi mobile custom dengan fitur lengkap dan performa tinggi.",
    price: "15 Juta",
    floorPrice: 15000000,
    maxSlots: 12,
    priceNote: "Start from (1 Platform)",
    target: "Startup / Sistem Booking",
    defaultFeatures: ["Splash Screen & Icon", "Login & Profile User", "Navbar/Menu Navigasi", "Web Admin Backend", "Push Notifications"],
    features: [
      { text: "Full Custom System", isStandard: true },
      { text: "Free CMS", isStandard: true },
      { text: "Database & Login", isStandard: true },
      { text: "Web Admin Panel", isStandard: true },
      { text: "Push Notifications", isStandard: true },
      { text: "UI/UX Premium", isStandard: true },
      { text: "Priority Support" },
      { text: "Garansi Bug" },
    ],
  },
];

export const PACKAGE_LABELS: Record<string, string> = {
  basic_web: "Basic Web",
  web_app_cms: "Web App / CMS",
  mobile_app: "Mobile App",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  PENDING: "Pending",
  PAID: "Paid",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};
