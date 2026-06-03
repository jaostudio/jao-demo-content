import { prisma } from './prisma'

export async function getProducts() {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })
}

export async function getProductsByCategory(categorySlug: string) {
  return prisma.product.findMany({
    where: { category: { slug: categorySlug } },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
}
