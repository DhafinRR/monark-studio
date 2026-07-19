import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/public/terms-conditions
 * Fetch active terms & conditions content (singleton, public-facing)
 */
export async function GET() {
  try {
    const termsCondition = await prisma.termsCondition.findUnique({
      where: { id: 'default' },
      select: {
        id: true,
        title: true,
        content: true,
        is_active: true,
        updated_at: true
      }
    })

    // Return 404 if not found or not active
    if (!termsCondition || !termsCondition.is_active) {
      return NextResponse.json(
        { error: 'Terms & conditions not found or inactive' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: termsCondition
    })
  } catch (error) {
    console.error('Failed to fetch terms & conditions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch terms & conditions' },
      { status: 500 }
    )
  }
}
