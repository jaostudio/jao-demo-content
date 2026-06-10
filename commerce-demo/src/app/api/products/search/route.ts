import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  if (!q?.trim()) return NextResponse.json({ products: [] })
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { nameEn: { contains: q.trim() } },
        { nameTl: { contains: q.trim() } },
      ],
    },
    select: { slug: true, nameTl: true, nameEn: true, price: true, image: true },
    take: 8,
  })
  return NextResponse.json({ products })
}
