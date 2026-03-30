import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const features = await prisma.featureCatalog.findMany({
      orderBy: { created_at: 'desc' }
    })
    return NextResponse.json(features)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
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
    return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 })
  }
}
