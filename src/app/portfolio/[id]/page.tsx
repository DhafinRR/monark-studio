import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import ProjectDetailContent from "@/components/portfolio/ProjectDetailContent"
import { Metadata } from "next"

export const dynamic = 'force-dynamic'
interface ProjectPageProps {
  params: Promise<{ id: string }>
}

/**
 * Metadata dinamis untuk SEO
 */
export async function generateMetadata(
  { params }: ProjectPageProps
): Promise<Metadata> {
  const { id } = await params
  const project = await prisma.portfolioProject.findUnique({
    where: { id },
    select: { title: true, description: true }
  })

  if (!project) return { title: "Project Not Found" }

  return {
    title: `${project.title} | Monark Studio Portfolio`,
    description: project.description,
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
