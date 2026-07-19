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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Upsert: Update if exists, create if not
    const price = await prisma.complexityPrice.upsert({
      where: {
        level_sub_level: {
          level: body.level,
          sub_level: body.sub_level
        }
      },
      update: {
        price: body.price
      },
      create: {
        level: body.level,
        sub_level: body.sub_level,
        price: body.price
      }
    })
    return NextResponse.json(price)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update price' }, { status: 500 })
  }
}
