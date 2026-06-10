import { prisma } from '@/lib/prisma'

export async function getApplicableBundles(cartProductIds: string[]) {
  const bundles = await prisma.bundle.findMany({ where: { active: true } })
  const applicable: { bundle: typeof bundles[0]; matchedIds: string[] }[] = []

  for (const bundle of bundles) {
    const requiredIds: string[] = JSON.parse(bundle.productIds)
    const matched = requiredIds.filter((id) => cartProductIds.includes(id))
    if (matched.length === requiredIds.length) {
      applicable.push({ bundle, matchedIds: matched })
    }
  }

  return applicable
}
