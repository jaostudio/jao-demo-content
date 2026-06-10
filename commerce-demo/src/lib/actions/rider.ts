'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function assignRider(orderId: string, riderName: string, eta: string) {
  try {
    const session = await auth()
    if (!session?.user?.email?.includes('admin')) {
      return { success: false, error: 'Unauthorized — admin access required' }
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) {
      return { success: false, error: 'Order not found' }
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { riderName, eta },
    })

    return { success: true, order: updated }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to assign rider' }
  }
}

export async function getRiderInfo(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { riderName: true, eta: true },
    })

    if (!order) {
      return { success: false, error: 'Order not found' }
    }

    return { success: true, riderName: order.riderName, eta: order.eta }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch rider info' }
  }
}
