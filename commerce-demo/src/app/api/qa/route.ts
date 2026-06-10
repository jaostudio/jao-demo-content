import { NextResponse } from 'next/server'
import { getProductQuestions, askQuestion } from '@/lib/actions/qa'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  const result = await getProductQuestions(productId)
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json({ qas: result.qas })
}

export async function POST(req: Request) {
  const { productId, question } = await req.json()
  if (!productId || !question) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  const result = await askQuestion(productId, 'Customer', question)
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json({ qa: result.qa })
}
