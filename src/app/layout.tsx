import type { Metadata } from 'next'
import '@/index.css'
import { Toaster } from 'sonner'

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
                {children}
                <Toaster richColors position="top-center" />
            </body>
        </html>
    )
}