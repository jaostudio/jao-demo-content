'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function createReview(productId: string, rating: number, comment: string, author: string) {
  try {
    const session = await auth()
    const userId = session?.user?.id ?? undefined

    const review = await prisma.review.create({
      data: { productId, rating, comment, author, userId },
    })

    return { success: true, review }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create review' }
  }
}

export async function getProductReviews(productId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, reviews }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch reviews' }
  }
}
