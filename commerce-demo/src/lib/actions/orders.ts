'use server'

import { prisma } from '@/lib/prisma'
import { transitionPayment, transitionFulfillment } from '@jaostudio/core/state-machines'
import { emit } from '@jaostudio/core/events'
import type { PaymentState, FulfillmentState } from '@jaostudio/core/state-machines'

function generateOrderNumber(): string {
  return `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

export async function createOrder(formData: FormData) {
  const itemsRaw = formData.get('items') as string
  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const address = formData.get('address') as string

  const items: Array<{ slug: string; name: string; price: number; image: string; quantity: number }> =
    JSON.parse(itemsRaw)

  if (items.length === 0) throw new Error('Cart is empty')
  if (!email || !name || !address) throw new Error('Missing required fields')

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      total,
      email,
      name,
      address,
      items: {
        create: items.map((i) => ({
          productName: i.name,
          productImage: i.image,
          quantity: i.quantity,
          priceAtPurchase: i.price,
        })),
      },
    },
  })

  const nextState = transitionPayment('pending_payment', 'confirm_payment', {
    total,
    items: items.length,
    actor: 'buyer',
    role: 'user',
  })

  if (nextState === 'paid') {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentState: nextState, status: 'active' },
    })
  }

  const orderCreatedEventId = `evt_${Date.now()}_0`
  emit.orderCreated(order.id, total, 'usd', undefined, orderCreatedEventId)
  emit.orderTransitioned(order.id, 'pending_payment', nextState, undefined, orderCreatedEventId)

  return { orderId: order.id, orderNumber: order.orderNumber }
}

export async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })
}

export async function getOrders() {
  return prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function transitionOrderFulfillment(orderId: string, event: 'process' | 'ship' | 'return_fulfillment') {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) throw new Error('Order not found')

  const newState = transitionFulfillment(order.fulfillmentState as FulfillmentState, event, {
    total: order.total,
    items: 0,
    actor: 'admin',
    role: 'admin',
  })
  if (newState === order.fulfillmentState) throw new Error('Invalid transition')

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { fulfillmentState: newState },
  })

  emit.orderTransitioned(orderId, order.fulfillmentState, newState)
  return updated
}

export async function transitionOrderPayment(orderId: string, event: 'refund_payment') {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) throw new Error('Order not found')

  const newState = transitionPayment(order.paymentState as PaymentState, event, {
    total: order.total,
    items: 0,
    actor: 'admin',
    role: 'admin',
  })
  if (newState === order.paymentState) throw new Error('Invalid transition')

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { paymentState: newState },
  })

  emit.orderTransitioned(orderId, order.paymentState, newState)
  return updated
}
