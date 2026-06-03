import { PrismaClient } from '@prisma/commerce-client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { categories } from '../src/content/categories'
import { products } from '../src/content/products'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
})
const prisma = new PrismaClient({ adapter })

async function main() {
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  for (const p of products) {
    const category = await prisma.category.findUnique({ where: { slug: p.categorySlug } })
    if (!category) {
      console.warn(`Category not found for ${p.slug}, skipping`)
      continue
    }
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        image: p.image,
        categoryId: category.id,
        inventory: p.inventory,
      },
    })
  }
}

main()
  .then(() => { console.log('Seeded successfully'); process.exit(0) })
  .catch((e) => { console.error(e); process.exit(1) })
