/**
 * Structured Data Component untuk SEO
 * Menggunakan JSON-LD format untuk Google Rich Snippets
 *
 * Note: Menggunakan regular <script> tag karena ini static JSON-LD data,
 * bukan client-side JavaScript yang perlu next/script
 */

interface LocalBusinessData {
  name: string
  description: string
  url: string
  telephone?: string
  email?: string
  address?: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  geo?: {
    latitude: number
    longitude: number
  }
  openingHours?: string[]
  priceRange?: string
  image?: string
  sameAs?: string[] // Social media profiles
}

interface OrganizationData {
  name: string
  description: string
  url: string
  logo: string
  foundingDate?: string
  email?: string
  telephone?: string
  sameAs?: string[]
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface WebsiteData {
  name: string
  url: string
  description: string
  potentialAction?: {
    target: string
    queryInput: string
  }
}

interface StructuredDataProps {
  type: 'LocalBusiness' | 'Organization' | 'BreadcrumbList' | 'WebSite'
  data: LocalBusinessData | OrganizationData | BreadcrumbItem[] | WebsiteData
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  let schema: any

  switch (type) {
    case 'LocalBusiness':
      const businessData = data as LocalBusinessData
      schema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': businessData.url,
        name: businessData.name,
        description: businessData.description,
        url: businessData.url,
        telephone: businessData.telephone,
        email: businessData.email,
        priceRange: businessData.priceRange || '$$',
        image: businessData.image,
        ...(businessData.address && {
          address: {
            '@type': 'PostalAddress',
            streetAddress: businessData.address.streetAddress,
            addressLocality: businessData.address.addressLocality,
            addressRegion: businessData.address.addressRegion,
            postalCode: businessData.address.postalCode,
            addressCountry: businessData.address.addressCountry,
          },
        }),
        ...(businessData.geo && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: businessData.geo.latitude,
            longitude: businessData.geo.longitude,
          },
        }),
        ...(businessData.openingHours && {
          openingHoursSpecification: businessData.openingHours.map((hours) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: hours,
          })),
        }),
        ...(businessData.sameAs && { sameAs: businessData.sameAs }),
      }
      break

    case 'Organization':
      const orgData = data as OrganizationData
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${orgData.url}#organization`,
        name: orgData.name,
        description: orgData.description,
        url: orgData.url,
        logo: {
          '@type': 'ImageObject',
          url: orgData.logo,
        },
        ...(orgData.foundingDate && { foundingDate: orgData.foundingDate }),
        ...(orgData.email && { email: orgData.email }),
        ...(orgData.telephone && { telephone: orgData.telephone }),
        ...(orgData.sameAs && { sameAs: orgData.sameAs }),
      }
      break

    case 'BreadcrumbList':
      const breadcrumbData = data as BreadcrumbItem[]
      schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbData.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }
      break

    case 'WebSite':
      const websiteData = data as WebsiteData
      schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${websiteData.url}#website`,
        name: websiteData.name,
        url: websiteData.url,
        description: websiteData.description,
        ...(websiteData.potentialAction && {
          potentialAction: {
            '@type': 'SearchAction',
            target: websiteData.potentialAction.target,
            'query-input': websiteData.potentialAction.queryInput,
          },
        }),
      }
      break

    default:
      return null
  }

  return (
    <script
      id={`structured-data-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Pre-configured Monark Studio Business Schema
 * Usage: <MonarkStudioSchema />
 */
export function MonarkStudioSchema() {
  const businessData: LocalBusinessData = {
    name: 'Monark Studio',
    description: 'Jasa pembuatan website, aplikasi mobile, dan sistem informasi untuk UMKM, perusahaan, dan startup di Indonesia.',
    url: 'https://monarkstudio.com',
    telephone: '+62-813-2263-9234',
    email: 'contact@monarkstudio.com',
    priceRange: '$$',
    image: 'https://monarkstudio.com/assets/logo-circle.png',
    address: {
      streetAddress: 'Jl. Contoh No. 123', // Update dengan alamat real
      addressLocality: 'Jakarta',
      addressRegion: 'DKI Jakarta',
      postalCode: '12345',
      addressCountry: 'ID',
    },
    sameAs: [
      // 'https://www.facebook.com/monarkstudio', // Update dengan social media real
      // 'https://www.instagram.com/monarkstudio',
      // 'https://www.linkedin.com/company/monarkstudio',
    ],
  }

  const orgData: OrganizationData = {
    name: 'Monark Studio',
    description: 'Digital agency yang menyediakan jasa pembuatan website dan aplikasi mobile profesional.',
    url: 'https://monarkstudio.com',
    logo: 'https://monarkstudio.com/assets/logo-circle.png',
    foundingDate: '2020-01-01', // Update dengan tahun real
    telephone: '+62-813-2263-9234',
    email: 'contact@monarkstudio.com',
    sameAs: businessData.sameAs,
  }

  const websiteData: WebsiteData = {
    name: 'Monark Studio',
    url: 'https://monarkstudio.com',
    description: 'Jasa pembuatan website dan aplikasi mobile profesional untuk bisnis Anda.',
  }

  return (
    <>
      <StructuredData type="LocalBusiness" data={businessData} />
      <StructuredData type="Organization" data={orgData} />
      <StructuredData type="WebSite" data={websiteData} />
    </>
  )
}
