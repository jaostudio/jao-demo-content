import { PrismaClient } from '@prisma/commerce-client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'
import { categories } from '../src/content/categories'
import { products } from '../src/content/products'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

function daysAgo(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60))
  return d
}

const ordersData = [
  {
    orderNumber: 'SS-20250609-AB12',
    daysAgo: 0,
    name: 'Maria Santos',
    email: 'maria.santos@gmail.com',
    mobile: '09171234567',
    region: 'NCR',
    province: 'Metro Manila',
    city: 'Quezon City',
    barangay: 'Diliman',
    paymentMethod: 'cod',
    paymentState: 'pending_payment',
    fulfillmentState: 'unfulfilled',
    status: 'active',
    items: [
      { slug: 'chocnut', qty: 5, price: 500 },
      { slug: 'kopiko', qty: 3, price: 800 },
    ],
  },
  {
    orderNumber: 'SS-20250609-CD34',
    daysAgo: 0,
    name: 'Jose Rizal II',
    email: 'jose.rizal@yahoo.com',
    mobile: '09181234567',
    region: 'NCR',
    province: 'Metro Manila',
    city: 'Makati',
    barangay: 'Poblacion',
    paymentMethod: 'cod',
    paymentState: 'pending_payment',
    fulfillmentState: 'unfulfilled',
    status: 'active',
    items: [
      { slug: 'pancit-canton', qty: 4, price: 1500 },
      { slug: 'coke-bote', qty: 2, price: 2000 },
      { slug: 'piattos', qty: 3, price: 1000 },
    ],
  },
  {
    orderNumber: 'SS-20250608-EF56',
    daysAgo: 1,
    name: 'Catherine Lim',
    email: 'cat.lim@outlook.com',
    mobile: '09191234567',
    region: 'Region IV-A (CALABARZON)',
    province: 'Laguna',
    city: 'Calamba',
    barangay: 'Real',
    paymentMethod: 'gcash',
    paymentState: 'paid',
    fulfillmentState: 'processing',
    status: 'active',
    paymentRef: 'GC5678901234',
    items: [
      { slug: 'oishii', qty: 6, price: 200 },
      { slug: 'mikmik', qty: 4, price: 300 },
      { slug: 'nooda-crunch', qty: 3, price: 500 },
    ],
  },
  {
    orderNumber: 'SS-20250608-GH78',
    daysAgo: 1,
    name: 'Pedro Cruz',
    email: 'pedro.cruz@gmail.com',
    mobile: '09201234567',
    region: 'NCR',
    province: 'Metro Manila',
    city: 'Mandaluyong',
    barangay: 'Barangay 1',
    paymentMethod: 'gcash',
    paymentState: 'paid',
    fulfillmentState: 'processing',
    status: 'active',
    paymentRef: 'GC6789012345',
    items: [
      { slug: 'pancit-canton', qty: 10, price: 1500 },
      { slug: 'chikadees', qty: 5, price: 500 },
      { slug: 'royal', qty: 3, price: 2000 },
    ],
  },
  {
    orderNumber: 'SS-20250607-IJ90',
    daysAgo: 2,
    name: 'Luzviminda Aquino',
    email: 'luz.aquino@yahoo.com',
    mobile: '09211234567',
    region: 'NCR',
    province: 'Metro Manila',
    city: 'Pasig',
    barangay: 'Kapitolyo',
    paymentMethod: 'cod',
    paymentState: 'paid',
    fulfillmentState: 'shipped',
    status: 'active',
    items: [
      { slug: 'yakee', qty: 20, price: 100 },
      { slug: 'xo-coffee', qty: 15, price: 100 },
      { slug: 'kopiko-candy', qty: 15, price: 100 },
    ],
  },
  {
    orderNumber: 'SS-20250607-KL12',
    daysAgo: 2,
    name: 'Antonio Reyes',
    email: 'tony.reyes@gmail.com',
    mobile: '09221234567',
    region: 'Region III (Central Luzon)',
    province: 'Bulacan',
    city: 'Malolos',
    barangay: 'Barangay 1',
    paymentMethod: 'gcash',
    paymentState: 'paid',
    fulfillmentState: 'shipped',
    status: 'active',
    paymentRef: 'GC7890123456',
    items: [
      { slug: 'argentina-corned-beef', qty: 3, price: 3000 },
      { slug: 'payless', qty: 5, price: 1200 },
      { slug: 'great-taste', qty: 4, price: 800 },
    ],
  },
  {
    orderNumber: 'SS-20250606-MN34',
    daysAgo: 3,
    name: 'Grace Fernandez',
    email: 'grace.fernandez@outlook.com',
    mobile: '09231234567',
    region: 'NCR',
    province: 'Metro Manila',
    city: 'Taguig',
    barangay: 'Barangay 1',
    paymentMethod: 'cod',
    paymentState: 'refunded',
    fulfillmentState: 'returned',
    status: 'active',
    items: [
      { slug: 'white-rabbit', qty: 10, price: 200 },
      { slug: 'tattoos', qty: 3, price: 600 },
    ],
  },
  {
    orderNumber: 'SS-20250604-OP56',
    daysAgo: 5,
    name: 'Ramon Bautista',
    email: 'ramon.bautista@gmail.com',
    mobile: '09241234567',
    region: 'NCR',
    province: 'Metro Manila',
    city: 'Manila',
    barangay: 'Intramuros',
    paymentMethod: 'cod',
    paymentState: 'paid',
    fulfillmentState: 'delivered',
    status: 'active',
    items: [
      { slug: 'zonrox', qty: 2, price: 1000 },
      { slug: 'safeguard', qty: 3, price: 1500 },
      { slug: 'privince', qty: 4, price: 500 },
    ],
  },
  {
    orderNumber: 'SS-20250602-QR78',
    daysAgo: 7,
    name: 'Elena Villanueva',
    email: 'elena.villanueva@yahoo.com',
    mobile: '09251234567',
    region: 'Region IV-A (CALABARZON)',
    province: 'Cavite',
    city: 'Imus',
    barangay: 'Zone 1',
    paymentMethod: 'gcash',
    paymentState: 'paid',
    fulfillmentState: 'delivered',
    status: 'active',
    paymentRef: 'GC8901234567',
    items: [
      { slug: 'surf', qty: 5, price: 500 },
      { slug: 'nissin-cup', qty: 4, price: 2000 },
      { slug: 'pritos-ring', qty: 3, price: 700 },
      { slug: 'coke-bote', qty: 2, price: 2000 },
    ],
  },
]

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Seed demo users
  const demoPassword = await bcrypt.hash('password123', 12)
  await prisma.user.create({
    data: {
      email: 'customer@sari-sari.dev',
      password: demoPassword,
      name: 'Juan Dela Cruz',
      role: 'customer',
      mobile: '09171234567',
    },
  })
  console.log('✓ User: customer@sari-sari.dev / password123 (customer)')

  await prisma.user.create({
    data: {
      email: 'admin@sari-sari.dev',
      password: demoPassword,
      name: 'Aling Nena',
      role: 'admin',
      mobile: '09181234567',
    },
  })
  console.log('✓ User: admin@sari-sari.dev / password123 (admin)')

  // Seed categories
  for (const cat of categories) {
    await prisma.category.create({
      data: { nameEn: cat.nameEn, nameTl: cat.nameTl, slug: cat.slug },
    })
    console.log(`✓ Category: ${cat.nameTl}`)
  }

  // Seed products
  for (const p of products) {
    const category = await prisma.category.findUnique({ where: { slug: p.categorySlug } })
    if (!category) {
      console.warn(`Category not found for ${p.slug}, skipping`)
      continue
    }
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
    console.log(`✓ Product: ${p.nameTl} (${p.inventory} stock)`)
  }

  // Seed orders
  for (const o of ordersData) {
    const total = o.items.reduce((sum, i) => sum + i.price * i.qty, 0)
    const created = daysAgo(o.daysAgo)

    // Resolve productIds
    const itemsWithIds = await Promise.all(
      o.items.map(async (item) => {
        const product = await prisma.product.findUnique({ where: { slug: item.slug } })
        return {
          productId: product?.id ?? item.slug,
          productName: product?.nameTl ?? item.slug,
          productImage: product?.image ?? '',
          quantity: item.qty,
          priceAtPurchase: item.price,
        }
      }),
    )

    await prisma.order.create({
      data: {
        orderNumber: o.orderNumber,
        status: o.status,
        paymentState: o.paymentState,
        fulfillmentState: o.fulfillmentState,
        total,
        email: o.email,
        name: o.name,
        mobile: o.mobile,
        region: o.region,
        province: o.province,
        city: o.city,
        barangay: o.barangay,
        paymentMethod: o.paymentMethod,
        paymentRef: o.paymentRef ?? null,
        createdAt: created,
        items: { create: itemsWithIds },
      },
    })
    console.log(`✓ Order: ${o.orderNumber} (${o.fulfillmentState}, ₱${(total / 100).toFixed(2)})`)
  }

  console.log('\n✅ Seeded successfully!')
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1) })
