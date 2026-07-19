import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/privacy-policy
 * Get privacy policy content (singleton - only one record)
 */
export async function GET() {
  try {
    const privacyPolicy = await prisma.privacyPolicy.findUnique({
      where: { id: 'default' }
    })

    if (!privacyPolicy) {
      return NextResponse.json(
        { success: false, error: 'Privacy policy not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: privacyPolicy
    })
  } catch (error) {
    console.error('Error fetching privacy policy:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch privacy policy' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/privacy-policy
 * Update privacy policy content (singleton - always updates id="default")
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, is_active } = body

    // Validation - at least one field should be provided
    if (!title && !content && is_active === undefined) {
      return NextResponse.json(
        { success: false, error: 'No fields provided to update' },
        { status: 400 }
      )
    }

    const privacyPolicy = await prisma.privacyPolicy.upsert({
      where: { id: 'default' },
      update: {
        ...(title && { title }),
        ...(content && { content }),
        ...(is_active !== undefined && { is_active })
      },
      create: {
        id: 'default',
        title: title || 'Privacy & Policy',
        content: content || '',
        is_active: is_active ?? true
      }
    })

    return NextResponse.json({
      success: true,
      data: privacyPolicy,
      message: 'Privacy policy updated successfully'
    })
  } catch (error) {
    console.error('Error updating privacy policy:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update privacy policy' },
      { status: 500 }
    )
  }
}
