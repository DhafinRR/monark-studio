import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { deleteFromStorage } from '@/lib/supabase'

/**
 * GET: Mengambil satu Portfolio Project berdasarkan ID
 */
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
      return NextResponse.json({ error: 'Portfolio tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('[PORTFOLIO_GET_BY_ID]', error)
    return NextResponse.json({ error: 'Gagal mengambil data Portfolio' }, { status: 500 })
  }
}

/**
 * PATCH: Update sebagian data Portfolio Project
 * Stacks menggunakan `set` (replace relasi).
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
      return NextResponse.json({ error: 'Portfolio tidak ditemukan' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Gagal mengupdate Portfolio' }, { status: 500 })
  }
}

/**
 * DELETE: Menghapus Portfolio Project berdasarkan ID
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch record to get image URLs before deleting
    const project = await prisma.portfolioProject.findUnique({
      where: { id },
      select: { image_url: true, gallery: true },
    })

    await prisma.portfolioProject.delete({
      where: { id },
    })

    // Clean up storage (non-blocking, don't fail the request if storage delete fails)
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
      return NextResponse.json({ error: 'Portfolio tidak ditemukan' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Gagal menghapus Portfolio' }, { status: 500 })
  }
}
