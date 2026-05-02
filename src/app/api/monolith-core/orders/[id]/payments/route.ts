import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { adminLimiter, checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { z } from 'zod'
import { tooManyRequests, badRequest, internalError, notFound } from '@/lib/api-response'
import { createTransaction, generateMerchantOrderId, generateWhatsAppPaymentMessage } from '@/lib/duitku'

const createPaymentSchema = z.object({
  amount: z.union([z.string(), z.number()]),
  payment_method: z.string().optional(),
  label: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
  // Duitku integration fields
  duitku_payment_code: z.string().optional(), // Payment method code (VA, BT, etc.)
  use_duitku: z.boolean().optional(), // Whether to create Duitku transaction
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
      select: { 
        id: true, 
        total_price: true, 
        name: true, 
        email: true, 
        whatsapp: true,
        project_title: true,
        pricing_package: { select: { name: true } }
      }
    })

    if (!order) {
      return notFound('Order not found')
    }

    const amount = parseFloat(String(body.amount))
    const useDuitku = body.use_duitku !== false && body.duitku_payment_code
    
    let duitkuData: {
      duitku_reference?: string
      duitku_payment_url?: string
      duitku_va_number?: string
      duitku_payment_code?: string
      duitku_expiry?: Date
      merchant_order_id?: string
    } = {}

    // Create Duitku transaction if requested
    if (useDuitku) {
      const merchantOrderId = generateMerchantOrderId()
      const projectName = order.project_title || order.pricing_package?.name || 'Project'
      
      try {
        const duitkuResponse = await createTransaction({
          merchantOrderId,
          paymentAmount: amount,
          paymentMethod: body.duitku_payment_code,
          productDetails: `Pembayaran ${body.label || 'Termin'} - ${projectName}`,
          email: order.email || 'client@monark.studio',
          phoneNumber: order.whatsapp,
          customerVaName: order.name,
          expiryPeriod: 1440, // 24 hours
          itemDetails: [
            {
              name: `${body.label || 'Payment'} - ${projectName}`,
              price: amount,
              quantity: 1
            }
          ]
        })

        const expiryDate = new Date()
        expiryDate.setMinutes(expiryDate.getMinutes() + 1440)

        duitkuData = {
          duitku_reference: duitkuResponse.reference,
          duitku_payment_url: duitkuResponse.paymentUrl,
          duitku_va_number: duitkuResponse.vaNumber || undefined,
          duitku_payment_code: body.duitku_payment_code,
          duitku_expiry: expiryDate,
          merchant_order_id: merchantOrderId,
        }
      } catch (duitkuError: any) {
        console.error('[DUITKU_CREATE_TX]', duitkuError)
        return NextResponse.json(
          { error: `Duitku Error: ${duitkuError.message}` },
          { status: 502 }
        )
      }
    }

    const payment = await prisma.payment.create({
      data: {
        order_id: id,
        amount,
        payment_method: body.payment_method || body.duitku_payment_code,
        label: body.label,
        notes: body.notes,
        status: body.status || 'PENDING',
        paid_at: body.status === 'CONFIRMED' ? new Date() : null,
        ...duitkuData,
      }
    })

    // Generate WhatsApp message if Duitku payment was created
    let whatsapp_message: string | undefined
    let whatsapp_url: string | undefined

    if (duitkuData.duitku_payment_url) {
      const projectName = order.project_title || order.pricing_package?.name || 'Project'
      
      whatsapp_message = generateWhatsAppPaymentMessage({
        clientName: order.name,
        projectName,
        label: body.label || 'Pembayaran',
        amount,
        paymentUrl: duitkuData.duitku_payment_url,
        vaNumber: duitkuData.duitku_va_number,
        paymentMethod: body.payment_method,
        expiryDate: duitkuData.duitku_expiry,
      })

      // Format WhatsApp number (remove + prefix, ensure starts with country code)
      let waNumber = order.whatsapp.replace(/[^0-9]/g, '')
      if (waNumber.startsWith('0')) {
        waNumber = '62' + waNumber.substring(1)
      }
      
      whatsapp_url = `https://wa.me/${waNumber}?text=${encodeURIComponent(whatsapp_message)}`
    }

    return NextResponse.json({
      ...payment,
      whatsapp_message,
      whatsapp_url,
    }, { status: 201 })
  } catch (error) {
    console.error('[PAYMENT_CREATE]', error)
    return internalError('Failed to create payment')
  }
}
