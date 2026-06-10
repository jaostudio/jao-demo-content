import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { productIds: slugs } = await req.json()
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    select: { id: true },
  })
  const cartDbIds = products.map((p) => p.id)

  const bundles = await prisma.bundle.findMany({ where: { active: true } })
  const applicable: { name: string; discountTotal: number }[] = []

  for (const bundle of bundles) {
    const requiredIds: string[] = JSON.parse(bundle.productIds)
    const matched = requiredIds.filter((id) => cartDbIds.includes(id))
    if (matched.length === requiredIds.length) {
      applicable.push({ name: bundle.name, discountTotal: bundle.discountTotal })
    }
  }

  return NextResponse.json(applicable)
}
