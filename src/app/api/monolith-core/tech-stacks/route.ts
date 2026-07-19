import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET: Mengambil semua daftar Technology Stack
 * Termasuk jumlah proyek yang menggunakan stack tersebut.
 */
export async function GET() {
  try {
    const techStacks = await prisma.techStack.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { projects: true }
        }
      }
    })
    return NextResponse.json(techStacks)
  } catch (error) {
    console.error('[TECH_STACKS_GET]', error)
    return NextResponse.json({ error: 'Gagal mengambil data Tech Stacks' }, { status: 500 })
  }
}

/**
 * POST: Membuat Technology Stack baru
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, icon_url, color_hex } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Nama tech stack wajib diisi' }, { status: 400 })
    }

    const techStack = await prisma.techStack.create({
      data: {
        name: name.trim(),
        icon_url: icon_url || null,
        color_hex: color_hex || '#3b82f6',
      }
    })

    return NextResponse.json(techStack, { status: 201 })
  } catch (error: any) {
    console.error('[TECH_STACKS_POST]', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Tech stack dengan nama tersebut sudah ada' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Gagal membuat Tech Stack' }, { status: 500 })
  }
}
