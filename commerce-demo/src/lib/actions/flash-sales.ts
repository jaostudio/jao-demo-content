'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getActiveFlashSale(productId: string) {
  const now = new Date()
  return prisma.flashSale.findFirst({
    where: {
      productId,
      startTime: { lte: now },
      endTime: { gte: now },
    },
  })
}

export async function createFlashSale(data: {
  productId: string
  discountPercent: number
  startTime: string
  endTime: string
}) {
  await prisma.flashSale.create({
    data: {
      productId: data.productId,
      discountPercent: data.discountPercent,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    },
  })
  revalidatePath('/', 'layout')
}

export async function deleteFlashSale(id: string) {
  await prisma.flashSale.delete({ where: { id } })
  revalidatePath('/', 'layout')
}
