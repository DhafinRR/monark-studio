import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { adminLimiter, checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { z } from 'zod'
import { tooManyRequests, badRequest, internalError, notFound } from '@/lib/api-response'

const createPaymentSchema = z.object({
  amount: z.union([z.string(), z.number()]),
  payment_method: z.string().optional(),
  label: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
})

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const order = await prisma.order.findUnique({
      where: { id },
      select: { id: true, name: true, total_price: true }
    })

    if (!order) {
      return notFound('Order not found')
    }

    const payments = await prisma.payment.findMany({
      where: { order_id: id },
      orderBy: { created_at: 'desc' }
    })

    const totalPaid = payments
      .filter(p => p.status === 'CONFIRMED')
      .reduce((sum, p) => sum + Number(p.amount), 0)

    return NextResponse.json({
      order: {
        id: order.id,
        name: order.name,
        total_price: order.total_price
      },
      payments,
      summary: {
        total_order: Number(order.total_price || 0),
        total_paid: totalPaid,
        remaining: Number(order.total_price || 0) - totalPaid
      }
    })
  } catch (error) {
    console.error('[PAYMENTS_GET]', error)
    return internalError('Failed to fetch payments')
  }
}

export async function POST(
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

    const parseResult = createPaymentSchema.safeParse(body)
    if (!parseResult.success) {
      return badRequest(`Validation failed: ${parseResult.error.issues.map(i => i.message).join(', ')}`)
    }

    const order = await prisma.order.findUnique({
      where: { id },
      select: { id: true, total_price: true }
    })

    if (!order) {
      return notFound('Order not found')
    }

    const amount = parseFloat(String(body.amount))

    const payment = await prisma.payment.create({
      data: {
        order_id: id,
        amount,
        payment_method: body.payment_method,
        label: body.label,
        notes: body.notes,
        status: body.status || 'PENDING',
        paid_at: body.status === 'CONFIRMED' ? new Date() : null,
      }
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('[PAYMENT_CREATE]', error)
    return internalError('Failed to create payment')
  }
}
