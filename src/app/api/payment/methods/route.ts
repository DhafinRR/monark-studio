import { NextRequest, NextResponse } from 'next/server'
import { getPaymentMethods } from '@/lib/duitku'

/**
 * Get available Duitku payment methods for a given amount
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const amount = parseInt(searchParams.get('amount') || '0')

    if (!amount || amount < 10000) {
      return NextResponse.json(
        { error: 'Amount harus minimal Rp 10.000' },
        { status: 400 }
      )
    }

    const methods = await getPaymentMethods(amount)

    return NextResponse.json({ methods })
  } catch (error: any) {
    console.error('[PAYMENT_METHODS]', error)
    return NextResponse.json(
      { error: error.message || 'Gagal mengambil metode pembayaran' },
      { status: 500 }
    )
  }
}
