import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * Fetch a single official invoice with full relation tree
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        items: true
                    }
                }
            }
        })

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
        }

        return NextResponse.json(invoice)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch invoice detail' }, { status: 500 })
    }
}
