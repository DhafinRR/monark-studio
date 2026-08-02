'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

const EXCLUDED_PATHS = ['/gatekeeper', '/monolith-core']

export default function GoogleAnalytics() {
  const pathname = usePathname()

  if (!GA_MEASUREMENT_ID) return null

  const isExcluded = EXCLUDED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  if (isExcluded) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}