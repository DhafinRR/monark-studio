import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * Handle Single Order API
 */
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
                invoice: true
            }
        })

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        return NextResponse.json(order)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await req.json()

        const order = await prisma.$transaction(async (tx) => {
            // 1. Hitung total price jika items disertakan
            let totalPrice = undefined
            if (body.items) {
                totalPrice = body.items.reduce((sum: number, item: any) => sum + parseFloat(item.price), 0)
                
                // 2. Sync Items: Delete lama, Create baru
                await tx.orderItem.deleteMany({
                    where: { order_id: id }
                })
            }

            // 3. Update Order metadata & Create new items
            return await tx.order.update({
                where: { id },
                data: {
                    name: body.name,
                    whatsapp: body.whatsapp,
                    email: body.email,
                    package_type: body.package_type,
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
                                description: item.description,
                                price: item.price,
                                level: item.level,
                                sub_level: item.sub_level,
                                reason: item.reason,
                                feature_id: item.feature_id
                            }))
                        }
                    } : {})
                },
                include: { items: true }
            })
        })

        return NextResponse.json(order)
    } catch (error) {
        console.error("Order Update Error:", error)
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }
}
