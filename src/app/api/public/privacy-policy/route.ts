import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/public/privacy-policy
 * Fetch active privacy policy content (singleton, public-facing)
 */
export async function GET() {
  try {
    const privacyPolicy = await prisma.privacyPolicy.findUnique({
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
    if (!privacyPolicy || !privacyPolicy.is_active) {
      return NextResponse.json(
        { error: 'Privacy policy not found or inactive' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: privacyPolicy
    })
  } catch (error) {
    console.error('Failed to fetch privacy policy:', error)
    return NextResponse.json(
      { error: 'Failed to fetch privacy policy' },
      { status: 500 }
    )
  }
}
