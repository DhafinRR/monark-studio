import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { adminLimiter, checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { deleteFromStorage } from '@/lib/supabase'
import { tooManyRequests, internalError, notFound } from '@/lib/api-response'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await prisma.portfolioProject.findUnique({
      where: { id },
      include: {
        stacks: true,
      },
    })

    if (!project) {
      return notFound('Portfolio tidak ditemukan')
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('[PORTFOLIO_GET_BY_ID]', error)
    return internalError('Gagal mengambil data Portfolio')
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIP(req)
  const rateCheck = await checkRateLimit(adminLimiter, ip)
  if (!rateCheck.allowed) {
    return tooManyRequests(rateCheck.retryAfter!)
  }

  try {
    const { id } = await params
    const body = await req.json()
    const {
      title,
      description,
      full_description,
      type,
      image_url,
      gallery,
      stacks,
      features,
      client_name,
      project_url,
      role,
      status,
      start_date,
      end_date,
    } = body

    const data: Record<string, unknown> = {}
    if (title !== undefined) data.title = title.trim()
    if (description !== undefined) data.description = description.trim()
    if (full_description !== undefined) data.full_description = full_description || null
    if (type !== undefined) data.type = type
    if (image_url !== undefined) data.image_url = image_url.trim()
    if (gallery !== undefined) data.gallery = gallery
    if (features !== undefined) data.features = features
    if (client_name !== undefined) data.client_name = client_name || null
    if (project_url !== undefined) data.project_url = project_url || null
    if (role !== undefined) data.role = role || null
    if (status !== undefined) data.status = status || 'Live'
    if (start_date !== undefined) data.start_date = start_date ? new Date(start_date) : null
    if (end_date !== undefined) data.end_date = end_date ? new Date(end_date) : null
    if (stacks !== undefined) {
      data.stacks = {
        set: Array.isArray(stacks)
          ? stacks.map((stackId: string) => ({ id: stackId }))
          : [],
      }
    }

    const project = await prisma.portfolioProject.update({
      where: { id },
      data,
      include: {
        stacks: true,
      },
    })

    return NextResponse.json(project)
  } catch (error: any) {
    console.error('[PORTFOLIO_PATCH]', error)
    if (error.code === 'P2025') {
      return notFound('Portfolio tidak ditemukan')
    }
    return internalError('Gagal mengupdate Portfolio')
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIP(req)
  const rateCheck = await checkRateLimit(adminLimiter, ip)
  if (!rateCheck.allowed) {
    return tooManyRequests(rateCheck.retryAfter!)
  }

  try {
    const { id } = await params

    const project = await prisma.portfolioProject.findUnique({
      where: { id },
      select: { image_url: true, gallery: true },
    })

    await prisma.portfolioProject.delete({
      where: { id },
    })

    if (project) {
      const urlsToDelete = [project.image_url, ...project.gallery].filter(Boolean)
      deleteFromStorage(urlsToDelete).catch(err =>
        console.error('[PORTFOLIO_DELETE_STORAGE]', err)
      )
    }

    return NextResponse.json({ message: 'Portfolio berhasil dihapus' })
  } catch (error: any) {
    console.error('[PORTFOLIO_DELETE]', error)
    if (error.code === 'P2025') {
      return notFound('Portfolio tidak ditemukan')
    }
    return internalError('Gagal menghapus Portfolio')
  }
}
