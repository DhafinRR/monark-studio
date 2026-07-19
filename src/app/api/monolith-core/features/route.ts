import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { adminLimiter, checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { createFeatureSchema } from '@/lib/validations'
import { badRequest, tooManyRequests, internalError } from '@/lib/api-response'

export async function GET() {
  try {
    const features = await prisma.featureCatalog.findMany({
      orderBy: { created_at: 'desc' }
    })
    return NextResponse.json(features)
  } catch (error) {
    return internalError('Failed to fetch features')
  }
}

export async function POST(req: Request) {
  const ip = getClientIP(req)
  const rateCheck = await checkRateLimit(adminLimiter, ip)
  if (!rateCheck.allowed) {
    return tooManyRequests(rateCheck.retryAfter!)
  }

  try {
    const body = await req.json()

    const parseResult = createFeatureSchema.safeParse(body)
    if (!parseResult.success) {
      return badRequest(`Validation failed: ${parseResult.error.issues.map(i => i.message).join(', ')}`)
    }

    const feature = await prisma.featureCatalog.create({
      data: {
        name: body.name,
        category: body.category,
        price: body.price,
        description: body.description,
      }
    })
    return NextResponse.json(feature)
  } catch (error) {
    return internalError('Failed to create feature')
  }
}
