'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function createNotification(
  userId: string,
  type: string,
  message: string,
  link?: string,
  orderId?: string,
) {
  return prisma.notification.create({
    data: { userId, type, message, link, orderId },
  })
}

export async function getUserNotifications(limit = 10) {
  const session = await auth()
  if (!session?.user?.email) return []
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
  if (!user) return []
  return prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function markNotificationRead(id: string) {
  const session = await auth()
  if (!session?.user?.email) return
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
  if (!user) return
  await prisma.notification.updateMany({
    where: { id, userId: user.id },
    data: { isRead: true },
  })
}

export async function markAllNotificationsRead() {
  const session = await auth()
  if (!session?.user?.email) return
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
  if (!user) return
  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  })
}

export async function getUnreadCount() {
  const session = await auth()
  if (!session?.user?.email) return 0
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
  if (!user) return 0
  return prisma.notification.count({
    where: { userId: user.id, isRead: false },
  })
}
