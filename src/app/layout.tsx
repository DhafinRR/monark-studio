import type { Metadata } from 'next'
import '@/App.css'
import '@/index.css'

export const metadata: Metadata = {
  title: 'Monark Studio',
  description: 'Created with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}