import type { Metadata } from 'next'
import '@/index.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'

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
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <GoogleAnalytics />
                {children}
            </body>
        </html>
    )
}