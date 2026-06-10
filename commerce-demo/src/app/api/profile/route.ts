import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, mobile, avatar } = await req.json()
  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, mobile, avatar },
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.user.update({
    where: { id: session.user.id },
    data: { deletedAt: new Date(), isActive: false },
  })
  return NextResponse.json({ ok: true })
}
