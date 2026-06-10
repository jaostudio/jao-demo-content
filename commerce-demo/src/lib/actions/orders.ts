'use server'

import { prisma } from '@/lib/prisma'
import { createNotification } from './notifications'

function generateOrderNumber(): string {
  const now = new Date()
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `PK-${date}-${rand}`
}

export async function createOrder(formData: FormData) {
  const itemsRaw = formData.get('items') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const mobile = formData.get('mobile') as string
  const region = formData.get('region') as string
  const province = formData.get('province') as string
  const city = formData.get('city') as string
  const barangay = formData.get('barangay') as string
  const paymentMethod = formData.get('paymentMethod') as string
  const gcashRef = formData.get('gcashRef') as string

  const items: Array<{ productId: string; slug: string; name: string; price: number; image: string; quantity: number }> =
    JSON.parse(itemsRaw)

  if (items.length === 0) throw new Error('Cart is empty')
  if (!name || !email || !region || !province || !city || !barangay) throw new Error('Missing required fields')

  // Check inventory for each item
  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { slug: item.slug } })
    if (!product) throw new Error(`${item.name} is no longer available`)
    if (product.inventory < item.quantity) {
      throw new Error(`Ubos na, mamsir! — ${item.name} only has ${product.inventory} left`)
    }
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  // Create order with items
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      total,
      name,
      email,
      mobile,
      region,
      province,
      city,
      barangay,
      paymentMethod,
      paymentRef: gcashRef || null,
      status: 'active',
      paymentState: paymentMethod === 'gcash' ? 'paid' : 'pending_payment',
      fulfillmentState: 'unfulfilled',
      items: {
        create: items.map((i) => ({
          productId: i.productId ?? i.slug,
          productName: i.name,
          productImage: i.image,
          quantity: i.quantity,
          priceAtPurchase: i.price,
        })),
      },
    },
  })

  // Decrement inventory
  for (const item of items) {
    await prisma.product.update({
      where: { slug: item.slug },
      data: { inventory: { decrement: item.quantity } },
    })
  }

  // Notify user
  const user = await prisma.user.findUnique({ where: { email } })
  if (user) {
    await createNotification(
      user.id,
      'order_created',
      `Order ${order.orderNumber} received! Bihis na si Kuya Rider.`,
      `/orders/${order.id}`,
      order.id,
    )
  }

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

export async function updateFulfillmentState(orderId: string, newState: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) throw new Error('Order not found')

  const validTransitions: Record<string, string[]> = {
    unfulfilled: ['processing'],
    processing: ['shipped'],
    shipped: ['delivered'],
    delivered: [],
    returned: [],
  }

  const allowed = validTransitions[order.fulfillmentState] ?? []
  if (!allowed.includes(newState)) throw new Error('Invalid fulfillment transition')

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { fulfillmentState: newState },
  })

  // Notify user
  if (order.email) {
    const user = await prisma.user.findUnique({ where: { email: order.email } })
    if (user) {
      const messages: Record<string, string> = {
        unfulfilled: 'Kukunin pa lang ni Kuya Rider',
        processing: 'Nasa tricycle na — on the way!',
        shipped: 'Nasa courier na — malapit na!',
        delivered: 'Nadeliver na! Enjoy, mamsir!',
        returned: 'Binalik na ang order.',
      }
      await createNotification(
        user.id,
        `order_${newState}`,
        `Order ${order.orderNumber}: ${messages[newState] ?? newState}`,
        `/orders/${orderId}`,
        orderId,
      )
    }
  }

  return updated
}

export async function updatePaymentState(orderId: string, newState: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) throw new Error('Order not found')

  const validTransitions: Record<string, string[]> = {
    pending_payment: ['paid', 'refunded'],
    paid: ['refunded'],
    refunded: [],
  }

  const allowed = validTransitions[order.paymentState] ?? []
  if (!allowed.includes(newState)) throw new Error('Invalid payment transition')

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { paymentState: newState },
  })

  // Notify user
  if (order.email) {
    const user = await prisma.user.findUnique({ where: { email: order.email } })
    if (user) {
      const messages: Record<string, string> = {
        paid: 'Bayad na! Thank you, mamsir!',
        refunded: 'Refunded na ang order mo.',
      }
      if (messages[newState]) {
        await createNotification(
          user.id,
          `payment_${newState}`,
          `Order ${order.orderNumber}: ${messages[newState]}`,
          `/orders/${orderId}`,
          orderId,
        )
      }
    }
  }

  return updated
}

export async function getProductsWithStock() {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function upsertProduct(data: {
  id?: string
  nameEn: string
  nameTl: string
  slug: string
  descriptionEn: string
  descriptionTl: string
  price: number
  image: string
  categoryId: string
  inventory: number
  vendor: string
}) {
  if (data.id) {
    return prisma.product.update({ where: { id: data.id }, data })
  }
  return prisma.product.create({ data })
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } })
}
