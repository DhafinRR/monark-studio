import { NextRequest, NextResponse } from 'next/server'

/**
 * Duitku Return/Redirect endpoint
 * Client is redirected here after completing payment on Duitku page
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const merchantOrderId = searchParams.get('merchantOrderId') || ''
  const resultCode = searchParams.get('resultCode') || ''

  // Redirect to client-friendly payment status page
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
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
