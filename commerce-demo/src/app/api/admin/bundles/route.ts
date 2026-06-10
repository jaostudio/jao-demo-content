import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  const formData = await req.formData()
  const name = formData.get('name') as string
  const productIds = formData.getAll('productIds') as string[]
  const discountTotal = Number(formData.get('discountTotal'))

  await prisma.bundle.create({
    data: {
      name,
      productIds: JSON.stringify(productIds),
      discountTotal,
    },
  })
  revalidatePath('/admin/bundles')
  return NextResponse.redirect(new URL('/admin/bundles', req.url))
}
