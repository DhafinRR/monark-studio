import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { adminLimiter, checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { tooManyRequests, internalError, notFound, badRequest } from '@/lib/api-response'
import { createHistoryEntry, addHistoryEntry, getOrderSnapshot, OrderHistoryEntry } from '@/lib/order-history'

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
                pricing_package: true,
                payments: {
                    orderBy: { created_at: 'desc' }
                }
            }
        })

        if (!order) {
            return notFound('Order not found')
        }

        return NextResponse.json(order)
    } catch (error: any) {
        console.error('[ORDER_GET]', error)
        return internalError(`Failed to fetch order: ${error.message}`)
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

        const currentOrder = await prisma.order.findUnique({
            where: { id },
            include: { items: true }
        })

        if (!currentOrder) {
            return notFound('Order not found')
        }

        const previousSnapshot = getOrderSnapshot({
            name: currentOrder.name,
            whatsapp: currentOrder.whatsapp,
            email: currentOrder.email,
            details: currentOrder.details,
            status: currentOrder.status,
            total_price: currentOrder.total_price,
            items: currentOrder.items
        })

        const order = await prisma.$transaction(async (tx) => {
            let totalPrice = undefined
            let historyAction: 'updated_items' | 'updated_status' | 'updated_details' = 'updated_details'
            
            if (body.items) {
                historyAction = 'updated_items'
                const itemsTotal = body.items.reduce((sum: number, item: any) => sum + parseFloat(item.price), 0)

                const currentOrderData = await tx.order.findUnique({ where: { id }, select: { package_id: true, platform: true } })
                const pkgId = body.package_id ?? currentOrderData?.package_id
                const pkg = pkgId ? await tx.pricingPackage.findUnique({ where: { id: pkgId }, select: { id: true, floor_price: true } }) : null
                let floorPrice = pkg ? Number(pkg.floor_price) : 0
                const platform = body.platform ?? currentOrderData?.platform
                if (pkg?.id === 'mobile_app' && platform === 'BOTH') {
                  floorPrice *= 1.8
                }
                totalPrice = floorPrice + itemsTotal

                await tx.orderItem.deleteMany({
                    where: { order_id: id }
                })
            }

            if (body.status && body.status !== currentOrder.status) {
                historyAction = 'updated_status'
            }

            const updatedOrder = await tx.order.update({
                where: { id },
                data: {
                    name: body.name,
                    whatsapp: body.whatsapp,
                    email: body.email,
                    package_id: body.package_id,
                    platform: body.platform,
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

            const newSnapshot = getOrderSnapshot({
                name: updatedOrder.name,
                whatsapp: updatedOrder.whatsapp,
                email: updatedOrder.email,
                details: updatedOrder.details,
                status: updatedOrder.status,
                total_price: updatedOrder.total_price,
                items: updatedOrder.items
            })
            const historyEntry = createHistoryEntry(
                historyAction,
                `Order ${historyAction === 'updated_items' ? 'items' : historyAction === 'updated_status' ? 'status' : 'details'} updated`,
                previousSnapshot,
                newSnapshot
            )

            const currentHistory = (currentOrder.history as unknown as OrderHistoryEntry[]) || []
            const newHistory = addHistoryEntry(currentHistory, historyEntry)

            await tx.order.update({
                where: { id },
                data: {
                    history: newHistory as any
                }
            })

            return updatedOrder
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
