import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkTransaction } from '@/lib/duitku'

/**
 * Manually check payment status on Duitku
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const { paymentId } = await params

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    if (!payment.merchant_order_id) {
      return NextResponse.json({ error: 'Payment has no Duitku transaction' }, { status: 400 })
    }

    // Already confirmed, no need to check
    if (payment.status === 'CONFIRMED') {
      return NextResponse.json({
        status: 'CONFIRMED',
        message: 'Payment already confirmed'
      })
    }

    const result = await checkTransaction(payment.merchant_order_id)

    // Update status based on Duitku response
    // statusCode: "00" = SUCCESS, "01" = PROCESS, "02" = FAILED/EXPIRED
    if (result.statusCode === '00' && payment.status !== 'CONFIRMED') {
      const updated = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'CONFIRMED',
          paid_at: new Date(),
          duitku_reference: result.reference || payment.duitku_reference,
        }
      })
      return NextResponse.json({
        status: 'CONFIRMED',
        message: 'Payment confirmed!',
        payment: updated
      })
    } else if (result.statusCode === '02') {
      const updated = await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'EXPIRED' }
      })
      return NextResponse.json({
        status: 'EXPIRED',
        message: 'Payment expired or failed',
        payment: updated
      })
    }

    return NextResponse.json({
      status: 'PENDING',
      message: result.statusMessage || 'Payment still pending',
      duitku_status: result
    })
  } catch (error: any) {
    console.error('[PAYMENT_CHECK]', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check payment status' },
      { status: 500 }
    )
  }
}
