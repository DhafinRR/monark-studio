import { Metadata } from "next";
import OrderPageClient from "./OrderPageClient";

export const metadata: Metadata = {
  title: 'Order - Monark Studio | Pesan Website & Aplikasi Mobile',
  description: 'Pesan jasa pembuatan website atau aplikasi mobile dengan mengisi formulir order. Dapatkan estimasi harga dan konsultasi gratis dari tim Monark Studio.',
  keywords: ['order monark studio', 'pesan website', 'formulir order website', 'jasa pembuatan aplikasi mobile'],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://monarkstudio.com/order',
    siteName: 'Monark Studio',
    title: 'Order - Monark Studio',
    description: 'Pesan jasa pembuatan website atau aplikasi mobile dengan mengisi formulir order.',
    images: [
      {
        url: '/assets/logo-circle.png',
        width: 1200,
        height: 630,
        alt: 'Monark Studio Order',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Order - Monark Studio',
    description: 'Pesan jasa pembuatan website atau aplikasi mobile dengan mengisi formulir order.',
    images: ['/assets/logo-circle.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function OrderPage() {
  return <OrderPageClient />;
}