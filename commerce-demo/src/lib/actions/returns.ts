'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function requestReturn(orderId: string, reason: string) {
  try {
    const session = await auth()
    const email = session?.user?.email

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) {
      return { success: false, error: 'Order not found' }
    }

    if (email && order.email !== email) {
      return { success: false, error: 'This order does not belong to you' }
    }

    const returnRequest = await prisma.returnRequest.create({
      data: { orderId, reason },
    })

    return { success: true, returnRequest }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to request return' }
  }
}

export async function updateReturnStatus(returnId: string, status: string, adminNotes?: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized — login required' }
    }

    const updated = await prisma.returnRequest.update({
      where: { id: returnId },
      data: { status, ...(adminNotes !== undefined && { adminNotes }) },
    })

    return { success: true, returnRequest: updated }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update return status' }
  }
}

export async function getReturnRequests(orderId?: string) {
  try {
    const where = orderId ? { orderId } : {}

    const returnRequests = await prisma.returnRequest.findMany({
      where,
      include: { order: { select: { orderNumber: true, name: true, total: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, returnRequests }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch return requests' }
  }
}
