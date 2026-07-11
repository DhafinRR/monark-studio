import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/terms-conditions
 * Get terms & conditions content (singleton - only one record)
 */
export async function GET() {
  try {
    const termsCondition = await prisma.termsCondition.findUnique({
      where: { id: 'default' }
    })

    if (!termsCondition) {
      return NextResponse.json(
        { success: false, error: 'Terms & conditions not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: termsCondition
    })
  } catch (error) {
    console.error('Error fetching terms & conditions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch terms & conditions' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/terms-conditions
 * Update terms & conditions content (singleton - always updates id="default")
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

    const termsCondition = await prisma.termsCondition.upsert({
      where: { id: 'default' },
      update: {
        ...(title && { title }),
        ...(content && { content }),
        ...(is_active !== undefined && { is_active })
      },
      create: {
        id: 'default',
        title: title || 'Terms & Conditions',
        content: content || '',
        is_active: is_active ?? true
      }
    })

    return NextResponse.json({
      success: true,
      data: termsCondition,
      message: 'Terms & conditions updated successfully'
    })
  } catch (error) {
    console.error('Error updating terms & conditions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update terms & conditions' },
      { status: 500 }
    )
  }
}
