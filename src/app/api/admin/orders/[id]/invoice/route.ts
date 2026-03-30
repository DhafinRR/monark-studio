import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * Generate or Fetch Invoice for an Order
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const invoice = await prisma.invoice.findUnique({
            where: { order_id: id }
        })
        return NextResponse.json(invoice)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 })
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        
        // 1. Fetch Order details
        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: true }
        })

        if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

        // 2. Generate Invoice Number (INV-2024-XXXX)
        const year = new Date().getFullYear()
        const count = await prisma.invoice.count()
        const invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`

        // 3. Create Invoice in DB
        const invoice = await prisma.invoice.create({
            data: {
                invoice_number: invoiceNumber,
                amount: order.total_price || 0,
                status: 'unpaid',
                order_id: id,
                issued_at: new Date()
            }
        })

        return NextResponse.json(invoice)
    } catch (error) {
        console.error("Invoice Creation Error:", error)
        return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 })
    }
}

/**
 * Manual Update Invoice (Mark as Paid/Cancelled)
 */
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await req.json()

        const invoice = await prisma.invoice.update({
            where: { order_id: id },
            data: {
                status: body.status, // paid, unpaid, cancelled
                paid_at: body.status === 'paid' ? new Date() : null,
                payment_method: body.payment_method || undefined
            }
        })

        return NextResponse.json(invoice)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
    }
}
