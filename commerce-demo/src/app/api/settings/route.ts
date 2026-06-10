import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  const { key, value } = await req.json()
  if (!key || typeof value !== 'string') {
    return NextResponse.json({ error: 'key and value required' }, { status: 400 })
  }
  await prisma.appSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  })
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const settings = await prisma.appSetting.findMany()
  const map: Record<string, string> = {}
  for (const s of settings) map[s.key] = s.value
  return NextResponse.json(map)
}
