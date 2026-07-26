import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const packages = await prisma.pricingPackage.findMany({
      where: { is_active: true },
      orderBy: { floor_price: 'asc' }
    })
    return NextResponse.json(packages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pricing packages' }, { status: 500 })
  }
}
