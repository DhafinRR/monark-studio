import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import ProjectDetailContent from "@/components/portfolio/ProjectDetailContent"
import { Metadata } from "next"

export const dynamic = 'force-dynamic'
interface ProjectPageProps {
  params: Promise<{ id: string }>
}

/**
 * Metadata dinamis untuk SEO dengan OpenGraph lengkap
 */
export async function generateMetadata(
  { params }: ProjectPageProps
): Promise<Metadata> {
  const { id } = await params
  const project = await prisma.portfolioProject.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
      image_url: true,
      type: true,
      project_url: true,
    }
  })

  if (!project) return { title: "Project Not Found" }

  const projectUrl = `https://monarkstudio.com/portfolio/${id}`

  return {
    title: `${project.title} | Monark Studio Portfolio`,
    description: project.description,
    keywords: [
      project.title,
      `portfolio ${project.type.toLowerCase()}`,
      'monark studio project',
      project.type === 'WEB' ? 'web development' : 'mobile app development',
    ],
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: projectUrl,
      siteName: 'Monark Studio',
      title: `${project.title} | Monark Studio Portfolio`,
      description: project.description,
      images: [
        {
          url: project.image_url,
          width: 1200,
          height: 630,
          alt: `${project.title} - Monark Studio Project`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | Monark Studio Portfolio`,
      description: project.description,
      images: [project.image_url],
    },
    alternates: {
      canonical: projectUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

/**
 * Server Component untuk halaman detail portfolio
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params

  const project = await prisma.portfolioProject.findUnique({
    where: { id },
    include: {
      stacks: {
        select: {
          id: true,
          name: true,
          color_hex: true,
          icon_url: true,
        }
      }
    }
  })

  if (!project) {
    notFound()
  }

  // Ambil proyek berikutnya untuk navigasi bawah
  const nextProject = await prisma.portfolioProject.findFirst({
    where: {
      id: { not: id }
    },
    select: {
      id: true,
      title: true,
      image_url: true
    }
  })

  // Konversi data Date ke string untuk Client Component (karena Next.js RSC -> Client boundary)
  const safeProject = {
    ...project,
    start_date: project.start_date?.toISOString() || null,
    end_date: project.end_date?.toISOString() || null,
    created_at: project.created_at.toISOString(),
  }

  return <ProjectDetailContent project={safeProject as any} nextProject={nextProject} />
}
