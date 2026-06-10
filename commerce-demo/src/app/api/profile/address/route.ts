import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { label, region, province, city, barangay, street } = await req.json()
  const addr = await prisma.address.create({
    data: { userId: session.user.id, label, region, province, city, barangay, street },
  })
  return NextResponse.json(addr)
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await prisma.address.deleteMany({ where: { id, userId: session.user.id } })
  return NextResponse.json({ ok: true })
}
