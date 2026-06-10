import { prisma } from '@/lib/prisma'

export async function getKPI() {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalOrders, todayOrders, weekOrders, monthOrders,
    totalRevenue, todayRevenue,
    completedOrders, refundedOrders,
    lowStock,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentState: 'paid' } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: todayStart }, paymentState: 'paid' } }),
    prisma.order.count({ where: { fulfillmentState: 'fulfilled' } }),
    prisma.returnRequest.count({ where: { status: 'approved' } }),
    prisma.product.count({ where: { inventory: { lte: 5 } } }),
  ])

  const revenue = totalRevenue._sum.total ?? 0
  const aov = completedOrders > 0 ? Math.round(revenue / completedOrders) : 0
  const refundRate = completedOrders > 0 ? (refundedOrders / completedOrders) * 100 : 0

  return {
    totalOrders,
    todayOrders,
    weekOrders,
    monthOrders,
    totalRevenue: revenue,
    todayRevenue: todayRevenue._sum.total ?? 0,
    aov,
    refundRate: Math.round(refundRate * 10) / 10,
    lowStock,
    completedOrders,
    refundedOrders,
  }
}

export async function getTopProducts(limit = 10) {
  const items = await prisma.orderItem.findMany({
    select: { productId: true, productName: true, quantity: true, priceAtPurchase: true },
  })
  const agg = new Map<string, { name: string; units: number; revenue: number }>()
  for (const i of items) {
    const existing = agg.get(i.productId) ?? { name: i.productName, units: 0, revenue: 0 }
    existing.units += i.quantity
    existing.revenue += i.quantity * i.priceAtPurchase
    existing.name = i.productName
    agg.set(i.productId, existing)
  }
  return Array.from(agg.values())
    .sort((a, b) => b.units - a.units)
    .slice(0, limit)
    .map((i) => ({
      name: i.name,
      unitsSold: i.units,
      revenue: i.revenue,
      avgPrice: i.units > 0 ? Math.round(i.revenue / i.units) : 0,
    }))
}

export async function getRevenueByCategory() {
  const orders = await prisma.order.findMany({
    where: { paymentState: 'paid' },
    select: {
      items: {
        select: {
          quantity: true,
          priceAtPurchase: true,
          productId: true,
        },
      },
    },
  })
  const products = await prisma.product.findMany({
    select: { id: true, category: { select: { nameTl: true, nameEn: true } } },
  })
  const catMap = new Map<string, { nameTl: string; nameEn: string }>()
  for (const p of products) {
    catMap.set(p.id, p.category)
  }
  const categoryRevenue = new Map<string, number>()
  for (const order of orders) {
    for (const item of order.items) {
      const cat = catMap.get(item.productId)
      const catName = cat?.nameEn ?? 'Uncategorized'
      const rev = item.quantity * item.priceAtPurchase
      categoryRevenue.set(catName, (categoryRevenue.get(catName) ?? 0) + rev)
    }
  }
  return Array.from(categoryRevenue.entries())
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
}

export async function getDailySales(days = 30) {
  const start = new Date()
  start.setDate(start.getDate() - days)
  start.setHours(0, 0, 0, 0)

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: start }, paymentState: 'paid' },
    select: { total: true, createdAt: true },
  })

  const daily = new Map<string, number>()
  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    daily.set(d.toISOString().slice(0, 10), 0)
  }
  for (const o of orders) {
    const key = o.createdAt.toISOString().slice(0, 10)
    daily.set(key, (daily.get(key) ?? 0) + o.total)
  }
  return Array.from(daily.entries()).map(([date, revenue]) => ({ date, revenue }))
}

export async function getLowStockProducts() {
  return prisma.product.findMany({
    where: { inventory: { lte: 5 } },
    orderBy: { inventory: 'asc' },
    take: 5,
    select: { nameTl: true, nameEn: true, inventory: true, price: true },
  })
}

export async function getCsvData() {
  const kpi = await getKPI()
  const top = await getTopProducts(50)
  const daily = await getDailySales(90)
  const catRev = await getRevenueByCategory()
  return { kpi, topProducts: top, dailySales: daily, categoryRevenue: catRev }
}

export function formatToPhp(cents: number) {
  return `₱${(cents / 100).toFixed(2)}`
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const lines = rows.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','))
  return [headers.join(','), ...lines].join('\n')
}
