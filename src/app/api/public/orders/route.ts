import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const order = await prisma.$transaction(async (tx) => {
      // 1. Fetch package for snapshot & floor_price
      const pkg = body.package_id
        ? await tx.pricingPackage.findUnique({ where: { id: body.package_id } })
        : null

      // 2. Grand total = floor_price + sum(item prices)
      const itemsTotal = body.items.reduce((sum: number, item: any) => sum + parseFloat(item.price), 0)
      const totalPrice = (pkg ? Number(pkg.floor_price) : 0) + itemsTotal

      // 3. Buat Order
      return await tx.order.create({
        data: {
          project_title: body.project_title || null,
          name: body.name,
          whatsapp: body.whatsapp,
          email: body.email,
          package_id: body.package_id || null,
          package_snapshot: pkg ? {
            id: pkg.id,
            name: pkg.name,
            floor_price: Number(pkg.floor_price),
            max_slots: pkg.max_slots,
            benefits: pkg.benefits,
            default_features: pkg.default_features,
          } as any : undefined,
          details: body.details,
          status: 'DRAFT',
          total_price: totalPrice,
          items: {
            create: body.items.map((item: any) => ({
              type: item.type,
              classification: item.classification,
              description: item.description,
              price: item.price,
              level: item.level,
              sub_level: item.sub_level,
              reason: item.reason,
              custom_note: item.custom_note,
              feature_id: item.feature_id
            }))
          }
        }
      })
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Order Creation Error:", error)
    return NextResponse.json({ error: 'Gagal membuat pesanan' }, { status: 500 })
  }
}
