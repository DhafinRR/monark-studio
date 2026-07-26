import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { adminLimiter, checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { createOrderSchema } from '@/lib/validations'
import { badRequest, tooManyRequests, internalError } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        pricing_package: { select: { id: true, name: true } },
        _count: {
          select: { items: true }
        }
      },
      orderBy: { created_at: 'desc' }
    })
    return NextResponse.json(orders)
  } catch (error) {
    return internalError('Failed to fetch orders')
  }
}

export async function POST(req: Request) {
  const ip = getClientIP(req)
  const rateCheck = await checkRateLimit(adminLimiter, ip)
  if (!rateCheck.allowed) {
    return tooManyRequests(rateCheck.retryAfter!)
  }

  try {
    const body = await req.json()

    const parseResult = createOrderSchema.safeParse(body)
    if (!parseResult.success) {
      return badRequest(`Validation failed: ${parseResult.error.issues.map(i => i.message).join(', ')}`)
    }

    const order = await prisma.$transaction(async (tx) => {
      const pkg = body.package_id
        ? await tx.pricingPackage.findUnique({ where: { id: body.package_id } })
        : null

      const itemsTotal = body.items.reduce((sum: number, item: any) => sum + parseFloat(item.price), 0)
      let floorPrice = pkg ? Number(pkg.floor_price) : 0
      if (pkg?.id === 'mobile_app' && body.platform === 'BOTH') {
        floorPrice *= 1.8
      }
      const totalPrice = floorPrice + itemsTotal

      return await tx.order.create({
        data: {
          project_title: body.project_title || null,
          name: body.name,
          whatsapp: body.whatsapp,
          email: body.email,
          package_id: body.package_id || null,
          platform: body.platform || null,
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
    return internalError('Gagal membuat pesanan')
  }
}
