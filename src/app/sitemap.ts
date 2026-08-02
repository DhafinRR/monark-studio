import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

/**
 * Generate dynamic sitemap for SEO
 * Includes: homepage, static pages, portfolio projects, and order pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://monarkstd.com'

  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/order`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/order/ai`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic portfolio projects
  const portfolioProjects = await prisma.portfolioProject.findMany({
    select: {
      id: true,
      created_at: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  })

  const portfolioPages: MetadataRoute.Sitemap = portfolioProjects.map((project) => ({
    url: `${baseUrl}/portfolio/${project.id}`,
    lastModified: project.created_at,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...portfolioPages]
}
