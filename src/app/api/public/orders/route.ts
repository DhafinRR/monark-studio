import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const order = await prisma.$transaction(async (tx) => {
      // 1. Hitung total price
      const totalPrice = body.items.reduce((sum: number, item: any) => sum + parseFloat(item.price), 0)

      // 2. Buat Order
      return await tx.order.create({
        data: {
          name: body.name,
          whatsapp: body.whatsapp,
          email: body.email,
          package_type: body.package_type || 'Custom Services',
          details: body.details,
          status: 'DRAFT', // Or 'NEW' if it should distinguish public orders
          total_price: totalPrice,
          items: {
            create: body.items.map((item: any) => ({
              type: item.type,
              description: item.description,
              price: item.price,
              level: item.level,
              sub_level: item.sub_level,
              reason: item.reason,
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
