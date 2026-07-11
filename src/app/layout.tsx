import type { Metadata } from 'next'
import '@/index.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
    title: {
        default: 'Monark Studio',
        template: '%s | Monark Studio'
    },
    description: 'Digital agency yang menyediakan jasa pembuatan website dan aplikasi mobile profesional untuk bisnis Anda.',
    icons: {
        icon: '/assets/logo-circle.png',
        apple: '/assets/logo-circle.png',
    },
    metadataBase: new URL('https://monarkstudio.com'),
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
        { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' }
    ],
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Monark Studio',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="id" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <GoogleAnalytics />
                {children}
                <Toaster position="top-center" richColors closeButton />
            </body>
        </html>
    )
}