import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { adminLimiter, checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { z } from 'zod'
import { tooManyRequests, badRequest, internalError, notFound } from '@/lib/api-response'

const updatePaymentSchema = z.object({
  amount: z.union([z.string(), z.number()]).optional(),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; paymentId: string }> }
) {
  const ip = getClientIP(req)
  const rateCheck = await checkRateLimit(adminLimiter, ip)
  if (!rateCheck.allowed) {
    return tooManyRequests(rateCheck.retryAfter!)
  }

  try {
    const { id, paymentId } = await params
    const body = await req.json()

    const parseResult = updatePaymentSchema.safeParse(body)
    if (!parseResult.success) {
      return badRequest(`Validation failed: ${parseResult.error.issues.map(i => i.message).join(', ')}`)
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId, order_id: id }
    })

    if (!payment) {
      return notFound('Payment not found')
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        amount: body.amount !== undefined ? parseFloat(String(body.amount)) : undefined,
        payment_method: body.payment_method,
        notes: body.notes,
        status: body.status,
        paid_at: body.status === 'CONFIRMED' && !payment.paid_at ? new Date() : 
                 body.status !== 'CONFIRMED' ? null : payment.paid_at
      }
    })

    return NextResponse.json(updatedPayment)
  } catch (error) {
    console.error('[PAYMENT_UPDATE]', error)
    return internalError('Failed to update payment')
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; paymentId: string }> }
) {
  const ip = getClientIP(req)
  const rateCheck = await checkRateLimit(adminLimiter, ip)
  if (!rateCheck.allowed) {
    return tooManyRequests(rateCheck.retryAfter!)
  }

  try {
    const { id, paymentId } = await params

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId, order_id: id }
    })

    if (!payment) {
      return notFound('Payment not found')
    }

    await prisma.payment.delete({
      where: { id: paymentId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PAYMENT_DELETE]', error)
    return internalError('Failed to delete payment')
  }
}
