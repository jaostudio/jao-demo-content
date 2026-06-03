'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { transitionListing, transitionPayment } from '@jaostudio/core/state-machines'
import { emit } from '@jaostudio/core/events'
import { revalidatePath } from 'next/cache'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function createListing(formData: FormData) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!user || user.role !== 'VENDOR') throw new Error('Unauthorized')

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseInt(formData.get('price') as string)
  const categorySlug = formData.get('category') as string

  if (!title || !description || !price || !categorySlug) throw new Error('Missing fields')

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
  if (!category) throw new Error('Invalid category')

  const slug = slugify(title)
  const existing = await prisma.listing.findUnique({ where: { slug } })
  if (existing) throw new Error('Listing with this title already exists')

  const listing = await prisma.listing.create({
    data: {
      title,
      slug,
      description,
      price,
      status: 'DRAFT',
      vendorId: user.id,
      categoryId: category.id,
    },
  })

  // Transition from DRAFT to PENDING_REVIEW
  const newStatus = transitionListing('draft', 'submit', {
    hasRequiredFields: true,
    isVerifiedVendor: true,
    actor: 'vendor',
    role: 'user',
  })
  if (newStatus === 'pending_review') {
    await prisma.listing.update({
      where: { id: listing.id },
      data: { status: 'PENDING_REVIEW' },
    })
  }

  emit.listingTransitioned(listing.id, 'draft', newStatus)

  revalidatePath('/listings')
  return { slug: listing.slug }
}

export async function moderateListing(listingId: string, action: 'approve' | 'reject') {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!user || user.role !== 'ADMIN') throw new Error('Unauthorized')

  const listing = await prisma.listing.findUnique({ where: { id: listingId } })
  if (!listing) throw new Error('Listing not found')

  const stateKey = listing.status.toLowerCase() as any
  const newStatus = transitionListing(stateKey, action, {
    hasRequiredFields: true,
    isVerifiedVendor: true,
    actor: 'admin',
    role: 'admin',
  })
  if (newStatus === stateKey) throw new Error('Invalid transition')

  await prisma.listing.update({
    where: { id: listingId },
    data: {
      status: newStatus.toUpperCase() as any,
      moderatedAt: new Date(),
      moderatedById: user.id,
    },
  })

  emit.listingTransitioned(listingId, stateKey, newStatus)
  revalidatePath('/admin/listings')
  revalidatePath('/listings')
}

export async function createOrder(formData: FormData) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!user) throw new Error('Unauthorized')

  const itemsRaw = formData.get('items') as string
  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const address = formData.get('address') as string

  const items: Array<{ listingId: string; vendorId: string; name: string; price: number; quantity: number }> =
    JSON.parse(itemsRaw)

  if (items.length === 0) throw new Error('Cart is empty')
  if (!email || !name || !address) throw new Error('Missing required fields')

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

  // Single order per vendor — marketplace creates one order per vendor
  const vendorId = items[0].vendorId
  const order = await prisma.order.create({
    data: {
      orderNumber,
      total,
      email,
      name,
      address,
      buyerId: user.id,
      vendorId,
      items: {
        create: items.map((i) => ({
          listingId: i.listingId,
          productName: i.name,
          priceAtPurchase: i.price,
          quantity: i.quantity,
        })),
      },
    },
  })

  const nextPayment = transitionPayment('pending_payment', 'confirm_payment', {
    total,
    items: items.length,
    actor: 'buyer',
    role: 'user',
  })
  if (nextPayment === 'paid') {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentState: 'PAID' },
    })
  }

  const causeId = `evt_${Date.now()}_checkout`
  emit.orderCreated(order.id, total, 'usd', undefined, causeId)
  emit.orderTransitioned(order.id, 'pending_payment', nextPayment, undefined, causeId)

  return { orderId: order.id }
}
