import { NextResponse } from 'next/server'
import { requestReturn } from '@/lib/actions/returns'

export async function POST(req: Request) {
  const { orderId, reason } = await req.json()
  if (!orderId || !reason) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  const result = await requestReturn(orderId, reason)
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json({ returnRequest: result.returnRequest })
}
