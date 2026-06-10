'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function toggleLike(productId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'You must be logged in to like a product' }
    }

    const userId = session.user.id
    const existing = await prisma.userLike.findUnique({
      where: { userId_productId: { userId, productId } },
    })

    if (existing) {
      await prisma.userLike.delete({ where: { id: existing.id } })
      return { success: true, liked: false }
    }

    await prisma.userLike.create({ data: { userId, productId } })
    return { success: true, liked: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to toggle like' }
  }
}

export async function getUserLikes() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const likes = await prisma.userLike.findMany({
      where: { userId: session.user.id },
      select: { productId: true },
    })

    return { success: true, productIds: likes.map((l) => l.productId) }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch likes' }
  }
}

export async function getProductLikeCount(productId: string) {
  try {
    const count = await prisma.userLike.count({ where: { productId } })
    return { success: true, count }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch like count' }
  }
}
