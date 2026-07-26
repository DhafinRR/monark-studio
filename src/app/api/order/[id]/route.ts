import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        pricing_package: true,
        payments: {
          orderBy: { created_at: 'desc' }
        },
        invoice: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Serialize Decimal to string for JSON response
    const serializedOrder = {
      ...order,
      total_price: order.total_price?.toString() || '0',
      items: order.items.map(item => ({
        ...item,
        price: item.price.toString()
      })),
      payments: order.payments.map(payment => ({
        ...payment,
        amount: payment.amount.toString()
      })),
      invoice: order.invoice ? {
        ...order.invoice,
        amount: order.invoice.amount.toString()
      } : null,
      pricing_package: order.pricing_package ? {
        ...order.pricing_package,
        floor_price: order.pricing_package.floor_price.toString()
      } : null
    }

    return NextResponse.json(serializedOrder)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Delete related records and the order in a transaction
    await prisma.$transaction([
      prisma.orderItem.deleteMany({ where: { order_id: id } }),
      prisma.payment.deleteMany({ where: { order_id: id } }),
      prisma.invoice.deleteMany({ where: { order_id: id } }),
      // Also unlink from portfolio if exists (actually deleting the order might fail if portfolio has a strict foreign key, but order_id in portfolio is optional and unlinked, or we can just set it to null)
      prisma.portfolioProject.updateMany({ 
        where: { order_id: id }, 
        data: { order_id: null } 
      }),
      prisma.order.delete({ where: { id } })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}
