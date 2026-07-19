import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * Duitku Return/Redirect endpoint
 * Client is redirected here after completing payment on Duitku page
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const merchantOrderId = searchParams.get('merchantOrderId') || ''
  const resultCode = searchParams.get('resultCode') || ''

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // Try to find the payment and redirect to the actual order page
  try {
    if (merchantOrderId) {
      const payment = await prisma.payment.findUnique({
        where: { merchant_order_id: merchantOrderId },
        select: { id: true, order_id: true }
      })

      if (payment) {
        // Redirect to the actual order payment page (which has proper UI, polling, and receipt)
        return NextResponse.redirect(
          `${baseUrl}/order/${payment.order_id}/payment/${payment.id}`
        )
      }
    }
  } catch (error) {
    console.error('[PAYMENT_RETURN] Lookup error:', error)
  }

  // Fallback: redirect to generic status page
  let redirectUrl = `${baseUrl}/payment/status?ref=${merchantOrderId}`
  
  if (resultCode === '00') {
    redirectUrl += '&status=success'
  } else if (resultCode === '01') {
    redirectUrl += '&status=pending'
  } else {
    redirectUrl += '&status=failed'
  }

  return NextResponse.redirect(redirectUrl)
}
