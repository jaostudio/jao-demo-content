import { NextResponse } from 'next/server'
import { getProductReviews, createReview } from '@/lib/actions/reviews'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  const result = await getProductReviews(productId)
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json({ reviews: result.reviews })
}

export async function POST(req: Request) {
  const { productId, rating, comment, author } = await req.json()
  if (!productId || !rating || !comment) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  const result = await createReview(productId, rating, comment, author)
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json({ review: result.review })
}
