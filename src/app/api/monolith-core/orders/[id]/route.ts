import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { adminLimiter, checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { tooManyRequests, internalError, notFound } from '@/lib/api-response'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
                invoice: true,
                pricing_package: true
            }
        })

        if (!order) {
            return notFound('Order not found')
        }

        return NextResponse.json(order)
    } catch (error) {
        return internalError('Failed to fetch order')
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

        const order = await prisma.$transaction(async (tx) => {
            let totalPrice = undefined
            if (body.items) {
                const itemsTotal = body.items.reduce((sum: number, item: any) => sum + parseFloat(item.price), 0)

                const currentOrder = await tx.order.findUnique({ where: { id }, select: { package_id: true } })
                const pkgId = body.package_id ?? currentOrder?.package_id
                const pkg = pkgId ? await tx.pricingPackage.findUnique({ where: { id: pkgId }, select: { floor_price: true } }) : null
                totalPrice = (pkg ? Number(pkg.floor_price) : 0) + itemsTotal

                await tx.orderItem.deleteMany({
                    where: { order_id: id }
                })
            }

            return await tx.order.update({
                where: { id },
                data: {
                    name: body.name,
                    whatsapp: body.whatsapp,
                    email: body.email,
                    package_id: body.package_id,
                    status: body.status,
                    asset_link: body.asset_link,
                    preview_link: body.preview_link,
                    details: body.details,
                    story: body.story,
                    total_price: totalPrice,
                    ...(body.items ? {
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
                    } : {})
                },
                include: { items: true }
            })
        })

        return NextResponse.json(order)
    } catch (error: any) {
        console.error("Order Update Error:", error)
        if (error.code === 'P2025') {
            return notFound('Order not found')
        }
        return internalError('Failed to update order')
    }
}
