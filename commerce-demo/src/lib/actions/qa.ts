'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function askQuestion(productId: string, askerName: string, question: string) {
  try {
    const qa = await prisma.productQA.create({
      data: { productId, askerName, question },
    })

    return { success: true, qa }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to submit question' }
  }
}

export async function answerQuestion(qaId: string, answer: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized — login required' }
    }

    const updated = await prisma.productQA.update({
      where: { id: qaId },
      data: { answer },
    })

    return { success: true, qa: updated }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to submit answer' }
  }
}

export async function getProductQuestions(productId: string) {
  try {
    const qas = await prisma.productQA.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, qas }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch questions' }
  }
}
