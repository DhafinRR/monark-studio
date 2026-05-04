import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createTransaction, generateMerchantOrderId } from '@/lib/duitku'

// Duitku payment code mapping
const DUITKU_PAYMENT_CODES: Record<string, Record<string, string>> = {
  va: {
    BCA: 'BC',
    MANDIRI: 'M1',
    BNI: 'I1',
    BRI: 'BR',
    PERMATA: 'BT',
    CIMB: 'B1',
  },
  qris: {
    DEFAULT: 'SP', // ShopeePay QRIS
  },
  ewallet: {
    OVO: 'OV',
    DANA: 'DA',
    SHOPEEPAY: 'SP',
  },
}

/**
 * POST /api/order/[id]/pay
 * Client initiates payment via Duitku
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { paymentId, method, bankCode } = body

    if (!paymentId || !method) {
      return NextResponse.json({ error: 'paymentId and method are required' }, { status: 400 })
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        whatsapp: true,
        total_price: true,
        project_title: true,
        pricing_package: { select: { name: true } },
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Get payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId, order_id: id }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    if (payment.status === 'CONFIRMED') {
      return NextResponse.json({ error: 'Payment already confirmed' }, { status: 400 })
    }

    // Resolve Duitku payment code
    const methodCodes = DUITKU_PAYMENT_CODES[method]
    if (!methodCodes) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
    }

    const duitkuPaymentCode = methodCodes[bankCode || 'DEFAULT'] || methodCodes[Object.keys(methodCodes)[0]]
    if (!duitkuPaymentCode) {
      return NextResponse.json({ error: 'Invalid bank code' }, { status: 400 })
    }

    const amount = Number(payment.amount)
    const merchantOrderId = generateMerchantOrderId()
    const projectName = order.project_title || order.pricing_package?.name || 'Project'

    // Create Duitku transaction
    const duitkuResponse = await createTransaction({
      merchantOrderId,
      paymentAmount: amount,
      paymentMethod: duitkuPaymentCode,
      productDetails: `Pembayaran ${payment.label || 'Proyek'} - ${projectName}`,
      email: order.email || 'client@monark.studio',
      phoneNumber: order.whatsapp,
      customerVaName: order.name,
      expiryPeriod: 1440, // 24 hours
      itemDetails: [
        {
          name: `${payment.label || 'Payment'} - ${projectName}`,
          price: amount,
          quantity: 1
        }
      ]
    })

    const expiryDate = new Date()
    expiryDate.setMinutes(expiryDate.getMinutes() + 1440)

    // Update payment with Duitku data
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        duitku_reference: duitkuResponse.reference,
        duitku_payment_url: duitkuResponse.paymentUrl,
        duitku_va_number: duitkuResponse.vaNumber || null,
        duitku_payment_code: duitkuPaymentCode,
        duitku_expiry: expiryDate,
        merchant_order_id: merchantOrderId,
        payment_method: method === 'va' ? `VA ${bankCode}` : method === 'qris' ? 'QRIS' : bankCode || 'E-Wallet',
      }
    })

    return NextResponse.json({
      paymentUrl: duitkuResponse.paymentUrl,
      vaNumber: duitkuResponse.vaNumber,
      reference: duitkuResponse.reference,
      expiryDate: expiryDate.toISOString(),
    })
  } catch (error: any) {
    console.error('[CLIENT_PAY]', error)
    return NextResponse.json(
      { error: error.message || 'Gagal memproses pembayaran' },
      { status: 500 }
    )
  }
}
