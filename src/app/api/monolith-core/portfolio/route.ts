import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET: Mengambil semua Portfolio Project
 * Include relasi stacks, diurutkan berdasarkan created_at desc.
 */
export async function GET() {
  try {
    const projects = await prisma.portfolioProject.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        stacks: true,
      },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('[PORTFOLIO_GET]', error)
    return NextResponse.json({ error: 'Gagal mengambil data Portfolio' }, { status: 500 })
  }
}

/**
 * POST: Membuat Portfolio Project baru
 * Body: { title, description, full_description?, type?, image_url, gallery?, stacks? (string[]), features?, client_name?, project_url? }
 */
export async function POST(req: Request) {
  try {
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

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Judul portfolio wajib diisi' }, { status: 400 })
    }
    if (!description || typeof description !== 'string' || !description.trim()) {
      return NextResponse.json({ error: 'Deskripsi portfolio wajib diisi' }, { status: 400 })
    }
    if (!image_url || typeof image_url !== 'string' || !image_url.trim()) {
      return NextResponse.json({ error: 'URL gambar wajib diisi' }, { status: 400 })
    }

    const project = await prisma.portfolioProject.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        full_description: full_description || null,
        type: type || 'WEB',
        image_url: image_url.trim(),
        gallery: Array.isArray(gallery) ? gallery : [],
        features: Array.isArray(features) ? features : [],
        client_name: client_name || null,
        project_url: project_url || null,
        role: role || null,
        status: status || 'Live',
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        stacks: Array.isArray(stacks) && stacks.length > 0
          ? { connect: stacks.map((id: string) => ({ id })) }
          : undefined,
      },
      include: {
        stacks: true,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('[PORTFOLIO_POST]', error)
    return NextResponse.json({ error: 'Gagal membuat Portfolio' }, { status: 500 })
  }
}
