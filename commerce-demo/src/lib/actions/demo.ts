'use server'

import { prisma } from '@/lib/prisma'
import { categories } from '@/content/categories'
import { products } from '@/content/products'
import { revalidatePath } from 'next/cache'

export async function resetDemoData() {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  for (const cat of categories) {
    await prisma.category.create({
      data: { nameEn: cat.nameEn, nameTl: cat.nameTl, slug: cat.slug },
    })
  }

  for (const p of products) {
    const category = await prisma.category.findUnique({ where: { slug: p.categorySlug } })
    if (!category) continue
    await prisma.product.create({
      data: {
        nameEn: p.nameEn,
        nameTl: p.nameTl,
        slug: p.slug,
        descriptionEn: p.descriptionEn,
        descriptionTl: p.descriptionTl,
        price: p.price,
        image: p.image,
        categoryId: category.id,
        inventory: p.inventory,
        vendorName: p.vendor,
      },
    })
  }

  revalidatePath('/', 'layout')
  return { ok: true }
}