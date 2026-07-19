import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET: Mengambil satu Tech Stack berdasarkan ID
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const techStack = await prisma.techStack.findUnique({
      where: { id },
      include: {
        _count: {
          select: { projects: true }
        }
      }
    })

    if (!techStack) {
      return NextResponse.json({ error: 'Tech Stack tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(techStack)
  } catch (error) {
    console.error('[TECH_STACK_GET_BY_ID]', error)
    return NextResponse.json({ error: 'Gagal mengambil data Tech Stack' }, { status: 500 })
  }
}

/**
 * PATCH: Update sebagian data Tech Stack
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, icon_url, color_hex } = body

    const data: Record<string, unknown> = {}
    if (name !== undefined) data.name = name.trim()
    if (icon_url !== undefined) data.icon_url = icon_url || null
    if (color_hex !== undefined) data.color_hex = color_hex || '#3b82f6'

    const techStack = await prisma.techStack.update({
      where: { id },
      data,
    })

    return NextResponse.json(techStack)
  } catch (error: any) {
    console.error('[TECH_STACK_PATCH]', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Tech stack dengan nama tersebut sudah ada' }, { status: 409 })
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Tech Stack tidak ditemukan' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Gagal mengupdate Tech Stack' }, { status: 500 })
  }
}

/**
 * DELETE: Menghapus Tech Stack berdasarkan ID
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.techStack.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Tech Stack berhasil dihapus' })
  } catch (error: any) {
    console.error('[TECH_STACK_DELETE]', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Tech Stack tidak ditemukan' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Gagal menghapus Tech Stack' }, { status: 500 })
  }
}
