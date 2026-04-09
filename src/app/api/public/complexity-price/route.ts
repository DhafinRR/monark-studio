import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const prices = await prisma.complexityPrice.findMany()
    return NextResponse.json(prices)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch complexity prices' }, { status: 500 })
  }
}
