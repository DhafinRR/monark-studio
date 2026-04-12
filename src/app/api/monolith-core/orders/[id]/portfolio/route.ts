import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { adminLimiter, checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { z } from 'zod'
import { tooManyRequests, internalError, notFound, badRequest, forbidden } from '@/lib/api-response'

const createPortfolioSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().optional(),
  client_name: z.string().optional(),
  project_url: z.string().optional(),
  role: z.string().optional(),
})

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

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
                pricing_package: true
            }
        })

        if (!order) {
            return notFound('Order not found')
        }

        if ((order as any).portfolio_id) {
            return badRequest('Order already has a portfolio. Delete the existing portfolio first.')
        }

        const parseResult = createPortfolioSchema.safeParse(body)
        if (!parseResult.success) {
            return badRequest(`Validation failed: ${parseResult.error.issues.map(i => i.message).join(', ')}`)
        }

        const { title, description, image_url, client_name, project_url, role } = body

        const portfolio = await prisma.$transaction(async (tx) => {
            const newPortfolio = await tx.portfolioProject.create({
                data: {
                    title: title || `Project - ${order.name}`,
                    description: description || order.details || `Project for ${order.name}`,
                    image_url: image_url || '/assets/placeholder.jpg',
                    client_name: client_name || order.name,
                    project_url: project_url || order.preview_link || null,
                    role: role || 'Development',
                    features: order.items.map(item => item.description),
                }
            })

            await tx.order.update({
                where: { id },
                data: {
                    portfolio: {
                        connect: { id: newPortfolio.id }
                    }
                }
            })

            return newPortfolio
        })

        return NextResponse.json(portfolio, { status: 201 })
    } catch (error) {
        console.error('[CREATE_PORTFOLIO_FROM_ORDER]', error)
        return internalError('Failed to create portfolio from order')
    }
}
