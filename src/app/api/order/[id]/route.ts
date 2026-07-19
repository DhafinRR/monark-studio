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
