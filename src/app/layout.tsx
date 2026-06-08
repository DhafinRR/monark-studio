import type { Metadata } from 'next'
import '@/index.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
    title: 'Monark Studio',
    description: 'Created with Next.js',
    icons: {
        icon: '/assets/logo-circle.png',
        apple: '/assets/logo-circle.png',
    }
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <GoogleAnalytics />
                {children}
                <Toaster position="top-center" richColors closeButton />
            </body>
        </html>
    )
}