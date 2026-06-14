import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const commentSchema = z.object({
  authorName: z.string().min(1, 'Name is required').max(50),
  authorEmail: z.string().email('Enter a valid email').max(100),
  body: z.string().min(1, 'Comment cannot be empty').max(1000),
})

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const article = await prisma.article.findUnique({ where: { id, status: 'PUBLISHED' } })
  if (!article) {
    return Response.json({ error: 'Article not found' }, { status: 404 })
  }

  const body = await req.json()
  const parsed = commentSchema.safeParse(body)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return Response.json({ error: first?.message ?? 'Invalid input' }, { status: 400 })
  }

  const comment = await prisma.comment.create({
    data: { articleId: id, ...parsed.data },
  })

  return Response.json(comment)
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const comments = await prisma.comment.findMany({
    where: { articleId: id },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json(comments)
}
