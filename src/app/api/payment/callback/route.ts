import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyCallback } from '@/lib/duitku'

/**
 * Duitku Callback endpoint
 * Receives POST with x-www-form-urlencoded from Duitku when payment is completed
 */
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || ''
    
    let params: Record<string, string> = {}
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData()
      formData.forEach((value, key) => {
        params[key] = value.toString()
      })
    } else if (contentType.includes('application/json')) {
      params = await req.json()
    } else {
      // Try form data as fallback
      const text = await req.text()
      const searchParams = new URLSearchParams(text)
      searchParams.forEach((value, key) => {
        params[key] = value
      })
    }

    const { merchantCode, amount, merchantOrderId, resultCode, reference, signature } = params

    console.log('[DUITKU_CALLBACK]', { merchantOrderId, resultCode, reference, amount })

    // Validate required params
    if (!merchantCode || !amount || !merchantOrderId || !signature) {
      console.error('[DUITKU_CALLBACK] Bad parameters', params)
      return new NextResponse('Bad Parameter', { status: 400 })
    }

    // Verify signature
    const isValid = verifyCallback({
      merchantCode,
      amount,
      merchantOrderId,
      resultCode,
      reference,
      signature,
      productDetail: params.productDetail,
      additionalParam: params.additionalParam,
      paymentCode: params.paymentCode,
      merchantUserId: params.merchantUserId,
      publisherOrderId: params.publisherOrderId,
      spUserHash: params.spUserHash,
      settlementDate: params.settlementDate,
      issuerCode: params.issuerCode,
    })

    if (!isValid) {
      console.error('[DUITKU_CALLBACK] Bad signature', { merchantOrderId })
      return new NextResponse('Bad Signature', { status: 400 })
    }

    // Find payment by merchant_order_id
    const payment = await prisma.payment.findUnique({
      where: { merchant_order_id: merchantOrderId }
    })

    if (!payment) {
      console.error('[DUITKU_CALLBACK] Payment not found', { merchantOrderId })
      return new NextResponse('Payment not found', { status: 404 })
    }

    // resultCode "00" = SUCCESS, "01" = PROCESS, "02" = FAILED/EXPIRED
    if (resultCode === '00') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'CONFIRMED',
          duitku_reference: reference,
          payment_method: params.paymentCode || payment.payment_method,
          paid_at: new Date(),
        }
      })
      console.log('[DUITKU_CALLBACK] Payment confirmed:', merchantOrderId)
    } else if (resultCode === '02') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'EXPIRED',
          duitku_reference: reference,
        }
      })
      console.log('[DUITKU_CALLBACK] Payment expired/failed:', merchantOrderId)
    }
    // resultCode "01" = still processing, no status change

    // Duitku expects HTTP 200 OK
    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('[DUITKU_CALLBACK] Error:', error)
    // Still return 200 to prevent Duitku from retrying on server errors
    return new NextResponse('OK', { status: 200 })
  }
}
