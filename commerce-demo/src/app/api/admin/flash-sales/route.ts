import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { productId, discountPercent, startTime, endTime } = await req.json()
  await prisma.flashSale.create({
    data: {
      productId,
      discountPercent,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
  })
  return NextResponse.json({ ok: true })
}
