import { PrismaClient } from '@prisma/marketplace-client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@marketplace.dev' },
    update: {},
    create: { name: 'Admin', email: 'admin@marketplace.dev', password, role: 'ADMIN' },
  })

  const vendor1 = await prisma.user.upsert({
    where: { email: 'alice@crafts.com' },
    update: {},
    create: { name: 'Alice Chen', email: 'alice@crafts.com', password, role: 'VENDOR' },
  })

  const vendor2 = await prisma.user.upsert({
    where: { email: 'bob@vintage.com' },
    update: {},
    create: { name: 'Bob Martinez', email: 'bob@vintage.com', password, role: 'VENDOR' },
  })

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@test.com' },
    update: {},
    create: { name: 'Test Buyer', email: 'buyer@test.com', password, role: 'BUYER' },
  })

  const categories = [
    { name: 'Handmade', slug: 'handmade' },
    { name: 'Vintage', slug: 'vintage' },
    { name: 'Art', slug: 'art' },
    { name: 'Home Decor', slug: 'home-decor' },
    { name: 'Food & Drink', slug: 'food-drink' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  const handmadeCat = await prisma.category.findUnique({ where: { slug: 'handmade' } })!
  const vintageCat = await prisma.category.findUnique({ where: { slug: 'vintage' } })!
  const artCat = await prisma.category.findUnique({ where: { slug: 'art' } })!
  const homeCat = await prisma.category.findUnique({ where: { slug: 'home-decor' } })!
  const foodCat = await prisma.category.findUnique({ where: { slug: 'food-drink' } })!

  const listings = [
    { title: 'Handwoven Wool Scarf', slug: 'handwoven-wool-scarf', description: 'Warm merino wool scarf, hand-dyed with natural indigo.', price: 4500, categoryId: handmadeCat!.id, vendorId: vendor1.id },
    { title: 'Ceramic Pour-Over Set', slug: 'ceramic-pour-over-set', description: 'Hand-thrown ceramic dripper with matching carafe. Holds 4 cups.', price: 6800, categoryId: handmadeCat!.id, vendorId: vendor1.id },
    { title: 'Vintage Leather Satchel', slug: 'vintage-leather-satchel', description: 'Genuine leather satchel from the 1970s. Patina tells a story.', price: 12500, categoryId: vintageCat!.id, vendorId: vendor2.id },
    { title: 'Retro Film Camera', slug: 'retro-film-camera', description: 'Fully functional Olympus OM-1 with 50mm f/1.8 lens.', price: 22000, categoryId: vintageCat!.id, vendorId: vendor2.id },
    { title: 'Abstract Oil Painting', slug: 'abstract-oil-painting', description: 'Original 24x36 oil on canvas. Deep blues and golds.', price: 34000, categoryId: artCat!.id, vendorId: vendor1.id },
    { title: 'Hand-Printed Linocut Print', slug: 'linocut-print', description: 'Limited edition linocut on archival paper. Signed and numbered.', price: 8500, categoryId: artCat!.id, vendorId: vendor2.id },
    { title: 'Macrame Wall Hanging', slug: 'macrame-wall-hanging', description: 'Large macrame wall hanging with wooden beads and fringe.', price: 9500, categoryId: homeCat!.id, vendorId: vendor1.id },
    { title: 'Soy Candle Trio', slug: 'soy-candle-trio', description: 'Set of 3 hand-poured soy candles: lavender, cedar, vanilla.', price: 3600, categoryId: homeCat!.id, vendorId: vendor1.id },
    { title: 'Small-Batch Hot Sauce', slug: 'small-batch-hot-sauce', description: 'Fermented habanero hot sauce. 8oz bottle. Medium heat.', price: 1400, categoryId: foodCat!.id, vendorId: vendor2.id },
    { title: 'Artisan Chocolate Box', slug: 'artisan-chocolate-box', description: '12-piece selection of single-origin dark chocolates.', price: 2800, categoryId: foodCat!.id, vendorId: vendor2.id },
  ]

  for (const l of listings) {
    const existing = await prisma.listing.findUnique({ where: { slug: l.slug } })
    if (!existing) {
      await prisma.listing.create({
        data: {
          ...l,
          status: 'APPROVED',
          images: {
            create: [{ url: `/images/${l.slug}.jpg`, alt: l.title, sortOrder: 0 }],
          },
        },
      })
    }
  }

  const listing1 = await prisma.listing.findUnique({ where: { slug: 'handwoven-wool-scarf' } })
  const listing2 = await prisma.listing.findUnique({ where: { slug: 'retro-film-camera' } })

  if (listing1 && listing2) {
    await prisma.review.upsert({
      where: { listingId_authorId: { listingId: listing1.id, authorId: buyer.id } },
      update: {},
      create: { rating: 5, text: 'Beautiful scarf, colors are even better in person!', listingId: listing1.id, authorId: buyer.id },
    })
    await prisma.review.upsert({
      where: { listingId_authorId: { listingId: listing2.id, authorId: buyer.id } },
      update: {},
      create: { rating: 4, text: 'Camera works perfectly. Lens has some minor haze but still takes great photos.', listingId: listing2.id, authorId: buyer.id },
    })
  }

  console.log('Seeded successfully')
}

main().catch((e) => { console.error(e); process.exit(1) })
