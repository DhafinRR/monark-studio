import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()

    const pkg = await prisma.pricingPackage.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.tagline !== undefined && { tagline: body.tagline || null }),
        ...(body.target !== undefined && { target: body.target || null }),
        ...(body.price_note !== undefined && { price_note: body.price_note || null }),
        ...(body.floor_price !== undefined && { floor_price: body.floor_price }),
        ...(body.max_slots !== undefined && { max_slots: body.max_slots }),
        ...(body.benefits !== undefined && { benefits: body.benefits }),
        ...(body.default_features !== undefined && { default_features: body.default_features }),
        ...(body.is_popular !== undefined && { is_popular: body.is_popular }),
        ...(body.is_active !== undefined && { is_active: body.is_active }),
      }
    })

    return NextResponse.json(pkg)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Paket tidak ditemukan.' }, { status: 404 })
    }
    console.error('Update package error:', error)
    return NextResponse.json({ error: 'Gagal mengupdate paket.' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Check if any orders reference this package
    const orderCount = await prisma.order.count({ where: { package_id: id } })
    if (orderCount > 0) {
      return NextResponse.json(
        { error: `Tidak bisa menghapus paket ini karena masih digunakan oleh ${orderCount} order.` },
        { status: 409 }
      )
    }

    await prisma.pricingPackage.delete({ where: { id } })
    return NextResponse.json({ message: 'Paket berhasil dihapus.' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Paket tidak ditemukan.' }, { status: 404 })
    }
    console.error('Delete package error:', error)
    return NextResponse.json({ error: 'Gagal menghapus paket.' }, { status: 500 })
  }
}
