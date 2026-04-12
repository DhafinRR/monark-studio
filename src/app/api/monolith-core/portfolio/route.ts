import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { adminLimiter, checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { createPortfolioSchema } from '@/lib/validations'
import { badRequest, tooManyRequests, internalError } from '@/lib/api-response'

export async function GET() {
  try {
    const projects = await prisma.portfolioProject.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        stacks: true,
      },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('[PORTFOLIO_GET]', error)
    return internalError('Gagal mengambil data Portfolio')
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

    const parseResult = createPortfolioSchema.safeParse(body)
    if (!parseResult.success) {
      return badRequest(`Validation failed: ${parseResult.error.issues.map(i => i.message).join(', ')}`)
    }

    const {
      title,
      description,
      full_description,
      type,
      image_url,
      gallery,
      stacks,
      features,
      client_name,
      project_url,
      role,
      status,
      start_date,
      end_date,
    } = body

    const project = await prisma.portfolioProject.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        full_description: full_description || null,
        type: type || 'WEB',
        image_url: image_url.trim(),
        gallery: Array.isArray(gallery) ? gallery : [],
        features: Array.isArray(features) ? features : [],
        client_name: client_name || null,
        project_url: project_url || null,
        role: role || null,
        status: status || 'Live',
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        stacks: Array.isArray(stacks) && stacks.length > 0
          ? { connect: stacks.map((id: string) => ({ id })) }
          : undefined,
      },
      include: {
        stacks: true,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('[PORTFOLIO_POST]', error)
    return internalError('Gagal membuat Portfolio')
  }
}
