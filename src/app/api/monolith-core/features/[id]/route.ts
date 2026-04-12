import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { adminLimiter, checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { tooManyRequests, internalError, notFound } from '@/lib/api-response'

export async function DELETE(
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
    await prisma.featureCatalog.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return notFound('Feature not found')
    }
    return internalError('Failed to delete feature')
  }
}
