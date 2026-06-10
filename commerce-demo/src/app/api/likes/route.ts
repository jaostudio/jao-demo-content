import { NextResponse } from 'next/server'
import { toggleLike, getProductLikeCount } from '@/lib/actions/likes'

export async function POST(req: Request) {
  const { productId } = await req.json()
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  const result = await toggleLike(productId)
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
  const countResult = await getProductLikeCount(productId)
  return NextResponse.json({ liked: result.liked, count: countResult.success ? countResult.count : 0 })
}
