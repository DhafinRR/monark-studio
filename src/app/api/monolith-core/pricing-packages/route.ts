import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const packages = await prisma.pricingPackage.findMany({
      orderBy: { floor_price: 'asc' }
    })
    return NextResponse.json(packages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.id || !body.name || body.floor_price == null || body.max_slots == null) {
      return NextResponse.json({ error: 'ID, nama, harga dasar, dan max slot wajib diisi.' }, { status: 400 })
    }

    const pkg = await prisma.pricingPackage.create({
      data: {
        id: body.id,
        name: body.name,
        tagline: body.tagline || null,
        target: body.target || null,
        price_note: body.price_note || null,
        floor_price: body.floor_price,
        max_slots: body.max_slots,
        benefits: body.benefits || [],
        default_features: body.default_features || [],
        is_popular: body.is_popular || false,
        is_active: body.is_active ?? true,
      }
    })

    return NextResponse.json(pkg, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'ID paket sudah digunakan.' }, { status: 409 })
    }
    console.error('Create package error:', error)
    return NextResponse.json({ error: 'Gagal membuat paket.' }, { status: 500 })
  }
}
